const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function fetchBusiness(slug) {
  const response = await fetch(`${API_BASE_URL}/api/businesses/${slug}`);
  if (!response.ok) throw new Error("Unable to load business");
  return response.json();
}

export async function fetchDashboard(slug) {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/${slug}`);
  if (!response.ok) throw new Error("Unable to load dashboard");
  return response.json();
}

export async function createLead(payload) {
  const response = await fetch(`${API_BASE_URL}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Unable to create lead");
  return data;
}

export async function updateLeadStatus(leadId, payload) {
  const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Unable to update lead");
  return data;
}
