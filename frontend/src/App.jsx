import React from "react";
import DashboardPage from "./pages/Dashboard.jsx";
import ChatWidget from "./components/ChatWidget.jsx";

export default function App() {
  const businessSlug = "luma-aesthetics";

  return (
    <div style={{ background: "#f4f7fb", minHeight: "100vh", fontFamily: 'Inter, "Segoe UI", sans-serif' }}>
      <header style={{ borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "#6d28d9", textTransform: "uppercase" }}>NineU Labs</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a" }}>NineU Lead</div>
          </div>
          <div style={{ fontSize: 14, color: "#475569", fontWeight: 600 }}>Luma Aesthetics Demo</div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr", gap: 28, alignItems: "stretch" }}>
          <section style={{ background: "#ffffff", borderRadius: 24, padding: 32, boxShadow: "0 22px 60px rgba(15, 23, 42, 0.06)" }}>
            <div style={{ color: "#6d28d9", fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Luma Aesthetics</div>
            <h1 style={{ fontSize: 46, margin: "12px 0 14px", color: "#0f172a" }}>Look and feel your best.</h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "#475569", marginBottom: 28 }}>
              Personalized aesthetic services for glow, refinement, and confidence. Start a consultation and we’ll help you find the right treatment.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}>
              {[
                ["Signature Facial", "$149"],
                ["Botox Consultation", "$199"],
                ["Laser Hair Removal", "$249"],
              ].map(([name, price]) => (
                <div key={name} style={{ background: "#f8fafc", borderRadius: 16, padding: 18, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}>{name}</div>
                  <div style={{ color: "#64748b", marginTop: 8 }}>From {price}</div>
                </div>
              ))}
            </div>
          </section>

          <ChatWidget businessSlug={businessSlug} />
        </div>

        <DashboardPage />
      </main>
    </div>
  );
}
