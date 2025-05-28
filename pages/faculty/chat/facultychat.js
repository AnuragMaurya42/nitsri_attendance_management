import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

export default function FacultyChat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVoicePopup, setShowVoicePopup] = useState(false);
  const [transcript, setTranscript] = useState("");
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

  const startVoiceInput = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setTranscript(voiceText);
      setQuery(voiceText);
      setShowVoicePopup(false);
      handleSend(voiceText);
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      setShowVoicePopup(false);
    };
  };

  const handleSpeak = () => {
    const lastBotMsg = [...messages].reverse().find((msg) => msg.role === "bot");
    if (!lastBotMsg) return;

    const utterance = new SpeechSynthesisUtterance(lastBotMsg.content);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">🎓 Faculty Chat Assistant</header>

      <main className="chat-main">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-lg ${
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
          <button onClick={() => handleSend()} className="send-btn">Send</button>
          <button onClick={() => setShowVoicePopup(true)} className="voice-btn">🎤 Voice</button>
          <button onClick={handleSpeak} className="speak-btn">🔊 Speak</button>
        </div>
      </footer>

      {showVoicePopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>🎙️ Listening... Speak now</p>
            <button onClick={startVoiceInput}>Start</button>
            <button onClick={() => setShowVoicePopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: linear-gradient(to bottom right, #bfdbfe, #e0d7f5, #fed7aa);
          padding-top: 47px;
          padding-bottom: 42px;
        }
        .chat-header {
          background: linear-gradient(to right, #4f46e5, #6d28d9);
          color: white;
          font-size: 1.5rem;
          text-align: center;
          padding: 16px;
          font-weight: bold;
        }
        .chat-main {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          padding-bottom: 120px;
        }
        .chat-messages {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .chat-footer {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(6px);
          padding: 10px;
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100;
          border-top: 1px solid #e5e7eb;
        }
        .chat-input-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          max-width: 100%;
          margin: auto;
          padding: 0 10px;
        }
        .chat-textarea {
          flex: 1 1 100%;
          max-width: 100%;
          padding: 8px 10px;
          font-size: 0.95rem;
          border: 1px solid #c7d2fe;
          border-radius: 10px;
          resize: none;
          min-height: 40px;
        }
        .send-btn, .voice-btn, .speak-btn {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          color: white;
          border: none;
          cursor: pointer;
          flex: 1 1 auto;
          white-space: nowrap;
        }
        .send-btn {
          background: #4f46e5;
        }
        .voice-btn {
          background: #10b981;
        }
        .speak-btn {
          background: #3b82f6;
        }
        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
        }
        .popup-box {
          background: white;
          padding: 24px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .popup-box button {
          margin: 10px;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }
        .popup-box button:first-of-type {
          background-color: #10b981;
          color: white;
        }
        .popup-box button:last-of-type {
          background-color: #ef4444;
          color: white;
        }
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
          0%, 100% {
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
