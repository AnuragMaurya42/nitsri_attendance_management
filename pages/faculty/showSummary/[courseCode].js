import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";  // To generate tables in PDF
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AttendanceSummaryPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPercentage, setMinPercentage] = useState("");  // New state for minimum percentage
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const router = useRouter();
  const { courseCode, course } = router.query;

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (courseCode) {
        try {
          const response = await axios.post("/api/facultyapis/getAttendances", { courseCode });
          if (response.data.Success) {
            setAttendanceRecords(response.data.attendanceRecords);
          } else {
            console.error(response.data.ErrorMessage);
            toast.error("Failed to fetch attendance records.", {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
              transition: Bounce,
            });
          }
        } catch (error) {
          console.error("Error fetching attendance records:", error.message);
          toast.error("An error occurred while fetching attendance records.", {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
            transition: Bounce,
          });
        }
      }
    };

    fetchAttendanceRecords();
  }, [courseCode]);

  const handleFilter = () => {
    // Flatten records with dates
    const flattenedRecords = attendanceRecords.flatMap((record) =>
      record.attendances.map((attendance) => ({
        ...attendance,
        date: record.date,
        classDuration: record.classDuration,
      }))
    );

    // Filter by date range
    const filteredByDate = flattenedRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        (!startDate || recordDate >= new Date(startDate)) &&
        (!endDate || recordDate <= new Date(endDate))
      );
    });

    // Aggregate presents by student
    const attendanceSummary = filteredByDate.reduce((acc, record) => {
      const { studentEnrollment, studentName, totalPresents, classDuration } = record;

      if (!acc[studentEnrollment]) {
        acc[studentEnrollment] = {
          studentName,
          studentEnrollment,
          totalPresents: 0,
          totalClasses: 0,
        };
      }

      acc[studentEnrollment].totalPresents += totalPresents;
      acc[studentEnrollment].totalClasses += Number(classDuration);
      return acc;
    }, {});

    // Convert to array and calculate percentage
    const attendanceArray = Object.values(attendanceSummary).map((student) => {
      return {
        ...student,
        percentage: ((student.totalPresents / student.totalClasses) * 100).toFixed(2),
      };
    });

    // Filter by minimum percentage if provided
    const filteredByPercentage = attendanceArray.filter(
      (student) => minPercentage === "" || student.percentage >= parseFloat(minPercentage)
    );

    setFilteredAttendance(filteredByPercentage);

    toast.success("Attendance filtered successfully!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
      transition: Bounce,
    });
  };

  const handleDownloadPDF = () => {
    if (filteredAttendance.length === 0) {
      toast.warning("No data to download as PDF.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    const doc = new jsPDF();
    doc.text("Attendance Summary Report", 10, 10);

    const tableData = filteredAttendance.map((student) => [
      student.studentName,
      student.studentEnrollment,
      student.totalPresents,
      `${student.percentage}%`,
    ]);

    doc.autoTable({
      head: [["Name", "Enrollment", "Total Presents", "Attendance Percentage"]],
      body: tableData,
    });

    doc.save("Attendance_Summary.pdf");

    toast.success("PDF Downloaded successfully!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
      transition: Bounce,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 sm:p-6">
      <ToastContainer position="top-center" autoClose={5000} theme="colored" transition={Bounce} />
      <div className="w-full max-w-4xl bg-white p-4 sm:p-6 rounded-lg shadow-md border border-red-600">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-red-600 mb-4 sm:mb-6">
          Attendance Summary for {course}
        </h2>

        {/* Filters */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <label className="block text-sm text-red-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm text-red-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm text-red-600">Min Percentage</label>
            <input
              type="number"
              value={minPercentage}
              onChange={(e) => setMinPercentage(e.target.value)}
              min="0"
              max="100"
              className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-800"
            />
          </div>
        </div>

        {/* Button to Apply Filters */}
        <button
          onClick={handleFilter}
          className="mb-4 px-8 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
        >
          Check Attendance
        </button>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          className="mb-4 ml-4 px-8 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
        >
          Download PDF
        </button>

        {/* Table */}
        <div className="overflow-x-auto mb-4 sm:mb-6">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Enrollment</th>
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Total Presents</th>
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Attendance Percentage</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((student, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer bg-white hover:bg-gray-100 text-gray-800"
                  >
                    <td className="px-2 sm:px-4 py-2">{student.studentName}</td>
                    <td className="px-2 sm:px-4 py-2">{student.studentEnrollment}</td>
                    <td className="px-2 sm:px-4 py-2">{student.totalPresents}</td>
                    <td className="px-2 sm:px-4 py-2">{student.percentage}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center px-4 py-2 text-gray-500">
                    No attendance records found for the given criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceSummaryPage;
