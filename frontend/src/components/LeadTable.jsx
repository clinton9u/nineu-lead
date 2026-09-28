import React from "react";

export default function LeadTable({ leads = [], onMarkBooked, onMarkPaid }) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(15, 23, 42, 0.05)",
      border: "1px solid #e2e8f0",
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f8fafc" }}>
          <tr>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Service</th>
            <th style={styles.th}>Source</th>
            <th style={styles.th}>Timeline</th>
            <th style={styles.th}>Qualification</th>
            <th style={styles.th}>Next action</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ padding: 20, textAlign: "center", color: "#64748b" }}>
                No leads yet.
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={styles.td}>{lead.customerName}</td>
                <td style={styles.td}>{lead.serviceInterest}</td>
                <td style={styles.td}>{lead.source}</td>
                <td style={styles.td}>{lead.preferredDate ? new Date(lead.preferredDate).toLocaleDateString() : "Not set"}</td>
                <td style={styles.td}>{lead.qualification}</td>
                <td style={styles.td}>{lead.nextAction}</td>
                <td style={styles.td}>{lead.leadStatus}</td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => onMarkBooked(lead.id)} style={styles.bookedButton}>Booked</button>
                    <button onClick={() => onMarkPaid(lead.id)} style={styles.paidButton}>Paid</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  th: {
    textAlign: "left",
    padding: 14,
    color: "#475569",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  td: {
    padding: 14,
    color: "#0f172a",
    fontSize: 14,
    verticalAlign: "top",
  },
  bookedButton: {
    border: "none",
    borderRadius: 8,
    background: "#16a34a",
    color: "#ffffff",
    padding: "7px 12px",
    cursor: "pointer",
    fontWeight: 600,
  },
  paidButton: {
    border: "none",
    borderRadius: 8,
    background: "#7c3aed",
    color: "#ffffff",
    padding: "7px 12px",
    cursor: "pointer",
    fontWeight: 600,
  },
};
