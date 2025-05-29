import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TakeAttendance() {
  const router = useRouter();
  const { subject, course } = router.query;
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [classDuration, setClassDuration] = useState("2");

  useEffect(() => {
    const fetchStudents = async () => {
      if (subject) {
        const res = await fetch(`/api/facultyapis/getStudentForCourse?courseCode=${subject}`);
        const data = await res.json();
        if (data.Success) {
          setStudents(data.students);
          const initialStatuses = data.students.reduce((acc, student) => {
            acc[student.enrollmentNumber] = { half1: false, half2: false };
            return acc;
          }, {});
          setAttendanceStatuses(initialStatuses);
        } else {
          toast.error("Failed to fetch students.", {
            position: "top-center",
            theme: "colored",
            transition: Bounce,
            autoClose: 3000,
          });
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
      toast.error("Please select a date!", {
        position: "top-center",
        theme: "colored",
        transition: Bounce,
        autoClose: 3000,
      });
      return;
    }

    const attendancePayload = students.map((student) => {
      const { half1, half2 } = attendanceStatuses[student.enrollmentNumber];
      const presentCount = classDuration === "1" ? (half1 ? 1 : 0) : (half1 ? 1 : 0) + (half2 ? 1 : 0);

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
      toast.success("Attendance marked successfully!", {
        position: "top-center",
        theme: "colored",
        transition: Bounce,
        autoClose: 3000,
      });
    } else {
      toast.error(data.ErrorMessage || "Something went wrong!", {
        position: "top-center",
        theme: "colored",
        transition: Bounce,
        autoClose: 3000,
      });
    }
  };



return (
  <div
    className="flex flex-col h-screen max-w-md mx-auto bg-gradient-to-r from-red-400 to-pink-500 text-gray-900 font-sans shadow-md rounded-lg overflow-hidden"
    style={{
      paddingTop: '10px',   // Navbar height approx
      paddingBottom: '30px' // Footer height approx
    }}
  >

    {/* Header */}
    <header className="h-12 flex items-center justify-center bg-gradient-to-r from-red-400 to-pink-500text-white font-bold text-base shadow-md z-10">
      Take Attendance
    </header>

    {/* Scrollable main content */}
    <main className="flex-1 overflow-y-auto px-4 py-3 bg-white">

      {/* Title */}
      <h1 className="text-xl font-bold text-red-600 mb-4 text-center truncate">
        {course ? `Attendance for ${course} (${subject})` : "Loading..."}
      </h1>

      {/* Date and Duration */}
      <section className="bg-red-50 rounded-lg p-3 mb-5 shadow-sm">
        <label htmlFor="date" className="block mb-1 font-semibold text-gray-700 text-sm">
          Select Class Date
        </label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-400 focus:outline-none mb-3 text-sm text-gray-900"
        />
        <fieldset className="flex justify-around text-gray-700 font-semibold text-sm">
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              name="classDuration"
              value="1"
              checked={classDuration === "1"}
              onChange={(e) => setClassDuration(e.target.value)}
              className="w-4 h-4 text-red-500 focus:ring-red-400"
            />
            <span>1 Hour</span>
          </label>
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              name="classDuration"
              value="2"
              checked={classDuration === "2"}
              onChange={(e) => setClassDuration(e.target.value)}
              className="w-4 h-4 text-red-500 focus:ring-red-400"
            />
            <span>2 Hours</span>
          </label>
        </fieldset>
      </section>

      {/* Select All Button */}
      <div className="mb-5 text-center">
        <button
          onClick={handleSelectAll}
          className="bg-red-600 hover:bg-red-700 transition rounded-full px-6 py-2 text-white font-semibold text-sm shadow focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Select All
        </button>
      </div>

      {/* Attendance Header with Half1 and Half2 labels */}
      <section className="mb-2 px-3 flex justify-end space-x-6 text-xs font-semibold text-gray-700">
        <div className="w-16 flex items-center justify-center">
          Half 1
        </div>
        {classDuration === "2" && (
          <div className="w-16 flex items-center justify-center">
            Half 2
          </div>
        )}
      </section>

      {/* Attendance List */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Mark Attendance</h2>
        <div className="space-y-3">
          {students.map((student) => (
            <div
              key={student.enrollmentNumber}
              className="flex justify-between items-center bg-red-100 rounded-lg p-3 shadow-sm hover:bg-red-200 transition cursor-pointer"
            >
              <div>
                <p className="text-red-600 font-semibold text-sm truncate">{student.name.split(" ")[0]}</p>
                <p className="text-gray-600 text-xs">#{student.enrollmentNumber.slice(-3)}</p>
              </div>

              {/* Checkboxes aligned under the header */}
              <div className="flex items-center space-x-6 text-sm">
                <label className="flex items-center justify-center w-16 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attendanceStatuses[student.enrollmentNumber]?.half1}
                    onChange={(e) => handleCheckboxChange(student.enrollmentNumber, "half1", e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-400"
                  />
                </label>

                {classDuration === "2" && (
                  <label className="flex items-center justify-center w-16 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attendanceStatuses[student.enrollmentNumber]?.half2}
                      onChange={(e) => handleCheckboxChange(student.enrollmentNumber, "half2", e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-400"
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="flex justify-center space-x-4 mb-6">
        <button
          onClick={handleClear}
          className="bg-red-600 hover:bg-red-700 transition rounded-full px-6 py-2 text-white font-semibold text-sm shadow focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 transition rounded-full px-6 py-2 text-white font-semibold text-sm shadow focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Submit
        </button>
      </section>

    </main>

  

  </div>
);







}
