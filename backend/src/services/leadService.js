import { prisma } from "../db.js";
import { calculateLeadQualification, recommendNextAction } from "../utils/qualification.js";

export async function ensureBusinessBySlug(slug = "luma-aesthetics") {
  const business = await prisma.business.upsert({
    where: { slug },
    update: {
      name: "Luma Aesthetics",
      industry: "wellness",
      website: "https://www.lumaaesthetics.com",
    },
    create: {
      name: "Luma Aesthetics",
      slug,
      industry: "wellness",
      website: "https://www.lumaaesthetics.com",
    },
  });

  return business;
}

export function buildDashboardMetrics(leads = []) {
  const totalLeads = leads.length;
  const hotLeads = leads.filter((lead) => lead.qualification === "HOT").length;
  const bookedLeads = leads.filter((lead) => lead.leadStatus === "BOOKED").length;
  const convertedLeads = leads.filter((lead) => lead.leadStatus === "CONVERTED").length;
  const revenue = leads.reduce((sum, lead) => {
    if (lead.revenue) return sum + Number(lead.revenue);
    return sum;
  }, 0);

  return {
    totalLeads,
    hotLeads,
    bookedLeads,
    convertedLeads,
    revenue,
  };
}

export async function createLead({
  businessSlug,
  customerName,
  serviceInterest,
  preferredDate,
  source = "website_chat",
  email = null,
  phone = null,
  timeline = null,
}) {
  const business = await ensureBusinessBySlug(businessSlug || "luma-aesthetics");

  const parsedDate = preferredDate ? new Date(preferredDate) : null;
  const qualification = calculateLeadQualification({
    serviceInterest,
    preferredDate: parsedDate,
    leadAgeHours: 4,
  });

  const nextAction = recommendNextAction(qualification, serviceInterest);

  const lead = await prisma.lead.create({
    data: {
      businessId: business.id,
      customerName,
      email,
      phone,
      serviceInterest,
      preferredDate: parsedDate,
      source,
      timeline,
      qualification,
      nextAction,
      leadStatus: "NEW",
    },
  });

  return { business, lead };
}
