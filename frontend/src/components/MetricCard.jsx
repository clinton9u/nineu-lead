import React from "react";

export default function MetricCard({ label, value, accent = "#4f46e5" }) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 18,
      padding: 22,
      boxShadow: "0 18px 40px rgba(15, 23, 42, 0.05)",
      border: "1px solid #e2e8f0",
    }}>
      <div style={{ fontSize: 13, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: accent, marginTop: 10 }}>{value}</div>
    </div>
  );
}
