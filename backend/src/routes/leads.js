import express from "express";
import { prisma } from "../db.js";
import { ensureBusinessBySlug, buildDashboardMetrics, createLead } from "../services/leadService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const businessSlug = req.query.businessSlug || "luma-aesthetics";
    const business = await ensureBusinessBySlug(businessSlug);

    const leads = await prisma.lead.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json(leads);
  } catch (error) {
    console.error("List leads failed:", error);
    return res.status(500).json({ error: "Failed to load leads" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      businessSlug,
      customerName,
      serviceInterest,
      preferredDate,
      source = "website_chat",
      email,
      phone,
      timeline,
    } = req.body;

    if (!customerName || !serviceInterest) {
      return res.status(400).json({ error: "customerName and serviceInterest are required" });
    }

    const { business, lead } = await createLead({
      businessSlug,
      customerName,
      serviceInterest,
      preferredDate,
      source,
      email,
      phone,
      timeline,
    });

    return res.status(201).json({
      message: "Lead created successfully",
      business,
      lead,
    });
  } catch (error) {
    console.error("Create lead failed:", error);
    return res.status(500).json({ error: "Failed to create lead" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { booked, paid, revenue } = req.body;

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Lead not found" });
    }

    let nextStatus = existing.leadStatus;

    if (paid) {
      nextStatus = "CONVERTED";
    } else if (booked) {
      nextStatus = "BOOKED";
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        booked: booked ?? existing.booked,
        paid: paid ?? existing.paid,
        revenue: revenue !== undefined ? Number(revenue) : existing.revenue,
        leadStatus: nextStatus,
      },
    });

    return res.json(updatedLead);
  } catch (error) {
    console.error("Update lead failed:", error);
    return res.status(500).json({ error: "Failed to update lead" });
  }
});

router.get("/metrics", async (req, res) => {
  try {
    const businessSlug = req.query.businessSlug || "luma-aesthetics";
    const business = await ensureBusinessBySlug(businessSlug);

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
    console.error("Metrics failed:", error);
    return res.status(500).json({ error: "Failed to load dashboard metrics" });
  }
});

export default router;
