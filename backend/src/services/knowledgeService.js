import { prisma } from "../db.js";

export async function getBusinessKnowledge(businessId) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      knowledge: true,
      services: true,
      faqs: true,
      policies: true,
      businessHours: {
        orderBy: { dayOfWeek: "asc" },
      },
    },
  });

  if (!business) return null;

  return {
    id: business.id,
    name: business.name,
    industry: business.industry,
    description: business.description || business.knowledge?.businessDescription,
    contactEmail: business.knowledge?.contactEmail,
    contactPhone: business.knowledge?.contactPhone,
    bookingUrl: business.knowledge?.bookingUrl,
    paymentUrl: business.knowledge?.paymentUrl,
    services: business.services.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      price: s.price ? parseFloat(s.price) : null,
    })),
    faqs: business.faqs.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category,
    })),
    policies: business.policies.map((p) => ({
      id: p.id,
      name: p.name,
      content: p.content,
    })),
    businessHours: business.businessHours.map((h) => ({
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
    })),
  };
}

export async function getBusinessKnowledgeBySlug(businessSlug) {
  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
  });

  if (!business) return null;
  return getBusinessKnowledge(business.id);
}

export async function updateBusinessKnowledge(businessId, updates) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) throw new Error("Business not found");

  const { businessDescription, contactEmail, contactPhone, bookingUrl, paymentUrl } = updates;

  const knowledge = await prisma.knowledge.upsert({
    where: { businessId },
    update: {
      businessDescription,
      contactEmail,
      contactPhone,
      bookingUrl,
      paymentUrl,
    },
    create: {
      businessId,
      businessDescription,
      contactEmail,
      contactPhone,
      bookingUrl,
      paymentUrl,
    },
  });

  return knowledge;
}

export async function createFAQ(businessId, { question, answer, category = "general" }) {
  const faq = await prisma.fAQ.create({
    data: {
      businessId,
      question,
      answer,
      category,
    },
  });
  return faq;
}

export async function updateFAQ(faqId, { question, answer, category }) {
  const faq = await prisma.fAQ.update({
    where: { id: faqId },
    data: { question, answer, category },
  });
  return faq;
}

export async function deleteFAQ(faqId) {
  await prisma.fAQ.delete({ where: { id: faqId } });
}

export async function createPolicy(businessId, { name, content }) {
  const policy = await prisma.policy.create({
    data: {
      businessId,
      name,
      content,
    },
  });
  return policy;
}

export async function updatePolicy(policyId, { name, content }) {
  const policy = await prisma.policy.update({
    where: { id: policyId },
    data: { name, content },
  });
  return policy;
}

export async function deletePolicy(policyId) {
  await prisma.policy.delete({ where: { id: policyId } });
}

export async function setBusinessHours(businessId, hours) {
  await prisma.businessHours.deleteMany({ where: { businessId } });

  const created = await prisma.businessHours.createMany({
    data: hours.map((h) => ({
      businessId,
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
    })),
  });

  return created;
}

export function formatKnowledgeForAssistant(knowledge) {
  if (!knowledge) return "No business information available.";

  let formatted = `BUSINESS KNOWLEDGE BASE\n\n`;

  formatted += `Business: ${knowledge.name}\n`;
  if (knowledge.description) formatted += `About: ${knowledge.description}\n\n`;

  if (knowledge.services && knowledge.services.length > 0) {
    formatted += `SERVICES:\n`;
    knowledge.services.forEach((s) => {
      formatted += `- ${s.name}`;
      if (s.price) formatted += ` ($${s.price})`;
      if (s.description) formatted += `: ${s.description}`;
      formatted += `\n`;
    });
    formatted += `\n`;
  }

  if (knowledge.businessHours && knowledge.businessHours.length > 0) {
    formatted += `HOURS:\n`;
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    knowledge.businessHours.forEach((h) => {
      const day = days[h.dayOfWeek];
      if (h.isClosed) {
        formatted += `${day}: Closed\n`;
      } else {
        formatted += `${day}: ${h.openTime || "N/A"} - ${h.closeTime || "N/A"}\n`;
      }
    });
    formatted += `\n`;
  }

  if (knowledge.faqs && knowledge.faqs.length > 0) {
    formatted += `FREQUENTLY ASKED QUESTIONS:\n`;
    knowledge.faqs.forEach((f) => {
      formatted += `Q: ${f.question}\n`;
      formatted += `A: ${f.answer}\n\n`;
    });
  }

  if (knowledge.policies && knowledge.policies.length > 0) {
    formatted += `POLICIES:\n`;
    knowledge.policies.forEach((p) => {
      formatted += `${p.name}: ${p.content}\n`;
    });
    formatted += `\n`;
  }

  if (knowledge.contactPhone) formatted += `Phone: ${knowledge.contactPhone}\n`;
  if (knowledge.contactEmail) formatted += `Email: ${knowledge.contactEmail}\n`;
  if (knowledge.bookingUrl) formatted += `Booking: ${knowledge.bookingUrl}\n`;
  if (knowledge.paymentUrl) formatted += `Payment: ${knowledge.paymentUrl}\n`;

  return formatted;
}
