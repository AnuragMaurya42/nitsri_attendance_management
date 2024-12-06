import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

function AttendanceSummaryPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [percentFilter, setPercentFilter] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]); // State for fetched attendance data
  const router = useRouter();
  const { courseCode } = router.query; // Assuming courseCode is passed as a query param
  const subject="default";

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (courseCode) {
        try {
          const response = await axios.post("/api/facultyapis/getAttendances", { courseCode });
          if (response.data.Success) {
            console.log(response.data.attendanceRecords);
            setAttendanceRecords(response.data.attendanceRecords);
          } else {
            console.error(response.data.ErrorMessage);
          }
        } catch (error) {
          console.error("Error fetching attendance records:", error.message);
        }
      }
    };

    fetchAttendanceRecords();
  }, [courseCode]);

  // Filter students based on date range and percent
  const filteredStudents = attendanceRecords
    .flatMap((record) => record.attendances.map((attendance) => ({
      ...attendance,
      date: record.date,
    })))
    .filter((student) => {
      const studentDate = new Date(student.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const withinDateRange = (!start || studentDate >= start) && (!end || studentDate <= end);
      const minPercent = percentFilter ? parseInt(percentFilter, 10) : 0;
      const withinPercentRange = student.totalPresents * 50 >= minPercent; // Assuming each present is worth 50%

      return withinDateRange && withinPercentRange;
    });

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Attendance Summary", 14, 20);
    if (subject) {
      doc.text(`Subject: ${subject}`, 14, 30);
    }

    // Define columns for the table
    const columns = ["Name", "Enrollment", "Total Presents", "Date"];
    const rows = filteredStudents.map((student) => [
      student.studentName,
      student.studentEnrollment,
      student.totalPresents,
      student.date,
    ]);

    // Add table
    doc.autoTable({
      startY: subject ? 40 : 30,
      head: [columns],
      body: rows,
    });

    // Save the PDF
    doc.save("Attendance_Summary.pdf");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-100 mb-4 sm:mb-6">
          Attendance Summary
        </h2>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-100 mb-4 sm:mb-6">
          {subject}
        </h2>

        {/* Filters */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm text-gray-400">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-gray-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400">Min Percent</label>
            <input
              type="number"
              min="0"
              max="100"
              value={percentFilter}
              onChange={(e) => setPercentFilter(e.target.value)}
              placeholder="Enter min percent"
              className="w-full sm:w-auto px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-gray-300"
            />
          </div>
        </div>

        <button
          onClick={generatePDF}
          className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Download PDF
        </button>
        {/* Table */}
        <div className="overflow-x-auto mb-4 sm:mb-6">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-400">
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Enrollment</th>
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Total Presents</th>
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="px-2 sm:px-4 py-2 text-gray-300">{student.studentName}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-300">{student.studentEnrollment}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-300">{student.totalPresents}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-300">{student.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-2 sm:px-4 py-2 text-center text-gray-500">
                    No records found
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
