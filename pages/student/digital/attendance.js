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
        socketRef.current = io(); 
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
  <div
    className="pt-16 pb-16 px-4 min-h-screen bg-gradient-to-b from-blue-600 to-blue-400 text-white flex flex-col items-center justify-center"
    style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}
  >
    <h2 className="text-2xl font-extrabold mb-4">Bluetooth Attendance</h2>
    <p className="text-base max-w-xs text-center">
      Emitting your attendance signal...
    </p>
  </div>
);

}
