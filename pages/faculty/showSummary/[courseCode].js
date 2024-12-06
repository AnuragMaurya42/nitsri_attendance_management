import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

function AttendanceSummaryPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [percentFilter, setPercentFilter] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isPercentageChecked, setIsPercentageChecked] = useState(false);
  const router = useRouter();
  const { courseCode } = router.query;

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (courseCode) {
        try {
          const response = await axios.post("/api/facultyapis/getAttendances", { courseCode });
          if (response.data.Success) {
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

  // Flatten and process attendance records
  const flattenedRecords = attendanceRecords.flatMap((record) =>
    record.attendances.map((attendance) => ({
      ...attendance,
      date: record.date,
      classDuration: record.classDuration,
    }))
  );

  // Convert summary into an array and calculate percentages
  const studentAttendanceSummary = flattenedRecords.reduce((acc, record) => {
    const { studentEnrollment, studentName, totalPresents, classDuration, date } = record;

    if (!acc[studentEnrollment]) {
      acc[studentEnrollment] = {
        studentName,
        studentEnrollment,
        totalClasses: 0,
        totalPresents: 0,
        attendanceDates: [],
      };
    }

    const student = acc[studentEnrollment];

    // Increment the class and present for all records, we will filter by date range later
    student.totalClasses++;
    student.totalPresents += totalPresents;
    student.attendanceDates.push(date);

    return acc;
  }, {});

  // Convert summary into an array and calculate percentages
  const studentSummaries = Object.values(studentAttendanceSummary).map((student) => {
    // Calculate attendance percentage only if totalClasses is greater than 0
    const attendancePercentage =
      student.totalClasses > 0
        ? (student.totalPresents / (student.totalClasses * 2)) * 100 // Assuming 2 classes per session
        : 0;

    return {
      ...student,
      attendancePercentage,
    };
  });

  // Filter students based on date range and percent
  const filterStudentsByDateRange = () => {
    const minPercent = percentFilter ? parseInt(percentFilter, 10) : 0;

    // If no start or end date is selected, show attendance percentages for all records
    if (!startDate && !endDate) {
      const filtered = studentSummaries.filter((student) => student.attendancePercentage >= minPercent);
      setFilteredStudents(filtered);
      setIsPercentageChecked(true); // Set flag to true once percentages are checked
      return;
    }

    // If date range is selected, filter the records
    const filtered = studentSummaries.filter((student) => {
      // Check if attendance percentage meets the min percent requirement
      const meetsPercentFilter = student.attendancePercentage >= minPercent;

      // Check if the attendance dates fall within the specified date range
      const isWithinDateRange = student.attendanceDates.some((attendanceDate) => {
        const date = new Date(attendanceDate);
        return (!startDate || date >= new Date(startDate)) && (!endDate || date <= new Date(endDate));
      });

      // Only include students who meet both the percent filter and date range filter
      return meetsPercentFilter && isWithinDateRange;
    });

    setFilteredStudents(filtered);
    setIsPercentageChecked(true); // Set flag to true once percentages are checked
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Attendance Summary", 14, 20);
    doc.text(`Course Code: ${courseCode}`, 14, 30);

    // Define columns for the table
    const columns = ["Name", "Enrollment", "Total Presents", "Attendance Percentage"];
    const rows = filteredStudents.map((student) => [
      student.studentName,
      student.studentEnrollment,
      student.totalPresents,
      student.attendancePercentage.toFixed(2) + "%",
    ]);

    // Add table
    doc.autoTable({
      startY: 40,
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
          {courseCode}
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

        {/* Button to Check Percentage */}
        <button
          onClick={filterStudentsByDateRange}
          className="mb-4 px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Check Percentage
        </button>

        {/* Button to Generate PDF */}
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
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Attendance Percentage</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-gray-300"
                  >
                    <td className="px-2 sm:px-4 py-2 text-gray-300">{student.studentName}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-300">{student.studentEnrollment}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-300">{student.totalPresents}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-300">
                      {student.attendancePercentage.toFixed(2)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center px-4 py-2 text-gray-500">
                    No students found for the given criteria.
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
