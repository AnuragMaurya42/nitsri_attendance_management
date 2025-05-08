import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

export default function FacultyChat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const token = localStorage.getItem("facultyToken");
    if (!token) {
      alert("Faculty not authenticated.");
      return router.push("/faculty/login");
    }

    const newMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, newMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/facultyapis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, token }),
      });

      const data = await res.json();
      setLoading(false);

      if (data?.Success) {
        setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Error: " + data.ErrorMessage },
        ]);
      }
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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white text-xl py-4 text-center font-bold shadow-md">
        🎓 Faculty Chat Assistant
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg max-w-[85%] whitespace-pre-wrap transition-opacity ${
                msg.role === "user"
                  ? "bg-blue-200 self-end text-right shadow-md animate-fade-in"
                  : "bg-green-100 self-start text-left shadow-md animate-fade-in"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}

          {/* Animated Loading Indicator */}
          {loading && (
            <div className="flex items-center gap-3 text-gray-600 animate-pulse">
              <span className="w-5 h-5 bg-blue-500 rounded-full animate-bounce"></span>
              <span className="w-5 h-5 bg-blue-500 rounded-full animate-bounce delay-200"></span>
              <span className="w-5 h-5 bg-blue-500 rounded-full animate-bounce delay-400"></span>
              <p className="text-sm italic">Thinking...</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Sticky Input Section */}
      <footer className="bg-white border-t p-3 sticky bottom-0 z-10">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <textarea
            rows={1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something like 'Show DBMS attendance'"
            className="flex-grow p-3 rounded-xl border resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-sm"
          >
            Send
          </button>
        </div>
      </footer>

      {/* Smooth Message Fade-in Animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
}
