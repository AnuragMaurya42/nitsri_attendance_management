import React, { useState } from "react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Sample data for students
const studentsData = [
  { index: 1, name: "John Doe", enrollment: "2021BCSE001", percent: 85, date: "2024-11-01" },
  { index: 2, name: "Jane Smith", enrollment: "2021BCSE002", percent: 90, date: "2024-11-02" },
  { index: 3, name: "Emily Brown", enrollment: "2021BCSE003", percent: 75, date: "2024-11-03" },
  { index: 4, name: "Michael Johnson", enrollment: "2021BCSE004", percent: 92, date: "2024-11-01" },
  { index: 5, name: "David Wilson", enrollment: "2021BCSE005", percent: 78, date: "2024-11-02" },
  { index: 2, name: "Jane Smith", enrollment: "2021BCSE002", percent: 90, date: "2024-11-02" },
  { index: 3, name: "Emily Brown", enrollment: "2021BCSE003", percent: 75, date: "2024-11-03" },
  { index: 4, name: "Michael Johnson", enrollment: "2021BCSE004", percent: 92, date: "2024-11-01" },
  { index: 5, name: "David Wilson", enrollment: "2021BCSE005", percent: 78, date: "2024-11-02" },
  { index: 2, name: "Jane Smith", enrollment: "2021BCSE002", percent: 90, date: "2024-11-02" },
  { index: 3, name: "Emily Brown", enrollment: "2021BCSE003", percent: 75, date: "2024-11-03" },
  { index: 4, name: "Michael Johnson", enrollment: "2021BCSE004", percent: 92, date: "2024-11-01" },
  { index: 5, name: "David Wilson", enrollment: "2021BCSE005", percent: 78, date: "2024-11-02" },
];

function AttendanceSummaryPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [percentFilter, setPercentFilter] = useState("");

  const router = useRouter();
  const { subject } = router.query;

  // Filter students based on date range and percent
  const filteredStudents = studentsData.filter((student) => {
    const studentDate = new Date(student.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const withinDateRange = (!start || studentDate >= start) && (!end || studentDate <= end);
    const withinPercentRange = percentFilter ? student.percent >= parseInt(percentFilter) : true;

    return withinDateRange || withinPercentRange;
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
    const columns = [
      { header: "Index", dataKey: "index" },
      { header: "Name", dataKey: "name" },
      { header: "Enrollment", dataKey: "enrollment" },
      { header: "Percent", dataKey: "percent" },
    ];

    // Add table
    doc.autoTable({
      startY: subject ? 40 : 30,
      head: [columns.map((col) => col.header)],
      body: filteredStudents.map((student) => [
        student.index,
        student.name,
        student.enrollment,
        `${student.percent}%`,
      ]),
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
          className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700   focus:outline-none"
        >
          Download PDF
        </button>
      
        {/* Table */}
        <div className="overflow-x-auto mb-4 sm:mb-6">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-400">
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Index</th>
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Enrollment</th>
                <th className="px-2 sm:px-4 py-2 text-left border border-gray-700">Percent</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.index} className="border-b border-gray-700">
                    <td className="px-2 sm:px-4 py-2 text-gray-300">{student.index}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-300">{student.name}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-300">{student.enrollment}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-300">{student.percent}%</td>
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

        {/* Download PDF Button */}

      </div>
    </div>
  );
}

export default AttendanceSummaryPage;
