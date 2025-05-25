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
        content: data?.Success ? data.response : "Error: " + data.ErrorMessage,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [...prev, { role: "bot", content: "An unexpected error occurred." }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-2xl py-4 text-center font-bold shadow-md animate-fadeIn">
        🎓 Faculty Chat Assistant
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-lg transition-all transform duration-200 animate-slideIn ${
                msg.role === "user"
                  ? "bg-white self-end text-right border border-indigo-200"
                  : "bg-gradient-to-r from-green-100 to-green-200 self-start text-left border border-green-200"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 animate-pulse text-gray-700">
              <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
              <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-150" />
              <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-300" />
              <p className="text-sm italic ml-2">Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-lg shadow-inner p-4 fixed bottom-0 w-full z-50 border-t">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <textarea
            rows={1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something like 'Show DBMS attendance'"
            className="flex-grow p-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none text-gray-800 shadow-sm bg-white"
          />
          <button
            onClick={() => handleSend()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl transition-all shadow-md"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
