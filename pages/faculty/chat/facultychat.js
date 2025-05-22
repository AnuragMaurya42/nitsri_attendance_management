import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

export default function FacultyChat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speakingEnabled, setSpeakingEnabled] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Request mic permissions and initialize speech recognition
  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone permission granted");
      } catch (err) {
        console.error("Microphone permission denied", err);
      }
    };

    if (typeof window !== "undefined") {
      requestMicrophonePermission();

      if ("webkitSpeechRecognition" in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcriptChunk = result[0].transcript;
            if (result.isFinal) {
              setTranscript((prev) => prev + transcriptChunk + " ");
            } else {
              interimTranscript += transcriptChunk;
            }
          }
          setTranscript((prev) => prev.split("__INTERIM__")[0] + "__INTERIM__" + interimTranscript);
        };

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const speak = (text) => {
    if (!speakingEnabled || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

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
    setTranscript("");
    setLoading(true);

    try {
      const res = await fetch("/api/facultyapis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputText, token }),
      });

      const data = await res.json();
      setLoading(false);

      if (data?.Success) {
        const botMessage = { role: "bot", content: data.response };
        setMessages((prev) => [...prev, botMessage]);
        speak(data.response);
      } else {
        const errorMsg = "Error: " + data.ErrorMessage;
        setMessages((prev) => [...prev, { role: "bot", content: errorMsg }]);
        speak(errorMsg);
      }
    } catch (err) {
      setLoading(false);
      const errMsg = "An unexpected error occurred.";
      setMessages((prev) => [...prev, { role: "bot", content: errMsg }]);
      speak(errMsg);
    }
  };

  const startVoicePopup = () => {
    setTranscript("");
    setShowVoiceModal(true);
    recognitionRef.current?.start();
  };

  const stopAndSendVoice = () => {
    recognitionRef.current?.stop();
    const cleanedTranscript = transcript.replace("__INTERIM__", "").trim();
    setShowVoiceModal(false);
    handleSend(cleanedTranscript);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7fa]">
      <header className="bg-indigo-700 text-white text-xl py-4 text-center font-semibold shadow-md">
        🎓 Faculty Chat Assistant
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl max-w-[85%] whitespace-pre-wrap transition-opacity text-sm leading-relaxed shadow-md ${
                msg.role === "user"
                  ? "bg-indigo-100 self-end text-right"
                  : "bg-green-100 self-start text-left"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-gray-600 animate-pulse">
              <span className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce"></span>
              <span className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce delay-200"></span>
              <span className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce delay-400"></span>
              <p className="text-sm italic">Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t p-3 fixed bottom-0 w-full z-50">
        <div className="flex flex-col gap-2 max-w-2xl mx-auto">
          <div className="flex gap-2">
            <textarea
              rows={1}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something like 'Show DBMS attendance'"
              className="flex-grow p-3 rounded-xl border resize-none focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800"
            />
            <button
              onClick={() => handleSend()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-sm"
            >
              Send
            </button>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
              />
              <span className="text-sm text-gray-600">Enable Voice Input</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={speakingEnabled}
                onChange={(e) => setSpeakingEnabled(e.target.checked)}
              />
              <span className="text-sm text-gray-600">Enable Voice Output</span>
            </label>
            {voiceEnabled && (
              <button
                onClick={startVoicePopup}
                className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
              >
                🎤 Start Voice
              </button>
            )}
          </div>
        </div>
      </footer>

      {showVoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center space-y-4">
            <h2 className="text-lg font-semibold">🎙️ Listening...</h2>
            <p className="p-3 border rounded-md text-gray-800 bg-gray-100 h-32 overflow-y-auto">
              {transcript.replace("__INTERIM__", "") || "Speak now..."}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={stopAndSendVoice}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                ✅ Send
              </button>
              <button
                onClick={() => {
                  recognitionRef.current?.stop();
                  setShowVoiceModal(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                ❌ Cancel
              </button>
            </div>
            {isListening && <p className="text-xs text-gray-500 italic">Listening in real-time...</p>}
          </div>
        </div>
      )}
    </div>
  );
}
