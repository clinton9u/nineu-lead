import React, { useState } from "react";
import DashboardPage from "./pages/Dashboard.jsx";
import KnowledgePage from "./pages/KnowledgePage.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import IntelligentChatWidget from "./components/IntelligentChatWidget.jsx";

export default function App() {
  const businessSlug = "luma-aesthetics";
  const [view, setView] = useState("business"); // 'business', 'knowledge', 'chat-demo', 'intelligent-chat-demo'

  return (
    <div style={{ background: "#f4f7fb", minHeight: "100vh", fontFamily: 'Inter, "Segoe UI", sans-serif' }}>
      <header style={{ borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "#6d28d9", textTransform: "uppercase" }}>NineU Labs</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a" }}>NineU Lead</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setView("business")}
              style={{
                background: view === "business" ? "#4f46e5" : "#e2e8f0",
                color: view === "business" ? "#ffffff" : "#1e293b",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Business
            </button>
            <button
              onClick={() => setView("knowledge")}
              style={{
                background: view === "knowledge" ? "#4f46e5" : "#e2e8f0",
                color: view === "knowledge" ? "#ffffff" : "#1e293b",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Knowledge Base
            </button>
            <button
              onClick={() => setView("chat-demo")}
              style={{
                background: view === "chat-demo" ? "#4f46e5" : "#e2e8f0",
                color: view === "chat-demo" ? "#ffffff" : "#1e293b",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Lead Chat
            </button>
            <button
              onClick={() => setView("intelligent-chat-demo")}
              style={{
                background: view === "intelligent-chat-demo" ? "#4f46e5" : "#e2e8f0",
                color: view === "intelligent-chat-demo" ? "#ffffff" : "#1e293b",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Smart Chat
            </button>
          </div>
        </div>
      </header>

      <main>
        {view === "business" && (
          <>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr", gap: 28, alignItems: "stretch" }}>
                <section style={{ background: "#ffffff", borderRadius: 24, padding: 32, boxShadow: "0 22px 60px rgba(15, 23, 42, 0.06)" }}>
                  <div style={{ color: "#6d28d9", fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Luma Aesthetics</div>
                  <h1 style={{ fontSize: 46, margin: "12px 0 14px", color: "#0f172a" }}>Look and feel your best.</h1>
                  <p style={{ fontSize: 18, lineHeight: 1.7, color: "#475569", marginBottom: 28 }}>
                    Personalized aesthetic services for glow, refinement, and confidence. Start a conversation and we'll help you find the right treatment.
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
            </div>
            <DashboardPage />
          </>
        )}

        {view === "knowledge" && <KnowledgePage businessSlug={businessSlug} />}

        {view === "chat-demo" && (
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#6d28d9", fontWeight: 700 }}>Customer Chat Demo</div>
              <h2 style={{ fontSize: 36, margin: "8px 0", color: "#0f172a" }}>Lead Capture Flow</h2>
              <p style={{ color: "#475569", marginTop: 8 }}>This is the original lead capture chat that collects customer name, service interest, and preferred date.</p>
            </div>
            <div style={{ maxWidth: 500, margin: "0 auto" }}>
              <ChatWidget businessSlug={businessSlug} />
            </div>
          </div>
        )}

        {view === "intelligent-chat-demo" && (
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#6d28d9", fontWeight: 700 }}>Intelligent Chat Demo</div>
              <h2 style={{ fontSize: 36, margin: "8px 0", color: "#0f172a" }}>Knowledge-Powered Conversation</h2>
              <p style={{ color: "#475569", marginTop: 8 }}>This chat uses the business knowledge base to answer questions about services, pricing, hours, FAQs, and policies. Try asking about prices, services, hours, policies, or booking!</p>
            </div>
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              <IntelligentChatWidget businessSlug={businessSlug} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
