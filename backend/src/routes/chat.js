import express from "express";
import { getBusinessKnowledgeBySlug } from "../services/knowledgeService.js";
import { generateAssistantResponse, shouldCaptureLead } from "../services/conversationService.js";

const router = express.Router();

router.post("/:businessSlug/message", async (req, res) => {
  try {
    const { businessSlug } = req.params;
    const { userMessage, conversationHistory = [] } = req.body;

    if (!userMessage || userMessage.trim().length === 0) {
      return res.status(400).json({ error: "userMessage is required" });
    }

    const knowledge = await getBusinessKnowledgeBySlug(businessSlug);
    if (!knowledge) {
      return res.status(404).json({ error: "Business not found" });
    }

    const assistantResponse = generateAssistantResponse(userMessage, knowledge);
    const shouldCaptureLeadData = shouldCaptureLead(userMessage, conversationHistory);

    return res.json({
      assistantResponse,
      shouldCaptureLead: shouldCaptureLeadData,
      businessInfo: {
        name: knowledge.name,
        services: knowledge.services,
      },
    });
  } catch (error) {
    console.error("Chat message failed:", error);
    return res.status(500).json({ error: "Failed to process message" });
  }
});

export default router;
