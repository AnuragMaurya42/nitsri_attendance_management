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
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">Attendance System</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <label className="block text-sm font-medium mb-2">Subject:</label>
        <p className="text-lg font-semibold">{subject}</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <label className="block text-sm font-medium mb-2">Select Date:</label>
        <input
          type="date"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

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

      <div className="bg-gray-800 p-3 rounded-lg shadow-md w-full max-w-2xl mb-6">
        <label className="block text-sm font-medium mb-4">Attendance Status:</label>
{/* //table// */}

<table className="table-auto w-full text-left">
  <thead>
    <tr>
      <th className="w-1/12">#</th>
      <th className="w-2/12">Enrollment</th>
      <th className="w-5/12  break-words">Name</th>
      {classDuration === "2" && (
        <>
          <th className="w-2/12 text-center">
            <input
              type="checkbox"
              onChange={(e) => handleMarkAll("half1", e.target.checked)}
            />
          </th>
          <th className="w-2/12 text-center">
            <input
              type="checkbox"
              onChange={(e) => handleMarkAll("half2", e.target.checked)}
            />
          </th>
        </>
      )}
      {classDuration === "1" && (
        <th className="w-2/12 text-center">
          <input
            type="checkbox"
            onChange={(e) => handleMarkAll("half1", e.target.checked)}
          />
        </th>
      )}
    </tr>
  </thead>
  <tbody>
    {students.map((student, index) => (
      <tr key={index} className="border-b border-gray-700">
        <td className="text-sm" >{index + 1}</td>
        <td className="text-sm">{student.enrollmentNumber}</td>
        <td className="text-sm mr-5 break-all max-w-[150px] max-w-[150px] overflow-hidden">
          {student.name}
        </td>
        {classDuration === "2" ? (
          <>
            <td className="text-center">
              <input
                type="checkbox"
                checked={attendanceStatuses[student.enrollmentNumber]?.half1}
                onChange={(e) =>
                  handleCheckboxChange(
                    student.enrollmentNumber,
                    "half1",
                    e.target.checked
                  )
                }
              />
            </td>
            <td className="text-center">
              <input
                type="checkbox"
                checked={attendanceStatuses[student.enrollmentNumber]?.half2}
                onChange={(e) =>
                  handleCheckboxChange(
                    student.enrollmentNumber,
                    "half2",
                    e.target.checked
                  )
                }
              />
            </td>
          </>
        ) : (
          <td className="text-center">
            <input
              type="checkbox"
              checked={attendanceStatuses[student.enrollmentNumber]?.half1}
              onChange={(e) =>
                handleCheckboxChange(
                  student.enrollmentNumber,
                  "half1",
                  e.target.checked
                )
              }
            />
          </td>
        )}
      </tr>
    ))}
  </tbody>
</table>




{/* Table END */}
      </div>

      <div className="space-x-4">
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
