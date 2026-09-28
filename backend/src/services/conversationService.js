import { formatKnowledgeForAssistant } from "./knowledgeService.js";

export function generateAssistantResponse(userMessage, businessKnowledge) {
  const message = userMessage.toLowerCase().trim();
  const knowledgeBase = formatKnowledgeForAssistant(businessKnowledge);

  // Check for pricing questions
  if (message.includes("price") || message.includes("cost") || message.includes("how much")) {
    if (businessKnowledge?.services && businessKnowledge.services.length > 0) {
      const services = businessKnowledge.services
        .filter((s) => s.price)
        .map((s) => `${s.name}: $${s.price}`)
        .join(", ");
      if (services) {
        return `Our services start at:\n${services}\n\nWould you like more details about any specific service?`;
      }
    }
    return `I don't have current pricing information. Please contact us at ${businessKnowledge?.contactPhone || businessKnowledge?.contactEmail || "our office"} for pricing details.`;
  }

  // Check for service questions
  if (message.includes("service") || message.includes("treatment") || message.includes("offer")) {
    if (businessKnowledge?.services && businessKnowledge.services.length > 0) {
      const services = businessKnowledge.services.map((s) => `• ${s.name}${s.description ? ": " + s.description : ""}`).join("\n");
      return `We offer the following services:\n${services}\n\nWhich one interests you?`;
    }
    return `I don't have a current list of services. Please contact us to learn about what we offer.`;
  }

  // Check for hours questions
  if (message.includes("hour") || message.includes("open") || message.includes("available") || message.includes("when")) {
    if (businessKnowledge?.businessHours && businessKnowledge.businessHours.length > 0) {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const hours = businessKnowledge.businessHours
        .map((h) => {
          const day = days[h.dayOfWeek];
          if (h.isClosed) return `${day}: Closed`;
          return `${day}: ${h.openTime} - ${h.closeTime}`;
        })
        .join("\n");
      return `Here are our business hours:\n${hours}`;
    }
    return `I don't have our hours on file. Please contact us directly.`;
  }

  // Check for FAQ matches
  if (businessKnowledge?.faqs && businessKnowledge.faqs.length > 0) {
    const matchedFAQ = businessKnowledge.faqs.find((f) => message.includes(f.question.toLowerCase().split(" ").slice(0, 3).join(" ")));
    if (matchedFAQ) {
      return matchedFAQ.answer;
    }
  }

  // Check for policy questions
  if (message.includes("policy") || message.includes("return") || message.includes("cancel") || message.includes("refund")) {
    if (businessKnowledge?.policies && businessKnowledge.policies.length > 0) {
      const policies = businessKnowledge.policies.map((p) => `${p.name}: ${p.content}`).join("\n\n");
      return `Here are our policies:\n\n${policies}`;
    }
    return `I don't have detailed policy information. Please contact us to discuss.`;
  }

  // Check for booking questions
  if (message.includes("book") || message.includes("appointment") || message.includes("schedule")) {
    if (businessKnowledge?.bookingUrl) {
      return `You can book an appointment here: ${businessKnowledge.bookingUrl}\n\nOr I can help capture your information to get the team to contact you soon!`;
    }
    return `I'd love to help you schedule an appointment! What service are you interested in, and when would you like to book?`;
  }

  // Check for contact questions
  if (message.includes("contact") || message.includes("call") || message.includes("phone") || message.includes("email")) {
    let contactInfo = "You can reach us at:";
    if (businessKnowledge?.contactPhone) contactInfo += `\nPhone: ${businessKnowledge.contactPhone}`;
    if (businessKnowledge?.contactEmail) contactInfo += `\nEmail: ${businessKnowledge.contactEmail}`;
    return contactInfo;
  }

  // Check for general greeting/questions about the business
  if (message.includes("hello") || message.includes("hi") || message.includes("about") || message.includes("who")) {
    if (businessKnowledge?.description) {
      return `${businessKnowledge.description}\n\nHow can I help you today?`;
    }
    return `Hello! I'm here to help you learn about our services and schedule an appointment. What would you like to know?`;
  }

  // Fallback for unknown questions
  return `I don't have information about that. Here's what I can help with:\n• Service details and pricing\n• Business hours\n• FAQs and policies\n• Booking and scheduling\n• Contact information\n\nWould you like to know about any of these?`;
}

export function shouldCaptureLead(userMessage, conversationHistory) {
  const message = userMessage.toLowerCase();
  const messageCount = conversationHistory.length;

  const indicators = [
    message.includes("interested"),
    message.includes("book"),
    message.includes("appointment"),
    message.includes("schedule"),
    message.includes("want"),
    message.includes("need"),
    messageCount >= 3,
  ];

  return indicators.filter((v) => v).length >= 2;
}
