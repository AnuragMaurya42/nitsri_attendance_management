import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let socket;
function getSocket() {
  if (!socket) {
    socket = io({
      path: '/api/socketio',
    });
  }
  return socket;
}

export default function StudentBluetoothPage() {
  const { courseId } = useRouter().query;
  const [connected, setConnected] = useState(false);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    if (!token) {
      toast.error("No token found. Please login.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch("/api/studentapis/getStudent", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.Success) {
          setStudent({
            name: data.user.name,
            enrollment: data.user.enrollmentNumber,
          });
        } else {
          toast.error(data.ErrorMessage || "Failed to fetch student", {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    fetchStudent();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on('connect', () => {
      console.log('✅ Student connected');
      setConnected(true);
    });
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const sendSignal = () => {
    const socket = getSocket();
    if (student) {
      socket.emit('student-presence', { ...student, courseId });
      console.log('📡 Signal sent:', { ...student, courseId });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
      <ToastContainer theme="colored" transition={Bounce} />
      <h1 className="text-xl font-bold mb-6">Send Bluetooth Signal</h1>

      {student ? (
        <>
          <p className="mb-2">Name: <strong>{student.name}</strong></p>
          <p className="mb-6">Enrollment: <strong>{student.enrollment}</strong></p>
          <button
            onClick={sendSignal}
            disabled={!connected}
            className={`px-6 py-3 rounded text-white font-semibold ${
              connected ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'
            }`}
          >
            {connected ? 'Send Signal' : 'Connecting...'}
          </button>
        </>
      ) : (
        <p>Loading student data...</p>
      )}
    </div>
  );
}
