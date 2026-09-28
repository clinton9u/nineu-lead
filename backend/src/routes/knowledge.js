import express from "express";
import {
  getBusinessKnowledge,
  getBusinessKnowledgeBySlug,
  updateBusinessKnowledge,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  createPolicy,
  updatePolicy,
  deletePolicy,
  setBusinessHours,
} from "../services/knowledgeService.js";

const router = express.Router();

router.get("/:businessSlug", async (req, res) => {
  try {
    const { businessSlug } = req.params;
    const knowledge = await getBusinessKnowledgeBySlug(businessSlug);

    if (!knowledge) {
      return res.status(404).json({ error: "Business not found" });
    }

    return res.json(knowledge);
  } catch (error) {
    console.error("Fetch knowledge failed:", error);
    return res.status(500).json({ error: "Failed to load knowledge base" });
  }
});

router.patch("/:businessSlug", async (req, res) => {
  try {
    const { businessSlug } = req.params;
    const { businessDescription, contactEmail, contactPhone, bookingUrl, paymentUrl } = req.body;

    const kb = await getBusinessKnowledgeBySlug(businessSlug);
    if (!kb) {
      return res.status(404).json({ error: "Business not found" });
    }

    const updated = await updateBusinessKnowledge(kb.id, {
      businessDescription,
      contactEmail,
      contactPhone,
      bookingUrl,
      paymentUrl,
    });

    return res.json(updated);
  } catch (error) {
    console.error("Update knowledge failed:", error);
    return res.status(500).json({ error: "Failed to update knowledge base" });
  }
});

router.post("/:businessSlug/faqs", async (req, res) => {
  try {
    const { businessSlug } = req.params;
    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "question and answer are required" });
    }

    const kb = await getBusinessKnowledgeBySlug(businessSlug);
    if (!kb) {
      return res.status(404).json({ error: "Business not found" });
    }

    const faq = await createFAQ(kb.id, { question, answer, category });
    return res.status(201).json(faq);
  } catch (error) {
    console.error("Create FAQ failed:", error);
    return res.status(500).json({ error: "Failed to create FAQ" });
  }
});

router.patch("/faqs/:faqId", async (req, res) => {
  try {
    const { faqId } = req.params;
    const { question, answer, category } = req.body;

    const faq = await updateFAQ(faqId, { question, answer, category });
    return res.json(faq);
  } catch (error) {
    console.error("Update FAQ failed:", error);
    return res.status(500).json({ error: "Failed to update FAQ" });
  }
});

router.delete("/faqs/:faqId", async (req, res) => {
  try {
    const { faqId } = req.params;
    await deleteFAQ(faqId);
    return res.json({ success: true });
  } catch (error) {
    console.error("Delete FAQ failed:", error);
    return res.status(500).json({ error: "Failed to delete FAQ" });
  }
});

router.post("/:businessSlug/policies", async (req, res) => {
  try {
    const { businessSlug } = req.params;
    const { name, content } = req.body;

    if (!name || !content) {
      return res.status(400).json({ error: "name and content are required" });
    }

    const kb = await getBusinessKnowledgeBySlug(businessSlug);
    if (!kb) {
      return res.status(404).json({ error: "Business not found" });
    }

    const policy = await createPolicy(kb.id, { name, content });
    return res.status(201).json(policy);
  } catch (error) {
    console.error("Create policy failed:", error);
    return res.status(500).json({ error: "Failed to create policy" });
  }
});

router.patch("/policies/:policyId", async (req, res) => {
  try {
    const { policyId } = req.params;
    const { name, content } = req.body;

    const policy = await updatePolicy(policyId, { name, content });
    return res.json(policy);
  } catch (error) {
    console.error("Update policy failed:", error);
    return res.status(500).json({ error: "Failed to update policy" });
  }
});

router.delete("/policies/:policyId", async (req, res) => {
  try {
    const { policyId } = req.params;
    await deletePolicy(policyId);
    return res.json({ success: true });
  } catch (error) {
    console.error("Delete policy failed:", error);
    return res.status(500).json({ error: "Failed to delete policy" });
  }
});

router.post("/:businessSlug/hours", async (req, res) => {
  try {
    const { businessSlug } = req.params;
    const { hours } = req.body;

    if (!Array.isArray(hours) || hours.length === 0) {
      return res.status(400).json({ error: "hours array is required" });
    }

    const kb = await getBusinessKnowledgeBySlug(businessSlug);
    if (!kb) {
      return res.status(404).json({ error: "Business not found" });
    }

    await setBusinessHours(kb.id, hours);
    const updated = await getBusinessKnowledge(kb.id);
    return res.json(updated);
  } catch (error) {
    console.error("Set hours failed:", error);
    return res.status(500).json({ error: "Failed to set business hours" });
  }
});

export default router;
