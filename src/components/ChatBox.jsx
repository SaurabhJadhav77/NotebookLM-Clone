import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";

function ChatBox({ onCitationClick }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
    const sourceId = localStorage.getItem("chatpdf_sourceId");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await axios.post(
        "https://api.chatpdf.com/v1/chats/message",
        {
          sourceId: sourceId, 
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            "x-api-key": import.meta.env.VITE_CHATPDF_KEY, 
            "Content-Type": "application/json",
          },
        }
      );

      const aiMessage = {
        role: "assistant",
        text: response.data.content || "No response received",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("API Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Failed to fetch response" },
      ]);
    }

    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRight: "1px solid #e0e0e0",
        background: "#fafafa",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "#f3e8ff",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "14px",
          color: "#4b0082",
          fontWeight: "500",
        }}
      >
        📄 Your document is ready!
        <div style={{ fontSize: "12px", marginTop: "6px", color: "#6b21a8" }}>
          You can now ask questions about your document. For example:
          <ul style={{ margin: "8px 0 0 16px", padding: "0", fontSize: "12px" }}>
            <li>"What is the main topic of this document?"</li>
            <li>"Can you summarize the key points?"</li>
            <li>"What are the conclusions or recommendations?"</li>
          </ul>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "12px",
          padding: "8px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: "10px",
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "12px",
                background: msg.role === "user" ? "#e0bbff" : "#f0f0f0",
                color: "#333",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          border: "1px solid #ccc",
          borderRadius: "20px",
          padding: "6px 10px",
          background: "#fff",
        }}
      >
        <input
          type="text"
          placeholder="Ask about the document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "14px",
            padding: "4px",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#6b21a8",
            fontSize: "16px",
          }}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
