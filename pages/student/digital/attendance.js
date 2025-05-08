import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function StudentBluetoothPage() {
  const socketRef = useRef(null);

  const enrollmentNumber = "2021BCSE042"; // Make this dynamic via props/context if needed
  const studentName = "Anurag Maurya";

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure socket is only created on the client side
      if (!socketRef.current) {
        socketRef.current = io(); // You can add your backend URL like io("http://localhost:5000")
      }

      // Emit student data once on mount
      socketRef.current.emit("student-signal", {
        enrollmentNumber,
        studentName,
      });

      // Optional: handle acknowledgment or errors
      socketRef.current.on("acknowledge", (msg) => {
        console.log("Acknowledged by server:", msg);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Bluetooth Attendance</h2>
      <p className="mt-2">Emitting your attendance signal...</p>
    </div>
  );
}
