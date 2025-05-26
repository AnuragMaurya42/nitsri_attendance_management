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
  <div className="flex flex-col items-center bg-white pt-16 pb-20 min-h-screen"> 
    {/* pt-16 and pb-20 to offset fixed header/footer height */}
    <ToastContainer position="top-center" autoClose={5000} theme="colored" transition={Bounce} />
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border border-red-600
                    overflow-y-auto flex flex-col"
         style={{ maxHeight: 'calc(100vh - 6rem)' }}  /* max height minus header(4rem)+footer(4rem), approx */
    >
      <h2 className="text-2xl font-extrabold text-center text-red-600 mb-6">
        Attendance Summary for {course}
      </h2>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-red-600 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-gray-50 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-red-600 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-gray-50 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-red-600 mb-1">Min Percentage</label>
          <input
            type="number"
            value={minPercentage}
            onChange={(e) => setMinPercentage(e.target.value)}
            min="0"
            max="100"
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-gray-50 text-gray-900"
            placeholder="0 to 100"
          />
        </div>
      </div>

      {/* Buttons */}
     <div className="flex space-x-3 mb-4">
  <button
    onClick={handleFilter}
    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none shadow-md text-sm"
  >
    Check Attendance
  </button>
  <button
    onClick={handleDownloadPDF}
    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none shadow-md text-sm"
  >
    Download PDF
  </button>
</div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-inner bg-gray-50">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-red-600 text-white rounded-t-lg">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Enrollment</th>
              <th className="px-3 py-2">Total Presents</th>
              <th className="px-3 py-2">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((student, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 bg-white hover:bg-red-50 cursor-pointer"
                >
                  <td className="px-3 py-2">{student.studentName}</td>
                  <td className="px-3 py-2">{student.studentEnrollment}</td>
                  <td className="px-3 py-2">{student.totalPresents}</td>
                  <td className="px-3 py-2">{student.percentage}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
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
