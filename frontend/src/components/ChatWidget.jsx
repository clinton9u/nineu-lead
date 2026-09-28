import React, { useState } from "react";

const questions = [
  "Hi! I’m NineU Lead. What is your name?",
  "What service are you interested in?",
  "When would you like the service?",
];

export default function ChatWidget({ businessSlug = "luma-aesthetics" }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    customerName: "",
    serviceInterest: "",
    preferredDate: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const goNext = () => {
    if (step < questions.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:4000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessSlug,
          customerName: form.customerName,
          serviceInterest: form.serviceInterest,
          preferredDate: form.preferredDate,
          source: "website_chat",
          timeline: form.preferredDate ? `Requested for ${new Date(form.preferredDate).toLocaleDateString()}` : "Not yet scheduled",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit lead");
      }

      setResult(data);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      setResult({ error: error.message || "Submission failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div style={styles.card}>
        <div style={styles.eyebrow}>NineU Lead</div>
        <h3 style={styles.heading}>Thanks, {form.customerName}!</h3>
        <p style={styles.text}>Your request has been received and sent to the business team.</p>

        {result?.lead ? (
          <div style={{ ...styles.successBox, marginTop: 20 }}>
            <div><strong>Qualification:</strong> {result.lead.qualification}</div>
            <div><strong>Next action:</strong> {result.lead.nextAction}</div>
          </div>
        ) : (
          <div style={{ ...styles.errorBox, marginTop: 20 }}>{result?.error || "Unable to capture the lead."}</div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.eyebrow}>NineU Lead</div>
      <h3 style={styles.heading}>Start a conversation</h3>
      <div style={styles.question}>{questions[step]}</div>

      {step === 0 && (
        <input
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Enter your name"
          style={styles.input}
        />
      )}

      {step === 1 && (
        <input
          name="serviceInterest"
          value={form.serviceInterest}
          onChange={handleChange}
          placeholder="e.g. Botox consultation, facial, laser treatment"
          style={styles.input}
        />
      )}

      {step === 2 && (
        <input
          type="date"
          name="preferredDate"
          value={form.preferredDate}
          onChange={handleChange}
          style={styles.input}
        />
      )}

      <button
        onClick={goNext}
        disabled={isSubmitting}
        style={styles.primaryButton}
      >
        {isSubmitting ? "Submitting..." : step < questions.length - 1 ? "Continue" : "Submit lead"}
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
    padding: 28,
    width: "100%",
  },
  eyebrow: {
    color: "#6d28d9",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heading: {
    margin: "16px 0 10px",
    fontSize: 28,
    color: "#0f172a",
  },
  question: {
    color: "#475569",
    marginBottom: 16,
    fontSize: 16,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 16,
    marginBottom: 12,
  },
  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: 12,
    background: "#4f46e5",
    color: "#ffffff",
    padding: "12px 18px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
  successBox: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: 12,
    padding: 16,
    color: "#065f46",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 12,
    padding: 16,
    color: "#991b1b",
  },
};
