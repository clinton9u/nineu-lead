import express from "express";
import { prisma } from "../db.js";
import { ensureBusinessBySlug } from "../services/leadService.js";

const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {
    const business = await ensureBusinessBySlug(req.params.slug);
    const leads = await prisma.lead.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    });

    const totalLeads = leads.length;
    const hotLeads = leads.filter((lead) => lead.qualification === "HOT").length;
    const bookedLeads = leads.filter((lead) => lead.leadStatus === "BOOKED").length;
    const convertedLeads = leads.filter((lead) => lead.leadStatus === "CONVERTED").length;
    const revenue = leads.reduce((sum, lead) => {
      if (lead.revenue) return sum + Number(lead.revenue);
      return sum;
    }, 0);

    return res.json({
      business,
      totals: {
        totalLeads,
        hotLeads,
        bookedLeads,
        convertedLeads,
        revenue,
      },
      leads,
    });
  } catch (error) {
    console.error("Dashboard route failed:", error);
    return res.status(500).json({ error: "Failed to load dashboard" });
  }
});

export default router;
