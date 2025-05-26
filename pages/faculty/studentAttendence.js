import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

const ShowAttendance = () => {
  const router = useRouter();
  const { enroll, courseCode } = router.query;
  const [attendanceRecords, setAttendanceRecords] = useState([]); // State to store fetched attendance

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!enroll || !courseCode) return; // Prevent fetch if enroll or courseCode is not available

      try {
        const submittedData = { courseCode, enrollmentNumber: enroll };

        const response = await axios.post('/api/studentapis/getMyAttendance', submittedData);

        const data = await response.data;
        if (data.Success) {
          console.log(data.studentAttendance);
          setAttendanceRecords(data.studentAttendance); // Update the attendance records state
        } else {
          console.error(data.ErrorMessage);
        }
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      }
    };

    fetchAttendance();
  }, [enroll, courseCode]); // Run effect when either enroll or courseCode changes

  // Calculate total number of presents
  const totalPresents = attendanceRecords.reduce((total, record) => total + record.totalPresents, 0);

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Attendance Report for Enrollment: ${enroll}`, 14, 20);
    doc.text(`Course: ${courseCode}`, 14, 30);
    doc.text(`Total Attendance Records: ${attendanceRecords.length}`, 14, 40);
    doc.text(`Total Attendance Present: ${totalPresents}`, 14, 50);

    const columns = ["Date", "Class Duration", "Total Presents"];
    const rows = attendanceRecords.map((record) => [
      record.date.split('T')[0], // Trim the date after 'T'
      `${record.classDuration} hours`,
      record.totalPresents,
    ]);

    doc.autoTable({
      startY: 60,
      head: [columns],
      body: rows,
    });

    doc.save(`${enroll}.pdf`);
  };






return (
  <div className="flex flex-col min-h-screen bg-white pt-[72px] pb-[56px] px-4 sm:px-6">
    {/* pt-[72px] and pb-[56px] to offset fixed header (nav) and footer heights */}

    <div className="max-w-4xl w-full mx-auto bg-white p-5 sm:p-6 rounded-lg shadow-lg border border-gray-300 flex flex-col flex-grow overflow-auto">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6 select-none">
        Attendance Report for Enrollment: {enroll}
      </h1>
      <h2 className="text-2xl text-center text-gray-800 mb-4 select-none">
        Course: {courseCode}
      </h2>
      <h3 className="text-xl text-center text-gray-800 mb-6 select-none">
        Total Attendance Records: {attendanceRecords.length}
      </h3>
      <h3 className="text-xl text-center text-gray-800 mb-6 select-none">
        Total Attendance Present: {totalPresents}
      </h3>

      {attendanceRecords.length > 0 ? (
        <div className="overflow-x-auto mb-16">
          <table className="w-full table-auto border-collapse rounded-md overflow-hidden shadow-md">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="px-4 py-2 text-left border border-gray-700" style={{ width: "200px" }}>
                  Date
                </th>
                <th className="px-4 py-2 text-left border border-gray-700">Class Duration</th>
                <th className="px-4 py-2 text-left border border-gray-700">Total Presents</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-100 cursor-default"
                >
                  <td className="px-4 py-2 text-gray-800">{record.date.split('T')[0]}</td>
                  <td className="px-4 py-2 text-gray-800">{record.classDuration} hours</td>
                  <td className="px-4 py-2 text-gray-800">{record.totalPresents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 select-none">No attendance records found.</p>
      )}

      <div className="flex justify-center space-x-4 fixed bottom-[56px] left-0 right-0 bg-white p-4 border-t border-gray-200 z-40">
        <button
          onClick={generatePDF}
          className="px-8 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none shadow"
        >
          Download PDF
        </button>

        <button
          onClick={() => router.back()}
          className="px-8 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none shadow"
        >
          Back to Summary
        </button>
      </div>
    </div>
  </div>
);

};

export default ShowAttendance;
