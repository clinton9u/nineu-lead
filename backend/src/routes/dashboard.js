import express from "express";
import { prisma } from "../db.js";
import { ensureBusinessBySlug, buildDashboardMetrics } from "../services/leadService.js";

const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {
    const business = await ensureBusinessBySlug(req.params.slug);
    const leads = await prisma.lead.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      business,
      totals: buildDashboardMetrics(leads),
      leads,
    });
  } catch (error) {
    console.error("Dashboard fetch failed:", error);
    return res.status(500).json({ error: "Failed to load dashboard" });
  }
});

export default router;
