import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const StudentChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [token, setToken] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userToken = localStorage.getItem('studentToken');
    if (userToken) setToken(userToken);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageToSend = input) => {
    if (!messageToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', content: messageToSend }];
    setMessages(newMessages);
    setInput('');
    setIsThinking(true);

    try {
      const res = await axios.post('/api/studentapis/chat', {
        message: messageToSend,
        role: 'student',
        token,
      });

      const assistantReply = res.data.reply;
      const percentageData = res.data.percentageData || [];

      let formattedReply = assistantReply;
      if (percentageData.length > 0) {
        formattedReply = percentageData
          .map((d) => {
            const highlight = d.percentage < 75 ? '🔴' : '🟢';
            return `${highlight} ${d.courseCode} (${d.courseName}): ${d.attendedHours}/${d.totalScheduledHours} hours attended, ${d.percentage}%`;
          })
          .join('\n\n');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: formattedReply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error: ' + (err.response?.data?.ErrorMessage || err.message),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = '';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      setTranscript(finalTranscript + interim);
    };

    recognition.onend = () => {
      setIsListening(false);
      setShowModal(false);
      if (finalTranscript.trim()) {
        setInput(finalTranscript.trim());
      }
    };

    recognition.onerror = (e) => {
      alert('Speech recognition error: ' + e.error);
      recognition.stop();
      setIsListening(false);
      setShowModal(false);
    };

    recognition.start();
    setShowModal(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden relative">
      <header className="bg-indigo-600 text-white text-center py-5 shadow-md z-10">
        <h2 className="text-3xl font-extrabold">🎙️ Student Chatbot</h2>
        <p className="text-sm mt-1 font-light">Ask about your attendance & courses</p>
      </header>

      <div className="flex-1 p-6 overflow-y-auto bg-white space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-5 py-3 rounded-2xl text-sm max-w-[70%] shadow-lg whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start animate-pulse">
            <div className="px-5 py-3 rounded-2xl text-sm max-w-[70%] shadow-lg bg-gray-100 text-gray-900">
              🤖 Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-100 border-t flex items-center gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-400 shadow-sm"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button
          onClick={() => handleSend()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md"
        >
          Send
        </button>
        <button
          onClick={startListening}
          className="w-12 h-12 rounded-full border-2 border-indigo-500 flex items-center justify-center hover:bg-indigo-100"
          title="Start voice input"
        >
          🎤
        </button>
      </div>

      {showModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96 text-center space-y-4">
            <h3 className="text-xl font-bold">🎧 Listening...</h3>
            <p className="text-gray-600">{transcript || 'Say something...'}</p>
            <button
              onClick={stopListening}
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
              🛑 Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentChat;
