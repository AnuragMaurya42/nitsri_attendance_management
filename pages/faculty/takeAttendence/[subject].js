import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";

export default function TakeAttendance() {
  const router = useRouter();
  const { subject, course } = router.query; // Subject passed as a query parameter
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [classDuration, setClassDuration] = useState("2");

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

  const handleSelectAll = () => {
    setAttendanceStatuses((prev) => {
      const updatedStatuses = { ...prev };
      students.forEach((student) => {
        updatedStatuses[student.enrollmentNumber] = {
          half1: true,
          half2: true,
        };
      });
      return updatedStatuses;
    });
  };

  const handleMarkAll = (half, checked) => {
    setAttendanceStatuses((prev) => {
      const updatedStatuses = { ...prev };
      students.forEach((student) => {
        updatedStatuses[student.enrollmentNumber][half] = checked;
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
      let presentCount = classDuration === "1" ? (half1 ? 1 : 0) : (half1 ? 1 : 0) + (half2 ? 1 : 0);

      return {
        enrollmentNumber: student.enrollmentNumber,
        name: student.name,
        presentCount,
      };
    });

    const res = await fetch("/api/facultyapis/markAttendance", {
      method: "POST",
      body: JSON.stringify({
        courseCode: subject,
        selectedDate,
        attendanceStatuses: attendancePayload,
        classDuration,
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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-lg font-bold text-yellow-400">Attendance for {course} ({subject})</p>
      </div>

      {/* Date and Class Duration Section */}
      <div className="bg-red-100 p-3 rounded-lg shadow-lg mb-3 w-full max-w-xl mx-auto flex items-center justify-between">
        <div className="mb-2 flex flex-1 items-center justify-between">
          <div className="w-1/2 pr-2">
            <label htmlFor="date" className="block text-sm font-medium text-black mb-1">
              Select Class Date
            </label>
            <input
              type="date"
              id="date"
              className="p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Class Duration Radio Buttons */}
          <div className="w-1/2 pl-2">
            <label className="block text-sm font-medium text-black mb-1">Class Duration</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 text-black">
                <input
                  type="radio"
                  name="classDuration"
                  value="1"
                  checked={classDuration === "1"}
                  onChange={(e) => setClassDuration(e.target.value)}
                  className="w-6 h-6 text-red-500 border-gray-600 focus:ring-2 focus:ring-red-500"
                />
                <span>1 Hour</span>
              </label>
              <label className="flex items-center space-x-2 text-black">
                <input
                  type="radio"
                  name="classDuration"
                  value="2"
                  checked={classDuration === "2"}
                  onChange={(e) => setClassDuration(e.target.value)}
                  className="w-6 h-6 text-red-500 border-gray-600 focus:ring-2 focus:ring-red-500"
                />
                <span>2 Hours</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Select All Button */}
      <div className="mb-6">
        <button
          onClick={handleSelectAll}
          className="bg-red-600 hover:bg-red-500 py-2 px-4 rounded text-white transition duration-300"
        >
          Select All
        </button>
      </div>

      {/* Attendance Cards */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Mark Attendance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {students.map((student) => (
            <div
              key={student.enrollmentNumber}
              className="bg-red-100 p-4 rounded-lg flex flex-col items-center text-gray-900 hover:bg-red-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between w-full">
                <p className="text-lg font-semibold text-red-600">{student.name.split(" ")[0]}</p>
                <p className="text-sm text-gray-600">{student.enrollmentNumber.slice(-3)}</p>
                {classDuration === "2" ? (
                  <div className="flex space-x-1">
                    <input
                      type="checkbox"
                      checked={attendanceStatuses[student.enrollmentNumber]?.half1}
                      onChange={(e) => handleCheckboxChange(student.enrollmentNumber, "half1", e.target.checked)}
                      className="w-6 h-6 text-green-500 rounded-full focus:ring-2 focus:ring-green-500"
                    />
                    <span>Half 1</span>
                    <input
                      type="checkbox"
                      checked={attendanceStatuses[student.enrollmentNumber]?.half2}
                      onChange={(e) => handleCheckboxChange(student.enrollmentNumber, "half2", e.target.checked)}
                      className="w-6 h-6 text-green-500 rounded-full focus:ring-2 focus:ring-green-500"
                    />
                    <span>Half 2</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={attendanceStatuses[student.enrollmentNumber]?.half1}
                      onChange={(e) => handleCheckboxChange(student.enrollmentNumber, "half1", e.target.checked)}
                      className="w-6 h-6 text-green-500 rounded-full focus:ring-2 focus:ring-green-500"
                    />
                    <span className="ml-2"></span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-x-4 text-center">
        <button onClick={handleClear} className="bg-red-600 hover:bg-red-500 py-2 px-4 rounded text-white transition duration-300">
          Clear
        </button>
        <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-500 py-2 px-4 rounded text-white transition duration-300">
          Submit
        </button>
      </div>

      {/* Popup Message */}
      {popupMessage && (
        <div
          className={`fixed top-0 left-0 right-0 py-3 text-center text-white font-semibold ${
            popupType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {popupMessage}
        </div>
      )}
    </div>
  );
}
