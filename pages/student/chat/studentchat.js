'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const StudentChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [token, setToken] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // new speaking state
  const [lastSpokenText, setLastSpokenText] = useState(''); // to store last spoken text
  const utteranceRef = useRef(null); // for managing speech utterance
  const messagesEndRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Mic permission on mount
  useEffect(() => {
    async function requestMicPermission() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone permission granted');
      } catch (err) {
        console.warn('Microphone permission denied or error:', err);
      }
    }
    requestMicPermission();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const userToken = localStorage.getItem('studentToken');
    if (userToken) {
      setToken(userToken);
      console.log('Token loaded from localStorage:', userToken);
    }
  }, [mounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Text-to-Speech functions
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // ensure no duplicate utterances
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      utteranceRef.current = utterance;
      setLastSpokenText(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  };

  // Format attendance message helper
  const formatAttendanceMessage = (text) => {
    if (!text.includes('Detailed Attendance for DBMS')) return text;

    const parts = text.split('Detailed Attendance for DBMS:')[1];
    if (!parts) return text;

    const regex = /Date: (.*?), Duration: (\d+), Present: (\d+)/g;
    let match;
    const entries = [];
    while ((match = regex.exec(parts)) !== null) {
      const dateStr = new Date(match[1]).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const duration = match[2];
      const present = match[3];
      entries.push(
        <li key={match.index}>
          <span className="font-medium">{dateStr}</span> — Duration: {duration}, Present: {present}
        </li>
      );
    }
    return (
      <div>
        <h3 className="font-semibold text-indigo-700 mb-2">Detailed Attendance for DBMS:</h3>
        <ul className="list-disc list-inside space-y-1 max-h-64 overflow-y-auto text-sm text-gray-800">
          {entries.length > 0 ? entries : <li>No attendance records found.</li>}
        </ul>
      </div>
    );
  };

  // Render message content with formatting for detailed attendance
  const renderMessageContent = (msg) => {
    if (msg.role === 'assistant') {
      if (msg.content.includes('Detailed Attendance for DBMS')) {
        return formatAttendanceMessage(msg.content);
      }
      return msg.content.split('\n').map((line, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {line}
        </p>
      ));
    }
    return msg.content;
  };

  const handleSend = async (messageToSend = input) => {
    if (!messageToSend.trim()) return;

    stopSpeaking(); // stop any ongoing speech before new message
    const newMessages = [...messages, { role: 'user', content: messageToSend }];
    setMessages(newMessages);
    setInput('');
    setIsThinking(true);

    try {
      const res = await axios.post('/api/studentapis/chat', {
        query: messageToSend,
        token,
      });

      const assistantReply = res.data.response || 'No response from server.';
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantReply }]);
      speak(assistantReply);
    } catch (err) {
      const errorMsg = 'Error: ' + (err.response?.data?.ErrorMessage || err.message);
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
      speak(errorMsg);
    } finally {
      setIsThinking(false);
    }
  };

  // Live speech recognition modal states
  const [isListeningModalOpen, setListeningModalOpen] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const recognitionRef = useRef(null);

  // Open modal and start continuous speech recognition
  const startListeningModal = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          setInput((prev) => prev + event.results[i][0].transcript + ' ');
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setLiveTranscript(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.start();
    setLiveTranscript('');
    setListeningModalOpen(true);
  };

  // Stop speech recognition and close modal
  const stopListeningModal = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListeningModalOpen(false);
    setLiveTranscript('');
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden relative">
      <header className="bg-indigo-600 text-white text-center py-5 shadow-md z-10">
        <h1 className="text-3xl font-extrabold">🎙️ Student Chatbot</h1>
        <p className="text-sm mt-1 font-light">Ask about your attendance & courses</p>
      </header>

      <div className="flex-1 p-6 overflow-y-auto bg-white space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-md px-5 py-3 rounded-lg whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'
              }`}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {renderMessageContent(msg)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 p-4 bg-indigo-50"
      >
        <button
          type="button"
          onClick={startListeningModal}
          title="Speak your query"
          className="text-indigo-600 p-2 rounded-full hover:bg-indigo-100"
        >
          🎤
        </button>
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg border border-indigo-300 focus:outline-indigo-600"
          placeholder="Ask about your attendance..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isThinking}
        />
        <button
          type="submit"
          disabled={isThinking}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {isThinking ? 'Thinking...' : 'Send'}
        </button>
        {/* Toggle Voice Button */}
        {lastSpokenText && (
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speak(lastSpokenText);
              }
            }}
            title={isSpeaking ? "Stop voice" : "Start voice"}
            className="text-red-600 p-2 rounded-full hover:bg-red-100"
          >
            {isSpeaking ? '⏹️' : '🔊'}
          </button>
        )}
      </form>

      {/* Speech recognition modal */}
      {isListeningModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Listening...</h2>
            <p className="min-h-[3rem] border rounded p-2 mb-4">{liveTranscript || 'Speak now...'}</p>
            <button
              onClick={stopListeningModal}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Stop Listening
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentChat;
