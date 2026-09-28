import React, { useState, useEffect } from "react";
import { fetchKnowledge, updateKnowledge, createFAQ, updateFAQ, deleteFAQ, createPolicy, updatePolicy, deletePolicy, setBusinessHours } from "../knowledge-api.js";

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "40px 20px 80px",
  },
  header: {
    marginBottom: 32,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#6d28d9",
    fontWeight: 700,
  },
  title: {
    fontSize: 36,
    margin: "8px 0 4px",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    marginTop: 8,
  },
  section: {
    background: "#ffffff",
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    boxShadow: "0 22px 60px rgba(15, 23, 42, 0.06)",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
    color: "#0f172a",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
    color: "#1e293b",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 14,
    fontFamily: "inherit",
    minHeight: 120,
  },
  button: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: 12,
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  buttonSmall: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    marginRight: 8,
  },
  buttonDanger: {
    background: "#ef4444",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  card: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
};

export default function KnowledgeDashboard({ businessSlug = "luma-aesthetics" }) {
  const [knowledge, setKnowledge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "", category: "general" });
  const [newPolicy, setNewPolicy] = useState({ name: "", content: "" });

  const loadKnowledge = async () => {
    try {
      const data = await fetchKnowledge(businessSlug);
      setKnowledge(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load knowledge base");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKnowledge();
  }, [businessSlug]);

  const handleUpdateBusinessInfo = async (field, value) => {
    try {
      await updateKnowledge(businessSlug, { [field]: value });
      setKnowledge((current) => ({
        ...current,
        [field]: value,
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to update business information");
    }
  };

  const handleAddFAQ = async () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) {
      alert("Please fill in both question and answer");
      return;
    }
    try {
      const created = await createFAQ(businessSlug, newFAQ);
      setKnowledge((current) => ({
        ...current,
        faqs: [...current.faqs, created],
      }));
      setNewFAQ({ question: "", answer: "", category: "general" });
    } catch (error) {
      console.error(error);
      alert("Failed to create FAQ");
    }
  };

  const handleUpdateFAQ = async () => {
    if (!editingFAQ.question.trim() || !editingFAQ.answer.trim()) {
      alert("Please fill in both question and answer");
      return;
    }
    try {
      const updated = await updateFAQ(editingFAQ.id, editingFAQ);
      setKnowledge((current) => ({
        ...current,
        faqs: current.faqs.map((f) => (f.id === editingFAQ.id ? updated : f)),
      }));
      setEditingFAQ(null);
    } catch (error) {
      console.error(error);
      alert("Failed to update FAQ");
    }
  };

  const handleDeleteFAQ = async (faqId) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteFAQ(faqId);
      setKnowledge((current) => ({
        ...current,
        faqs: current.faqs.filter((f) => f.id !== faqId),
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to delete FAQ");
    }
  };

  const handleAddPolicy = async () => {
    if (!newPolicy.name.trim() || !newPolicy.content.trim()) {
      alert("Please fill in both name and content");
      return;
    }
    try {
      const created = await createPolicy(businessSlug, newPolicy);
      setKnowledge((current) => ({
        ...current,
        policies: [...current.policies, created],
      }));
      setNewPolicy({ name: "", content: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to create policy");
    }
  };

  const handleUpdatePolicy = async () => {
    if (!editingPolicy.name.trim() || !editingPolicy.content.trim()) {
      alert("Please fill in both name and content");
      return;
    }
    try {
      const updated = await updatePolicy(editingPolicy.id, editingPolicy);
      setKnowledge((current) => ({
        ...current,
        policies: current.policies.map((p) => (p.id === editingPolicy.id ? updated : p)),
      }));
      setEditingPolicy(null);
    } catch (error) {
      console.error(error);
      alert("Failed to update policy");
    }
  };

  const handleDeletePolicy = async (policyId) => {
    if (!confirm("Are you sure you want to delete this policy?")) return;
    try {
      await deletePolicy(policyId);
      setKnowledge((current) => ({
        ...current,
        policies: current.policies.filter((p) => p.id !== policyId),
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to delete policy");
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading knowledge base...</div>;
  }

  if (!knowledge) {
    return <div style={styles.container}>Knowledge base not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.eyebrow}>Knowledge Base</div>
        <h1 style={styles.title}>Business Information</h1>
        <p style={styles.subtitle}>Manage your business details, services, FAQs, policies, and hours to help your team respond to customers accurately.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, borderBottom: "1px solid #e2e8f0", paddingBottom: 0 }}>
        {["overview", "faqs", "policies", "hours"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              padding: "12px 16px",
              fontSize: 14,
              fontWeight: 600,
              color: activeTab === tab ? "#4f46e5" : "#64748b",
              borderBottom: activeTab === tab ? "2px solid #4f46e5" : "none",
              cursor: "pointer",
              marginBottom: -1,
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Business Overview</h2>
            <div style={styles.formGroup}>
              <label style={styles.label}>Business Name</label>
              <input
                type="text"
                value={knowledge.name || ""}
                onChange={(e) => handleUpdateBusinessInfo("name", e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Business Description</label>
              <textarea
                value={knowledge.description || ""}
                onChange={(e) => handleUpdateBusinessInfo("businessDescription", e.target.value)}
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Contact Email</label>
              <input
                type="email"
                value={knowledge.contactEmail || ""}
                onChange={(e) => handleUpdateBusinessInfo("contactEmail", e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Contact Phone</label>
              <input
                type="tel"
                value={knowledge.contactPhone || ""}
                onChange={(e) => handleUpdateBusinessInfo("contactPhone", e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Booking URL</label>
              <input
                type="url"
                value={knowledge.bookingUrl || ""}
                onChange={(e) => handleUpdateBusinessInfo("bookingUrl", e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Payment URL</label>
              <input
                type="url"
                value={knowledge.paymentUrl || ""}
                onChange={(e) => handleUpdateBusinessInfo("paymentUrl", e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Services ({knowledge.services?.length || 0})</h2>
            {knowledge.services && knowledge.services.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {knowledge.services.map((service) => (
                  <div key={service.id} style={styles.card}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{service.name}</div>
                    {service.description && (
                      <div style={{ color: "#475569", fontSize: 14, marginTop: 4 }}>{service.description}</div>
                    )}
                    {service.price && (
                      <div style={{ color: "#4f46e5", fontWeight: 700, marginTop: 8 }}>${service.price}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#64748b" }}>No services added yet.</div>
            )}
          </div>
        </>
      )}

      {activeTab === "faqs" && (
        <>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>

            {editingFAQ ? (
              <div style={{ ...styles.card, background: "#f0f9ff", marginBottom: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Edit FAQ</div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Question</label>
                  <input
                    type="text"
                    value={editingFAQ.question}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Answer</label>
                  <textarea
                    value={editingFAQ.answer}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                    style={styles.textarea}
                  />
                </div>
                <button onClick={handleUpdateFAQ} style={styles.button}>
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingFAQ(null)}
                  style={{ ...styles.button, background: "#64748b", marginLeft: 8 }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ ...styles.card, background: "#f8f5ff", marginBottom: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Add New FAQ</div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Question</label>
                  <input
                    type="text"
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                    placeholder="e.g. How long does treatment last?"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Answer</label>
                  <textarea
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                    placeholder="Provide a clear, helpful answer..."
                    style={styles.textarea}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={newFAQ.category}
                    onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                    style={styles.input}
                  >
                    <option value="general">General</option>
                    <option value="services">Services</option>
                    <option value="pricing">Pricing</option>
                    <option value="booking">Booking</option>
                    <option value="policies">Policies</option>
                  </select>
                </div>
                <button onClick={handleAddFAQ} style={styles.button}>
                  Add FAQ
                </button>
              </div>
            )}

            <div style={{ display: "grid", gap: 12 }}>
              {knowledge.faqs && knowledge.faqs.length > 0 ? (
                knowledge.faqs.map((faq) => (
                  <div key={faq.id} style={styles.card}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 8 }}>
                      Q: {faq.question}
                    </div>
                    <div style={{ color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>A: {faq.answer}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
                      Category: <span style={{ fontWeight: 600 }}>{faq.category}</span>
                    </div>
                    <div>
                      <button
                        onClick={() => setEditingFAQ(faq)}
                        style={styles.buttonSmall}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.id)}
                        style={styles.buttonDanger}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: "#64748b" }}>No FAQs yet. Add your first one above!</div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "policies" && (
        <>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Business Policies</h2>

            {editingPolicy ? (
              <div style={{ ...styles.card, background: "#f0f9ff", marginBottom: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Edit Policy</div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Policy Name</label>
                  <input
                    type="text"
                    value={editingPolicy.name}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, name: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Policy Content</label>
                  <textarea
                    value={editingPolicy.content}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, content: e.target.value })}
                    style={styles.textarea}
                  />
                </div>
                <button onClick={handleUpdatePolicy} style={styles.button}>
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingPolicy(null)}
                  style={{ ...styles.button, background: "#64748b", marginLeft: 8 }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ ...styles.card, background: "#f8f5ff", marginBottom: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Add New Policy</div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Policy Name</label>
                  <input
                    type="text"
                    value={newPolicy.name}
                    onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                    placeholder="e.g. Cancellation Policy"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Policy Content</label>
                  <textarea
                    value={newPolicy.content}
                    onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                    placeholder="Describe the policy clearly..."
                    style={styles.textarea}
                  />
                </div>
                <button onClick={handleAddPolicy} style={styles.button}>
                  Add Policy
                </button>
              </div>
            )}

            <div style={{ display: "grid", gap: 12 }}>
              {knowledge.policies && knowledge.policies.length > 0 ? (
                knowledge.policies.map((policy) => (
                  <div key={policy.id} style={styles.card}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 8 }}>
                      {policy.name}
                    </div>
                    <div style={{ color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>{policy.content}</div>
                    <div>
                      <button
                        onClick={() => setEditingPolicy(policy)}
                        style={styles.buttonSmall}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(policy.id)}
                        style={styles.buttonDanger}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: "#64748b" }}>No policies yet. Add your first one above!</div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "hours" && (
        <>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Business Hours</h2>
            <p style={{ color: "#64748b", marginBottom: 20 }}>
              Monday = 0, Tuesday = 1, ... Sunday = 6
            </p>
            {knowledge.businessHours && knowledge.businessHours.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, idx) => {
                  const hours = knowledge.businessHours.find((h) => h.dayOfWeek === idx);
                  return (
                    <div key={idx} style={{ ...styles.card, borderLeft: "4px solid #4f46e5" }}>
                      <div style={{ fontWeight: 700, marginBottom: 8, color: "#0f172a" }}>{day}</div>
                      {hours && hours.isClosed ? (
                        <div style={{ color: "#ef4444", fontWeight: 600 }}>Closed</div>
                      ) : (
                        <div style={{ color: "#16a34a", fontWeight: 600 }}>
                          {hours?.openTime} - {hours?.closeTime}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ color: "#64748b" }}>No business hours configured.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
