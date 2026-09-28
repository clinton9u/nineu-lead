import React, { useEffect, useState } from "react";
import MetricCard from "../components/MetricCard.jsx";
import LeadTable from "../components/LeadTable.jsx";
import { fetchDashboard, updateLeadStatus } from "../api.js";

const businessSlug = "luma-aesthetics";

export default function DashboardPage() {
  const [business, setBusiness] = useState(null);
  const [totals, setTotals] = useState({
    totalLeads: 0,
    hotLeads: 0,
    bookedLeads: 0,
    convertedLeads: 0,
    revenue: 0,
  });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const data = await fetchDashboard(businessSlug);
      setBusiness(data.business);
      setTotals(data.totals);
      setLeads(data.leads);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleMarkBooked = async (leadId) => {
    await updateLeadStatus(leadId, { booked: true, paid: false });
    loadDashboard();
  };

  const handleMarkPaid = async (leadId) => {
    await updateLeadStatus(leadId, { booked: true, paid: true, revenue: 299 });
    loadDashboard();
  };

  if (loading) {
    return <div style={{ padding: 30, color: "#475569" }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 20px 80px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#6d28d9", fontWeight: 700 }}>
          Business Dashboard
        </div>
        <h2 style={{ fontSize: 36, margin: "8px 0 4px", color: "#0f172a" }}>
          {business?.name || "Luma Aesthetics"}
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(180px, 1fr))", gap: 18, marginBottom: 28 }}>
        <MetricCard label="Total Leads" value={totals.totalLeads} />
        <MetricCard label="Hot Leads" value={totals.hotLeads} accent="#ef4444" />
        <MetricCard label="Booked Leads" value={totals.bookedLeads} accent="#16a34a" />
        <MetricCard label="Converted Leads" value={totals.convertedLeads} accent="#7c3aed" />
        <MetricCard label="Revenue" value={`$${Number(totals.revenue || 0).toFixed(2)}`} accent="#f59e0b" />
      </div>

      <LeadTable leads={leads} onMarkBooked={handleMarkBooked} onMarkPaid={handleMarkPaid} />
    </div>
  );
}
