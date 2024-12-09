import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";

export default function TakeAttendance() {
  const router = useRouter();
  const { subject } = router.query; // Subject passed as a query parameter
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
          console.log(data);
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
    <div className="min-h-screen bg-gradient-to-r from-gray-900  to-gray-600 text-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-gold-500">Attendance System</h1>

      {/* Combined Subject, Date, and Duration in a single div */}
      <div className="bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 p-6 rounded-lg shadow-xl w-full max-w-lg mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Subject:</label>
          <p className="text-lg font-semibold">{subject}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Date:</label>
          <input
            type="date"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Class Duration:</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="classDuration"
                value="1"
                checked={classDuration === "1"}
                onChange={(e) => setClassDuration(e.target.value)}
                className="w-6 h-6 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
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
                className="w-6 h-6 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span>2 Hours</span>
            </label>
          </div>
        </div>
      </div>

      {/* Centered Attendance section with a grayish purple background */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-black p-6 rounded-lg shadow-xl w-full max-w-3xl mb-6">
        <div className="text-center mb-4">
          <label className="block text-sm font-medium mb-2 text-white">Attendance Status:</label>
        </div>

        <table className="table-auto w-full text-left border border-gray-500 text-lg text-white mx-auto">
          <thead>
            <tr>
              <th className="w-1/12 p-3">#</th>
              <th className="w-2/12 p-3">Enroll</th>
              <th className="w-5/12 break-words p-3">Name</th>
              {classDuration === "2" && (
                <>
                  <th className="w-5/12 text-center p-3">
                    <input
                      type="checkbox"
                      onChange={(e) => handleMarkAll("half1", e.target.checked)}
                      className="w-8 h-8 rounded-full border-2 border-gray-600 checked:bg-green-500 focus:ring-0 transition-all duration-300"
                    />
                  </th>
                  <th className="w-5/20 text-center p-3">
                    <input
                      type="checkbox"
                      onChange={(e) => handleMarkAll("half2", e.target.checked)}
                      className="w-8 h-8 rounded-full border-2 border-gray-600 checked:bg-green-500 focus:ring-0 transition-all duration-300"
                    />
                  </th>
                </>
              )}
              {classDuration === "1" && (
                <th className="w-5/12 text-center p-3">
                  <input
                    type="checkbox"
                    onChange={(e) => handleMarkAll("half1", e.target.checked)}
                    className="w-8 h-8 rounded-full border-2 border-gray-600 checked:bg-green-500 focus:ring-0 transition-all duration-300"
                  />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="border-b border-gray-600">
                <td className="text-lg p-3">{index + 1}</td>
                <td className="text-lg p-3">{student.enrollmentNumber.slice(-3)}</td>
                <td className="text-lg break-all max-w-[150px] overflow-hidden p-3">
                  {student.name.split(" ")[0]}
                </td>
                {classDuration === "2" ? (
                  <>
                    <td className="text-center p-3">
                      <input
                        type="checkbox"
                        checked={attendanceStatuses[student.enrollmentNumber]?.half1}
                        onChange={(e) =>
                          handleCheckboxChange(student.enrollmentNumber, "half1", e.target.checked)
                        }
                        className="w-8 h-8 rounded-full border-2 border-gray-600 checked:bg-green-500 focus:ring-0 transition-all duration-300"
                      />
                    </td>
                    <td className="text-center p-3">
                      <input
                        type="checkbox"
                        checked={attendanceStatuses[student.enrollmentNumber]?.half2}
                        onChange={(e) =>
                          handleCheckboxChange(student.enrollmentNumber, "half2", e.target.checked)
                        }
                        className="w-8 h-8 rounded-full border-2 border-gray-600 checked:bg-green-500 focus:ring-0 transition-all duration-300"
                      />
                    </td>
                  </>
                ) : (
                  <td className="text-center p-3">
                    <input
                      type="checkbox"
                      checked={attendanceStatuses[student.enrollmentNumber]?.half1}
                      onChange={(e) =>
                        handleCheckboxChange(student.enrollmentNumber, "half1", e.target.checked)
                      }
                      className="w-8 h-8 rounded-full border-2 border-gray-600 checked:bg-green-500 focus:ring-0 transition-all duration-300"
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-x-4 text-center">
        <button onClick={handleClear} className="bg-gray-700 py-2 px-4 rounded text-white">
          Clear
        </button>
        <button onClick={handleSubmit} className="bg-blue-500 py-2 px-4 rounded text-white">
          Submit
        </button>
      </div>

      {popupMessage && (
        <div
          className={`fixed top-0 left-0 right-0 py-3 text-white ${
            popupType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {popupMessage}
        </div>
      )}
    </div>
  );
}
