import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../knowledge-api.js";

const styles = {
  widget: {
    background: "#ffffff",
    borderRadius: 20,
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 500,
  },
  header: {
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "#ffffff",
    padding: 20,
    borderRadius: "20px 20px 0 0",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 2,
    opacity: 0.9,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    margin: 0,
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  message: {
    padding: 12,
    borderRadius: 12,
    lineHeight: 1.5,
    fontSize: 14,
  },
  userMessage: {
    background: "#dbeafe",
    color: "#1e40af",
    marginLeft: 40,
    textAlign: "right",
  },
  assistantMessage: {
    background: "#f3f4f6",
    color: "#1f2937",
    marginRight: 40,
  },
  inputContainer: {
    borderTop: "1px solid #e5e7eb",
    padding: 16,
    display: "flex",
    gap: 8,
  },
  input: {
    flex: 1,
    border: "1px solid #cbd5e1",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 14,
    fontFamily: "inherit",
  },
  button: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
};

export default function IntelligentChatWidget({ businessSlug = "luma-aesthetics" }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      text: `Hi! I'm the AI assistant for ${businessSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}. I can help you with questions about our services, pricing, hours, policies, and booking. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((current) => [
      ...current,
      {
        id: current.length + 1,
        type: "user",
        text: userMessage,
      },
    ]);

    setIsLoading(true);
    try {
      const response = await sendChatMessage(
        businessSlug,
        userMessage,
        messages.map((m) => ({ role: m.type, content: m.text }))
      );

      setMessages((current) => [
        ...current,
        {
          id: current.length + 1,
          type: "assistant",
          text: response.assistantResponse,
          shouldCaptureLead: response.shouldCaptureLead,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((current) => [
        ...current,
        {
          id: current.length + 1,
          type: "assistant",
          text: "I'm having trouble processing your request. Please try again or contact us directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={styles.widget}>
      <div style={styles.header}>
        <div style={styles.eyebrow}>Knowledge-Powered Assistant</div>
        <h3 style={styles.title}>Ask me anything</h3>
      </div>

      <div style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ ...styles.message, ...(msg.type === "user" ? styles.userMessage : styles.assistantMessage) }}>
            {msg.text}
            {msg.shouldCaptureLead && (
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                💡 (Lead capture recommended)
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ ...styles.message, ...styles.assistantMessage }}>
            <span style={{ opacity: 0.7 }}>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          disabled={isLoading}
          style={styles.input}
        />
        <button onClick={handleSendMessage} disabled={isLoading} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}
