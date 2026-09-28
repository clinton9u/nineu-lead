import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function fetchKnowledge(businessSlug) {
  const response = await fetch(`${API_BASE_URL}/api/knowledge/${businessSlug}`);
  if (!response.ok) throw new Error("Unable to load knowledge base");
  return response.json();
}

export async function updateKnowledge(businessSlug, payload) {
  const response = await fetch(`${API_BASE_URL}/api/knowledge/${businessSlug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Unable to update knowledge base");
  return response.json();
}

export async function createFAQ(businessSlug, faq) {
  const response = await fetch(`${API_BASE_URL}/api/knowledge/${businessSlug}/faqs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(faq),
  });
  if (!response.ok) throw new Error("Unable to create FAQ");
  return response.json();
}

export async function updateFAQ(faqId, faq) {
  const response = await fetch(`${API_BASE_URL}/api/knowledge/faqs/${faqId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(faq),
  });
  if (!response.ok) throw new Error("Unable to update FAQ");
  return response.json();
}

export async function deleteFAQ(faqId) {
  const response = await fetch(`${API_BASE_URL}/api/knowledge/faqs/${faqId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Unable to delete FAQ");
  return response.json();
}

export async function createPolicy(businessSlug, policy) {
  const response = await fetch(`${API_BASE_URL}/api/knowledge/${businessSlug}/policies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policy),
  });
  if (!response.ok) throw new Error("Unable to create policy");
  return response.json();
}

export async function updatePolicy(policyId, policy) {
  const response = await fetch(`${API_BASE_URL}/api/knowledge/policies/${policyId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policy),
  });
  if (!response.ok) throw new Error("Unable to update policy");
  return response.json();
}

export async function deletePolicy(policyId) {
  const response = await fetch(`${API_BASE_URL}/api/knowledge/policies/${policyId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Unable to delete policy");
  return response.json();
}

export async function setBusinessHours(businessSlug, hours) {
  const response = await fetch(`${API_BASE_URL}/api/knowledge/${businessSlug}/hours`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hours }),
  });
  if (!response.ok) throw new Error("Unable to set business hours");
  return response.json();
}

export async function sendChatMessage(businessSlug, userMessage, conversationHistory) {
  const response = await fetch(`${API_BASE_URL}/api/chat/${businessSlug}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userMessage, conversationHistory }),
  });
  if (!response.ok) throw new Error("Unable to process message");
  return response.json();
}
