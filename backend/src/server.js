import express from "express";
import { ensureBusinessBySlug } from "../services/leadService.js";

const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {
    const business = await ensureBusinessBySlug(req.params.slug);
    return res.json(business);
  } catch (error) {
    console.error("Business resolution failed:", error);
    return res.status(500).json({ error: "Failed to resolve business" });
  }
});

export default router;
