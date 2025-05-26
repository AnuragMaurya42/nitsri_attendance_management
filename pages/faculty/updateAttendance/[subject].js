import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateAttendance() {
  const router = useRouter();
  const { subject, course } = router.query;

  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [classDuration, setClassDuration] = useState("2");

  useEffect(() => {
    if (subject) fetchStudents();
  }, [subject]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/facultyapis/getStudentForCourse?courseCode=${subject}`);
      const data = await res.json();
      if (data.Success) {
        setStudents(data.students);
        const initial = data.students.reduce((acc, student) => {
          acc[student.enrollmentNumber] = { half1: false, half2: false };
          return acc;
        }, {});
        setAttendanceStatuses(initial);
      } else {
        toast.error("Failed to load students", {
          position: "top-center",
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("Error fetching students", {
        position: "top-center",
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const fetchAttendance = async () => {
    if (!selectedDate) {
      toast.warning("Please select a date first", {
        position: "top-center",
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    try {
      const res = await fetch("/api/facultyapis/getAttendanceByDate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode: subject, date: selectedDate }),
      });

      const data = await res.json();
      if (data.Success && data.attendance) {
        setClassDuration(data.attendance.classDuration);
        const updatedStatuses = {};
        for (let student of students) {
          const record = data.attendance.attendances.find(
            (att) => att.studentEnrollment === student.enrollmentNumber
          );
          if (record) {
            if (data.attendance.classDuration === "2") {
              updatedStatuses[student.enrollmentNumber] = {
                half1: record.totalPresents >= 1,
                half2: record.totalPresents === 2,
              };
            } else {
              updatedStatuses[student.enrollmentNumber] = {
                half1: record.totalPresents === 1,
                half2: false,
              };
            }
          }
        }
        setAttendanceStatuses((prev) => ({ ...prev, ...updatedStatuses }));
        toast.success("Attendance loaded successfully", {
          position: "top-center",
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error("No attendance found for the selected date", {
          position: "top-center",
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("Error fetching attendance", {
        position: "top-center",
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const deleteAttendance = async () => {
    if (!selectedDate) {
      toast.warning("Please select a date first", {
        position: "top-center",
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    try {
      const res = await fetch("/api/facultyapis/deleteAttendanceByDate", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseCode: subject,
          selectedDate,
        }),
      });

      const data = await res.json();
      if (data.Success) {
        setAttendanceStatuses({});
        toast.success("Attendance deleted successfully", {
          position: "top-center",
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error(data.ErrorMessage || "Failed to delete attendance", {
          position: "top-center",
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("Error deleting attendance", {
        position: "top-center",
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleSubmit = async () => {
    const attendancePayload = students.map((student) => {
      const { half1, half2 } = attendanceStatuses[student.enrollmentNumber];
      const presentCount =
        classDuration === "2" ? (half1 ? 1 : 0) + (half2 ? 1 : 0) : (half1 ? 1 : 0);

      return {
        enrollmentNumber: student.enrollmentNumber,
        name: student.name,
        presentCount,
      };
    });

    try {
      const res = await fetch("/api/facultyapis/markAttendance", {
        method: "POST",
        body: JSON.stringify({
          courseCode: subject,
          selectedDate,
          attendanceStatuses: attendancePayload,
          classDuration,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.Success) {
        toast.success("Attendance updated successfully!", {
          position: "top-center",
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error(data.ErrorMessage || "Attendance update failed", {
          position: "top-center",
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("Error updating attendance", {
        position: "top-center",
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleCheckboxChange = (enrollmentNumber, half, checked) => {
    setAttendanceStatuses((prev) => ({
      ...prev,
      [enrollmentNumber]: {
        ...prev[enrollmentNumber],
        [half]: checked,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-10 px-4">
      <ToastContainer />
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-red-600">
          Update Attendance - {subject} ({course})
        </h1>
      </div>

      <div className="bg-red-100 p-4 rounded-lg shadow w-full max-w-xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="date"
          className="p-3 border rounded w-full sm:w-1/2 bg-white text-gray-800"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={fetchAttendance}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Load Attendance
          </button>
          <button
            onClick={deleteAttendance}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
          >
            Delete Attendance
          </button>
        </div>
      </div>

      {students.length > 0 && (
        <div className="w-full max-w-6xl">
          <p className="text-lg font-medium text-gray-700 mb-4">
            Class Duration: {classDuration} Hour(s)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {students.map((student) => (
              <div
                key={student.enrollmentNumber}
                className="border p-4 rounded bg-red-50 shadow-sm"
              >
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-gray-600">{student.enrollmentNumber}</p>
                <div className="flex flex-col mt-2 space-y-2 text-sm">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={attendanceStatuses[student.enrollmentNumber]?.half1 || false}
                      onChange={(e) =>
                        handleCheckboxChange(student.enrollmentNumber, "half1", e.target.checked)
                      }
                      className="w-4 h-4 text-red-600"
                    />
                    <span>Half 1</span>
                  </label>
                  {classDuration === "2" && (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={attendanceStatuses[student.enrollmentNumber]?.half2 || false}
                        onChange={(e) =>
                          handleCheckboxChange(student.enrollmentNumber, "half2", e.target.checked)
                        }
                        className="w-4 h-4 text-red-600"
                      />
                      <span>Half 2</span>
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="mt-8 bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded"
            >
              Update Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
