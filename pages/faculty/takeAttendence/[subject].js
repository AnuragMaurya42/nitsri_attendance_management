import React, { useState } from "react";
import { useRouter } from "next/router"; // Import Next.js router
import "tailwindcss/tailwind.css";

const students = [
  { enroll: "2021BCSE001", name: "Anurag Maurya" },
  { enroll: "2021BCSE002", name: "Zlice Johnson" },
  { enroll: "2021BCSE003", name: "Bob Smith" },
  { enroll: "2021BCSE004", name: "Charlie Brown" },
  { enroll: "2021BCSE005", name: "David Wilson" },
  { enroll: "2021BCSE006", name: "Eve Carter" },
  { enroll: "2021BCSE007", name: "Frank Miller" },
  { enroll: "2021BCSE008", name: "Grace Lee" },
  { enroll: "2021BCSE009", name: "Hannah Scott" },
  { enroll: "2021BCSE010", name: "Ian Thomas" },
  { enroll: "2021BCSE011", name: "Jack White" },
  { enroll: "2021BCSE012", name: "Karen Brown" },
  { enroll: "2021BCSE013", name: "Liam Taylor" },
  { enroll: "2021BCSE014", name: "Mia Harris" },
  { enroll: "2021BCSE015", name: "Noah Martin" },
  { enroll: "2021BCSE016", name: "Olivia Robinson" },
  { enroll: "2021BCSE017", name: "Paul Walker" },
  { enroll: "2021BCSE018", name: "Quincy Adams" },
  { enroll: "2021BCSE019", name: "Rachel Turner" },
  { enroll: "2021BCSE020", name: "Sam Wilson" },
];

export default function TakeAttendence() {
  const router = useRouter();
  const { subject } = router.query; // Get the dynamic subject from the URL

  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceCount, setAttendanceCount] = useState(1);
  const [attendanceStatuses, setAttendanceStatuses] = useState(
    new Array(students.length).fill(new Array(1).fill(true))
  );
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // 'success' or 'error'

  const handleAttendanceCountChange = (count) => {
    setAttendanceCount(count);
    setAttendanceStatuses(
      new Array(students.length).fill(new Array(count).fill(true))
    );
  };

  const handleCheckboxChange = (studentIndex, attendanceIndex, checked) => {
    const newStatuses = attendanceStatuses.map((statuses, idx) =>
      idx === studentIndex
        ? statuses.map((status, i) => (i === attendanceIndex ? checked : status))
        : statuses
    );
    setAttendanceStatuses(newStatuses);
  };

  const handleClear = () => {
    setAttendanceStatuses(
      new Array(students.length).fill(new Array(attendanceCount).fill(false))
    );
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      // Show error popup if date is not selected
      setPopupMessage("Error: Please select a date.");
      setPopupType("error");
    } else {
      // Show success popup on successful submission
      setPopupMessage("Attendance marked successfully!");
      setPopupType("success");
    }
    setTimeout(() => setPopupMessage(""), 3000); // Hide the popup after 3 seconds
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">Attendance System</h1>

      {/* Subject */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <label className="block text-sm font-medium mb-2">Subject:</label>
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

      {/* Attendance Count */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <label className="block text-sm font-medium mb-2">
          Number of Attendances:
        </label>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              attendanceCount === 1 ? "bg-blue-600" : "bg-gray-700"
            }`}
            onClick={() => handleAttendanceCountChange(1)}
          >
            One
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              attendanceCount === 2 ? "bg-blue-600" : "bg-gray-700"
            }`}
            onClick={() => handleAttendanceCountChange(2)}
          >
            Two
          </button>
        </div>
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
              <span className="text-sm flex-1">{student.enroll}</span>
              <span className="text-sm flex-1 text-center">{student.name}</span>
              <div className="flex space-x-4">
                {Array.from({ length: attendanceCount }).map(
                  (_, attendanceIndex) => (
                    <input
                      key={attendanceIndex}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      checked={attendanceStatuses[studentIndex][attendanceIndex]}
                      onChange={(e) =>
                        handleCheckboxChange(
                          studentIndex,
                          attendanceIndex,
                          e.target.checked
                        )
                      }
                    />
                  )
                )}
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
