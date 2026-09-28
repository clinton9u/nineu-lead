import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedBusiness() {
  const business = await prisma.business.upsert({
    where: { slug: "luma-aesthetics" },
    update: {
      name: "Luma Aesthetics",
      industry: "wellness",
      website: "https://www.lumaaesthetics.com",
      description: "Personalized aesthetic services for glow, refinement, and confidence. We offer cutting-edge treatments to help you look and feel your best.",
    },
    create: {
      name: "Luma Aesthetics",
      slug: "luma-aesthetics",
      industry: "wellness",
      website: "https://www.lumaaesthetics.com",
      description: "Personalized aesthetic services for glow, refinement, and confidence. We offer cutting-edge treatments to help you look and feel your best.",
    },
  });

  // Upsert Knowledge Base
  await prisma.knowledge.upsert({
    where: { businessId: business.id },
    update: {
      businessDescription: "At Luma Aesthetics, we specialize in non-invasive aesthetic treatments designed to enhance your natural beauty. Our team of licensed professionals uses the latest technology and techniques to deliver results you can see and feel.",
      contactEmail: "hello@lumaaesthetics.com",
      contactPhone: "+1 (555) 123-4567",
      bookingUrl: "https://lumaaesthetics.com/book",
      paymentUrl: "https://lumaaesthetics.com/pay",
    },
    create: {
      businessId: business.id,
      businessDescription: "At Luma Aesthetics, we specialize in non-invasive aesthetic treatments designed to enhance your natural beauty. Our team of licensed professionals uses the latest technology and techniques to deliver results you can see and feel.",
      contactEmail: "hello@lumaaesthetics.com",
      contactPhone: "+1 (555) 123-4567",
      bookingUrl: "https://lumaaesthetics.com/book",
      paymentUrl: "https://lumaaesthetics.com/pay",
    },
  });

  // Clear and recreate services
  await prisma.service.deleteMany({ where: { businessId: business.id } });
  await prisma.service.createMany({
    data: [
      {
        businessId: business.id,
        name: "Signature Facial",
        description: "Deep cleansing and hydrating facial treatment with a customized mask suited to your skin type.",
        price: 149.00,
      },
      {
        businessId: business.id,
        name: "Botox Consultation",
        description: "Expert consultation and treatment planning for wrinkle reduction and facial rejuvenation.",
        price: 199.00,
      },
      {
        businessId: business.id,
        name: "Laser Hair Removal",
        description: "Advanced laser technology for permanent hair reduction. Results visible within 3-6 sessions.",
        price: 249.00,
      },
      {
        businessId: business.id,
        name: "Microdermabrasion Treatment",
        description: "Gentle exfoliation to improve skin texture, reduce fine lines, and enhance radiance.",
        price: 129.00,
      },
      {
        businessId: business.id,
        name: "Chemical Peel",
        description: "Professional-grade chemical peel to address acne, hyperpigmentation, and aging skin.",
        price: 179.00,
      },
    ],
  });

  // Clear and recreate FAQs
  await prisma.fAQ.deleteMany({ where: { businessId: business.id } });
  await prisma.fAQ.createMany({
    data: [
      {
        businessId: business.id,
        question: "How long does a Botox treatment last?",
        answer: "Results typically appear within 3-7 days and fully develop over 2 weeks. Effects last approximately 3-4 months. Most clients schedule treatments quarterly for best results.",
        category: "botox",
      },
      {
        businessId: business.id,
        question: "Is laser hair removal permanent?",
        answer: "Laser hair removal is a permanent reduction of hair growth. Most clients see 80-90% permanent hair reduction after 6-8 sessions. Some fine hairs may regrow over time, but they are typically lighter and finer.",
        category: "laser",
      },
      {
        businessId: business.id,
        question: "Do facials hurt?",
        answer: "No, our facials are relaxing and painless. You may feel gentle pressure during the treatment, but nothing uncomfortable. Many clients fall asleep during their appointment!",
        category: "facials",
      },
      {
        businessId: business.id,
        question: "What skin types can get laser hair removal?",
        answer: "Our advanced laser systems work on all skin types. During your consultation, we'll assess your skin and hair type to ensure the best results and safety.",
        category: "laser",
      },
      {
        businessId: business.id,
        question: "Can I get a facial if I have sensitive skin?",
        answer: "Absolutely! We offer sensitive skin facials with gentle, calming products. Please mention your sensitivities during booking so we can customize the treatment.",
        category: "facials",
      },
    ],
  });

  // Clear and recreate policies
  await prisma.policy.deleteMany({ where: { businessId: business.id } });
  await prisma.policy.createMany({
    data: [
      {
        businessId: business.id,
        name: "Cancellation Policy",
        content: "Cancellations must be made 24 hours in advance. Late cancellations or no-shows will be charged 50% of the service price.",
      },
      {
        businessId: business.id,
        name: "Results Guarantee",
        content: "We stand behind our treatments. If you're not satisfied with your results after 30 days, we offer a free touch-up treatment.",
      },
      {
        businessId: business.id,
        name: "Aftercare",
        content: "Please avoid sun exposure and strenuous exercise for 24 hours after treatment. Use sunscreen SPF 30+ daily and follow our specific aftercare instructions provided at your appointment.",
      },
      {
        businessId: business.id,
        name: "Payment Terms",
        content: "We accept all major credit cards, debit cards, and digital payments. A deposit is required to secure your appointment.",
      },
    ],
  });

  // Clear and recreate business hours
  await prisma.businessHours.deleteMany({ where: { businessId: business.id } });
  await prisma.businessHours.createMany({
    data: [
      { businessId: business.id, dayOfWeek: 0, openTime: "10:00 AM", closeTime: "6:00 PM", isClosed: false }, // Monday
      { businessId: business.id, dayOfWeek: 1, openTime: "10:00 AM", closeTime: "6:00 PM", isClosed: false }, // Tuesday
      { businessId: business.id, dayOfWeek: 2, openTime: "10:00 AM", closeTime: "6:00 PM", isClosed: false }, // Wednesday
      { businessId: business.id, dayOfWeek: 3, openTime: "10:00 AM", closeTime: "6:00 PM", isClosed: false }, // Thursday
      { businessId: business.id, dayOfWeek: 4, openTime: "10:00 AM", closeTime: "7:00 PM", isClosed: false }, // Friday
      { businessId: business.id, dayOfWeek: 5, openTime: "9:00 AM", closeTime: "5:00 PM", isClosed: false }, // Saturday
      { businessId: business.id, dayOfWeek: 6, isClosed: true }, // Sunday
    ],
  });

  console.log(`Seeded Luma Aesthetics with complete knowledge base, FAQs, policies, and business hours.`);
}

try {
  await seedBusiness();
} catch (error) {
  console.error("Seeding failed:", error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
