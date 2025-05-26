import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

export default function FacultyChat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (inputText = query) => {
    if (!inputText.trim()) return;

    const token = localStorage.getItem("facultyToken");
    if (!token) {
      alert("Faculty not authenticated.");
      return router.push("/faculty/login");
    }

    const newMessage = { role: "user", content: inputText };
    setMessages((prev) => [...prev, newMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/facultyapis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputText, token }),
      });

      const data = await res.json();
      setLoading(false);

      const botMessage = {
        role: "bot",
        content: data?.Success
          ? data.response
          : "Error: " + data.ErrorMessage,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "An unexpected error occurred." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        🎓 Faculty Chat Assistant
      </header>

      <main className="chat-main">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-lg transition-all transform duration-200 ${
                msg.role === "user"
                  ? "bg-white self-end text-right border border-indigo-200"
                  : "bg-gradient-to-r from-green-100 to-green-200 self-start text-left border border-green-200"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}

          {loading && (
            <div className="loading flex items-center gap-2 animate-pulse text-gray-700">
              <span className="dot w-3 h-3 bg-indigo-500 rounded-full"></span>
              <span className="dot w-3 h-3 bg-indigo-500 rounded-full delay-150"></span>
              <span className="dot w-3 h-3 bg-indigo-500 rounded-full delay-300"></span>
              <p className="text-sm italic ml-2">Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="chat-footer">
        <div className="chat-input-container">
          <textarea
            rows={1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something like 'Show DBMS attendance'"
            className="chat-textarea"
          />
          <button onClick={() => handleSend()} className="send-btn">
            Send
          </button>
        </div>
      </footer>

      <style jsx>{`
        /* Overall container includes extra top and bottom padding to avoid fixed header/footer overlap */
        .chat-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: linear-gradient(to bottom right, #bfdbfe, #e0d7f5, #fed7aa);
          padding-top: 72px; /* space for global Navbar */
          padding-bottom: 72px; /* extra room for global Footer */
        }
        /* Header styled to match a mobile-app feel */
        .chat-header {
          background: linear-gradient(to right, #4f46e5, #6d28d9);
          color: white;
          font-size: 1.5rem;
          text-align: center;
          padding: 16px;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        /* Main chat area is scrollable and has extra bottom padding */
        .chat-main {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          padding-bottom: 100px;
        }
        .chat-messages {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        /* Chat Footer: Raised above the bottom to prevent conflict with the global Footer */
        .chat-footer {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(6px);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 16px;
          position: fixed;
          left: 0;
          right: 0;
          bottom: 80px; /* Raised from the bottom by 80px */
          z-index: 50;
          border-top: 1px solid #e5e7eb;
        }
        .chat-input-container {
          max-width: 800px;
          margin: auto;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .chat-textarea {
          flex-grow: 1;
          padding: 12px;
          border: 1px solid #a5b4fc;
          border-radius: 12px;
          font-size: 1rem;
          resize: none;
          outline: none;
          background: white;
          color: #374151;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .send-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          transition: background 0.3s, transform 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
        .send-btn:hover {
          background: #4338ca;
          transform: translateY(-2px);
        }
        .send-btn:active {
          transform: translateY(0);
        }
        /* Loading dot animations */
        .dot {
          animation: bounce 1s infinite;
        }
        .dot.delay-150 {
          animation-delay: 0.15s;
        }
        .dot.delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}
