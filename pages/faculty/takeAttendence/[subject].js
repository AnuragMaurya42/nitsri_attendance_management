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
  <div className="flex flex-col h-screen bg-white text-gray-900 font-sans max-w-md mx-auto shadow-md rounded-xl overflow-hidden">

    {/* Header space placeholder (same height as your fixed Navbar) */}
    <div className="h-14 flex items-center justify-center bg-gray-800 text-white font-bold text-lg shadow-md z-10">
      Take Attendance
    </div>

    {/* Scrollable content */}
    <main className="flex-1 overflow-y-auto px-5 py-4 bg-white">

      {/* Title */}
      <h1 className="text-2xl font-extrabold text-red-600 mb-6 text-center">
        {course ? `Take Attendance for ${course} (${subject})` : "Loading..."}
      </h1>

      {/* Date and Duration */}
      <section className="bg-red-50 rounded-xl p-4 mb-6 shadow-sm">

        <label htmlFor="date" className="block mb-1 font-semibold text-gray-800">
          Select Class Date
        </label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-400 focus:outline-none mb-4 text-gray-900"
        />

        <fieldset className="flex justify-around text-gray-800 font-semibold">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="classDuration"
              value="1"
              checked={classDuration === "1"}
              onChange={(e) => setClassDuration(e.target.value)}
              className="w-5 h-5 text-red-500 focus:ring-red-400"
            />
            <span>1 Hour</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="classDuration"
              value="2"
              checked={classDuration === "2"}
              onChange={(e) => setClassDuration(e.target.value)}
              className="w-5 h-5 text-red-500 focus:ring-red-400"
            />
            <span>2 Hours</span>
          </label>
        </fieldset>
      </section>

      {/* Select All Button */}
      <div className="mb-6 text-center">
        <button
          onClick={handleSelectAll}
          className="bg-red-600 hover:bg-red-700 transition rounded-full px-8 py-3 text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Select All
        </button>
      </div>

      {/* Attendance Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Mark Attendance</h2>

        <div className="grid grid-cols-1 gap-4">
          {students.map((student) => (
            <div
              key={student.enrollmentNumber}
              className="flex justify-between items-center bg-red-100 rounded-xl p-4 shadow-sm hover:bg-red-200 transition cursor-pointer"
            >
              <div>
                <p className="text-red-600 font-semibold">{student.name.split(" ")[0]}</p>
                <p className="text-gray-600 text-sm">#{student.enrollmentNumber.slice(-3)}</p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attendanceStatuses[student.enrollmentNumber]?.half1}
                    onChange={(e) => handleCheckboxChange(student.enrollmentNumber, "half1", e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-400"
                  />
                  <span className="text-sm select-none">Half 1</span>
                </label>

                {classDuration === "2" && (
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attendanceStatuses[student.enrollmentNumber]?.half2}
                      onChange={(e) => handleCheckboxChange(student.enrollmentNumber, "half2", e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-400"
                    />
                    <span className="text-sm select-none">Half 2</span>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="flex justify-center space-x-6 mb-8">
        <button
          onClick={handleClear}
          className="bg-red-600 hover:bg-red-700 transition rounded-full px-8 py-3 text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 transition rounded-full px-8 py-3 text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Submit
        </button>
      </section>
    </main>

    {/* Footer space placeholder (same height as your fixed Footer) */}
    <div className="h-14 bg-gray-800 text-white flex items-center justify-center text-sm shadow-inner z-10">
      &copy; {new Date().getFullYear()} NIT Srinagar. All rights reserved.
    </div>
  </div>
);



}
