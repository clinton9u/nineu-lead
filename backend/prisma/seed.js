import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedBusiness() {
  const business = await prisma.business.upsert({
    where: { slug: "luma-aesthetics" },
    update: {
      name: "Luma Aesthetics",
      industry: "wellness",
      website: "https://www.lumaaesthetics.com",
    },
    create: {
      name: "Luma Aesthetics",
      slug: "luma-aesthetics",
      industry: "wellness",
      website: "https://www.lumaaesthetics.com",
    },
  });

  const serviceCount = await prisma.service.count({
    where: { businessId: business.id },
  });

  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        { businessId: business.id, name: "Signature Facial", description: "Deep cleansing facial treatment", price: 149.00 },
        { businessId: business.id, name: "Botox Consultation", description: "Consultation and treatment planning", price: 199.00 },
        { businessId: business.id, name: "Laser Hair Removal", description: "Hair reduction treatment package", price: 249.00 },
      ],
    });
  }

  const leadCount = await prisma.lead.count({
    where: { businessId: business.id },
  });

  if (leadCount === 0) {
    await prisma.lead.createMany({
      data: [
        {
          businessId: business.id,
          customerName: "Maya Patel",
          serviceInterest: "Botox Consultation",
          preferredDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
          source: "website_chat",
          timeline: "This week",
          qualification: "HOT",
          nextAction: "Call within 1 hour and offer a consultation slot.",
          leadStatus: "NEW",
          booked: false,
          paid: false,
        },
        {
          businessId: business.id,
          customerName: "Jordan Lee",
          serviceInterest: "Laser Hair Removal",
          preferredDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
          source: "website_chat",
          timeline: "Next 2 weeks",
          qualification: "WARM",
          nextAction: "Send a pricing and consultation follow-up.",
          leadStatus: "BOOKED",
          booked: true,
          paid: false,
        },
      ],
    });
  }

  console.log(`Seeded demo business: ${business.name} (${business.slug})`);
}

try {
  await seedBusiness();
} catch (error) {
  console.error("Seeding failed:", error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
