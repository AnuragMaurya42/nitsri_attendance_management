'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const StudentChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [token, setToken] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const userToken = localStorage.getItem('studentToken');
    if (userToken) setToken(userToken);
  }, [mounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Jumping robot animation for thinking state
const ThinkingAnimation = () => (
  <div className="flex items-center space-x-2 text-indigo-600 ">
    <img
      src="https://media.tenor.com/SyOmQ1NRUc4AAAAC/robot-cute.gif"
      alt="Thinking robot"
      className="w-8 h-8"
      style={{ objectFit: 'contain' }}
    />
    <span className="font-semibold text-lg">Thinking...</span>
  </div>
);

  const formatAttendanceMessage = (text) => {
    if (!text.includes('Detailed Attendance for DBMS')) return text;
    const parts = text.split('Detailed Attendance for DBMS:')[1];
    if (!parts) return text;

    const attendanceRegex = /(\w{3}, \d{1,2} \w{3}, \d{4}) — Duration: (\d+), Present: (\d+)/g;
    let match;
    const entries = [];

    while ((match = attendanceRegex.exec(parts)) !== null) {
      const dateStr = new Date(match[1]).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      entries.push(
        <li
          key={match.index}
          className="animate-fadeIn py-1 px-2 rounded-lg hover:bg-indigo-100 transition-colors flex justify-between items-center"
        >
          <span className="font-semibold text-indigo-700">{dateStr}</span>
          <span className="text-indigo-600">
            Duration: <span className="font-medium">{match[2]}</span>
          </span>
          <span className="text-green-600 font-semibold">
            Present: <span>{match[3]}</span>
          </span>
        </li>
      );
    }
    return (
      <div className="animate-fadeIn">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
          Detailed Attendance for DBMS
        </h3>
        <ul className="list-none space-y-2 max-h-64 overflow-y-auto text-gray-700 text-base border border-indigo-300 rounded-lg p-4 bg-indigo-50 shadow-inner">
          {entries.length > 0 ? entries : <li>No attendance records found.</li>}
        </ul>
      </div>
    );
  };

  const renderMessageContent = (msg) => {
    if (msg.role === 'assistant') {
      if (msg.content.includes('Detailed Attendance for DBMS')) {
        return formatAttendanceMessage(msg.content);
      }
      // Parse **bold** in content
      const parts = msg.content.split(/(\*\*[^*]+\*\*)/g); // split by **bold**
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={i} className="font-bold">
              {boldText}
            </strong>
          );
        } else {
          // Also split by new lines inside non-bold parts
          return part.split('\n').map((line, idx) => (
            <p key={`${i}-${idx}`} className="whitespace-pre-wrap m-0">
              {line}
            </p>
          ));
        }
      });
    }
    return msg.content;
  };

  const handleSend = async (messageToSend = input) => {
    if (!messageToSend.trim()) return;
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
    } catch (err) {
      const errorMsg = 'Error: ' + (err.response?.data?.ErrorMessage || err.message);
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gradient-to-tr from-indigo-100 via-white to-indigo-50 shadow-2xl rounded-3xl overflow-hidden relative">
      <header className="bg-indigo-600 text-white text-center py-5 shadow-lg flex flex-col items-center justify-center space-y-2">
        <h1 className="text-3xl font-extrabold animate-fadeIn">💬 Student Chatbot</h1>
        <p className="text-sm mt-1 font-light">Ask about your attendance & courses</p>
      </header>

      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-indigo-700 text-lg font-semibold animate-fadeIn mt-10 px-4">
            Hello! How can I assist you with your attendance queries today?
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
          >
            <div
              className={`max-w-md px-5 py-3 rounded-2xl transition-all duration-300 shadow-md ${
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-indigo-100'
              }`}
            >
              {renderMessageContent(msg)}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start px-5">
            <div className="bg-white rounded-bl-none rounded-2xl px-5 py-3 shadow-md border border-indigo-100">
              <ThinkingAnimation />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 p-4 bg-white border-t border-indigo-200 shadow-inner"
      >
        <textarea
          rows={1}
          className="flex-1 px-4 py-2 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none max-h-32 transition-all duration-200"
          placeholder="Ask about your attendance..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isThinking}
        />
        <button
          type="submit"
          disabled={isThinking}
          className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-6 py-2 rounded-xl shadow disabled:opacity-50"
        >
          {isThinking ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default StudentChat;
