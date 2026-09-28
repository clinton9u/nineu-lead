export function calculateLeadQualification({ serviceInterest, preferredDate, leadAgeHours = 24 }) {
  let score = 0;

  if (serviceInterest && serviceInterest.trim().length > 0) score += 2;
  if (preferredDate) score += 2;
  if (leadAgeHours <= 24) score += 1;

  if (score >= 4) return "HOT";
  if (score >= 2) return "WARM";
  return "COLD";
}

export function recommendNextAction(qualification, serviceInterest) {
  switch (qualification) {
    case "HOT":
      return `Call immediately to confirm the ${serviceInterest || "service"} appointment and secure a slot.`;
    case "WARM":
      return `Send a follow-up message with pricing, consultation details, and a booking link.`;
    default:
      return "Nurture the lead with educational content and a gentle re-engagement follow-up.";
  }
}
