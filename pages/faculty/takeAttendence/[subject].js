import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";

export default function TakeAttendance() {
  const router = useRouter();
  const { subject } = router.query;
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  useEffect(() => {
    const fetchStudents = async () => {
      if (subject) {
        const res = await fetch(`/api/facultyapis/getAllStudents`);
        const data = await res.json();
        if (data.Success) {
          setStudents(data.students);
          const initialStatuses = data.students.reduce((acc, student) => {
            acc[student.enrollmentNumber] = "0"; // Default to Absent ("0")
            return acc;
          }, {});
          setAttendanceStatuses(initialStatuses);
        }
      }
    };
    fetchStudents();
  }, [subject]);

  const handleCheckboxChange = (enrollmentNumber, checked) => {
    setAttendanceStatuses((prev) => ({
      ...prev,
      [enrollmentNumber]: checked ? "1" : "0", // "1" for Present, "0" for Absent
    }));
  };

  const handleClear = () => {
    setAttendanceStatuses(
      students.reduce((acc, student) => {
        acc[student.enrollmentNumber] = "0"; // Reset to "Absent"
        return acc;
      }, {})
    );
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      setPopupMessage("Error: Please select a date.");
      setPopupType("error");
      setTimeout(() => setPopupMessage(""), 3000);
      return;
    }

    const attendancePayload = students.map((student) => ({
      enrollmentNumber: student.enrollmentNumber, // Full enrollment number
      name: student.name, // Student name
      attendanceStatus: attendanceStatuses[student.enrollmentNumber], // "1" or "0"
    }));

    const res = await fetch("/api/facultyapis/markAttendance", {
      method: "POST",
      body: JSON.stringify({
        courseCode: subject,
        selectedDate,
        attendanceStatuses: attendancePayload,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.Success) {
      setPopupMessage("Attendance marked successfully!");
      setPopupType("success");
    } else {
      setPopupMessage(data.ErrorMessage);
      setPopupType("error");
    }

    setTimeout(() => setPopupMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">Attendance System</h1>

      {/* Subject */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <label className="block text-sm font-medium mb-2">Subject: </label>
        <p className="text-lg font-semibold">{subject}</p>
      </div>

      {/* Select Date */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <label className="block text-sm font-medium mb-2">Select Date:</label>
        <input
          type="date"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Attendance Status */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl mb-6">
        <label className="block text-sm font-medium mb-4">
          Attendance Status:
        </label>
        <div>
          {students.map((student, studentIndex) => (
            <div
              key={studentIndex}
              className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2"
            >
              <span className="text-sm w-10 text-center">{studentIndex + 1}</span>
              <span className="text-sm flex-1 text-center">
                {student.enrollmentNumber.slice(-3)} {/* Show last 3 characters */}
              </span>
              <span className="text-sm flex-1 text-center">{student.name}</span>
              <div className="flex space-x-4">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  checked={attendanceStatuses[student.enrollmentNumber] === "1"}
                  onChange={(e) =>
                    handleCheckboxChange(
                      student.enrollmentNumber,
                      e.target.checked
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleClear}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Submit
        </button>
      </div>

      {/* Popup */}
      {popupMessage && (
        <div
          className={`fixed top-10 right-10 px-4 py-2 rounded-lg shadow-md ${
            popupType === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {popupMessage}
        </div>
      )}
    </div>
  );
}
