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
  const [classDuration, setClassDuration] = useState("2"); // Default to 2-hour class

  useEffect(() => {
    const fetchStudents = async () => {
      if (subject) {
        const res = await fetch(`/api/facultyapis/getAllStudents`);
        const data = await res.json();
        if (data.Success) {
          setStudents(data.students);
          const initialStatuses = data.students.reduce((acc, student) => {
            acc[student.enrollmentNumber] = { half1: false, half2: false };
            return acc;
          }, {});
          setAttendanceStatuses(initialStatuses);
        }
      }
    };
    fetchStudents();
  }, [subject]);

  const handleCheckboxChange = (enrollmentNumber, half, checked) => {
    setAttendanceStatuses((prev) => ({
      ...prev,
      [enrollmentNumber]: {
        ...prev[enrollmentNumber],
        [half]: checked,
      },
    }));
  };

  const handleMarkAll = (half, checked) => {
    setAttendanceStatuses((prev) => {
      const updatedStatuses = { ...prev };
      students.forEach((student) => {
        if (classDuration === "1" && half === "half1") {
          updatedStatuses[student.enrollmentNumber][half] = checked;
        } else if (classDuration === "2") {
          updatedStatuses[student.enrollmentNumber][half] = checked;
        }
      });
      return updatedStatuses;
    });
  };

  const handleClear = () => {
    setAttendanceStatuses(
      students.reduce((acc, student) => {
        acc[student.enrollmentNumber] = { half1: false, half2: false };
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

    const attendancePayload = students.map((student) => {
      const { half1, half2 } = attendanceStatuses[student.enrollmentNumber];
      let presentCount = 0; // Initialize present count

      if (classDuration === "1") {
        presentCount = half1 ? 1 : 0; // 1-hour class, mark present or absent
      } else if (classDuration === "2") {
        presentCount = (half1 ? 1 : 0) + (half2 ? 1 : 0); // 2-hour class, count total presents
      }

      return {
        enrollmentNumber: student.enrollmentNumber,
        name: student.name,
        presentCount, // Send total number of presents
      };
    });

    const res = await fetch("/api/facultyapis/markAttendance", {
      method: "POST",
      body: JSON.stringify({
        courseCode: subject,
        selectedDate,
        attendanceStatuses: attendancePayload, // Send the updated payload
        classDuration: classDuration,
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

      {/* Class Duration */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <label className="block text-sm font-medium mb-2">Class Duration:</label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="classDuration"
              value="1"
              checked={classDuration === "1"}
              onChange={(e) => setClassDuration(e.target.value)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span>1 Hour</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="classDuration"
              value="2"
              checked={classDuration === "2"}
              onChange={(e) => setClassDuration(e.target.value)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span>2 Hours</span>
          </label>
        </div>
      </div>

      {/* Attendance Status */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl mb-6">
        <label className="block text-sm font-medium mb-4">Attendance Status:</label>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm w-10 text-center font-bold">#</span>
          <span className="text-sm flex-1 text-center font-bold">Enrollment</span>
          <span className="text-sm flex-1 text-center font-bold">Name</span>
          {classDuration === "2" && (
            <>
              <div className="flex space-x-4">
                <div>
                  <label className="text-xs">Mark All Half 1</label>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    onChange={(e) => handleMarkAll("half1", e.target.checked)}
                  />
                </div>
                <div>
                  <label className="text-xs">Mark All Half 2</label>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    onChange={(e) => handleMarkAll("half2", e.target.checked)}
                  />
                </div>
              </div>
            </>
          )}
          {classDuration === "1" && (
            <div>
              <label className="text-xs">Mark All</label>
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                onChange={(e) => handleMarkAll("half1", e.target.checked)}
              />
            </div>
          )}
        </div>
        <div>
          {students.map((student, studentIndex) => (
            <div
              key={studentIndex}
              className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2"
            >
              <span className="text-sm w-10 text-center">{studentIndex + 1}</span>
              <span className="text-sm flex-1 text-center">{student.enrollmentNumber}</span>
              <span className="text-sm flex-1 text-center">{student.name}</span>
              {classDuration === "2" && (
                <>
                  <div>
                    <input
                      type="checkbox"
                      checked={attendanceStatuses[student.enrollmentNumber].half1}
                      onChange={(e) =>
                        handleCheckboxChange(
                          student.enrollmentNumber,
                          "half1",
                          e.target.checked
                        )
                      }
                    />
                    <span className="text-xs">Half 1</span>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={attendanceStatuses[student.enrollmentNumber].half2}
                      onChange={(e) =>
                        handleCheckboxChange(
                          student.enrollmentNumber,
                          "half2",
                          e.target.checked
                        )
                      }
                    />
                    <span className="text-xs">Half 2</span>
                  </div>
                </>
              )}
              {classDuration === "1" && (
                <div>
                  <input
                    type="checkbox"
                    checked={attendanceStatuses[student.enrollmentNumber].half1}
                    onChange={(e) =>
                      handleCheckboxChange(
                        student.enrollmentNumber,
                        "half1",
                        e.target.checked
                      )
                    }
                  />
                  <span className="text-xs">Full</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-x-4">
        <button
          onClick={handleClear}
          className="bg-gray-700 py-2 px-4 rounded text-white"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 py-2 px-4 rounded text-white"
        >
          Submit
        </button>
      </div>

      {/* Popup */}
      {popupMessage && (
        <div
          className={`fixed top-0 left-0 right-0 bg-${
            popupType === "error" ? "red" : "green"
          }-500 text-white text-center py-3`}
        >
          {popupMessage}
        </div>
      )}
    </div>
  );
}
