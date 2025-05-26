import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [attendancePercentage, setAttendancePercentage] = useState(0);
    const [showModal, setShowModal] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const router = useRouter();
    const { courseCode, course, enroll } = router.query;

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-GB', options);
    };

    const groupRecordsByDate = (records) => {
        return records.reduce((acc, record) => {
            const { date, totalPresents } = record;
            if (!acc[date]) {
                acc[date] = { count: totalPresents || 0 };
            } else {
                acc[date].count += totalPresents || 0;
            }
            return acc;
        }, {});
    };

    const calculateAttendance = (records) => {
        let totalClasses = 0;
        let totalPresents = 0;

        records.forEach(record => {
            totalClasses += parseInt(record.classDuration, 10);
            totalPresents += parseInt(record.totalPresents, 10);
        });

        return Math.round((totalPresents / totalClasses) * 100);
    };

    const downloadPDF = () => {
        if (!selectedSubject) return;
    
        const doc = new jsPDF();
        const { name, records } = selectedSubject;
    
        doc.setFontSize(18);
        doc.text(`Attendance Report: ${name}`, 14, 20);
    
        doc.setFontSize(14);
        doc.text(`Enrollment Number: ${enroll}`, 14, 30);
    
        doc.setFontSize(12);
        doc.text(`Overall Attendance: ${attendancePercentage}%`, 14, 40);
    
        const groupedRecords = groupRecordsByDate(records);
        const tableData = Object.entries(groupedRecords).map(([date, data]) => [formatDate(date), data.count]);
    
        doc.autoTable({
            startY: 50,
            head: [['Date', 'Total Attendance']],
            body: tableData,
        });
    
        const pdfOutput = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfOutput);
    
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${name}_Attendance_Report_${enroll}.pdf`;
        link.click();
    };
    

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!course || !courseCode) return;

            try {
                const response = await fetch('/api/studentapis/getMyAttendance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ courseCode, enrollmentNumber: enroll }),
                });

                const data = await response.json();
                if (data.Success) {
                    const studentAttendance = data.studentAttendance;
                    const calculatedAttendance = calculateAttendance(studentAttendance);

                    setAttendanceRecords(studentAttendance);
                    setAttendancePercentage(calculatedAttendance);
                    setSelectedSubject({
                        name: course,
                        attendance: calculatedAttendance,
                        records: studentAttendance,
                    });
                } else {
                    console.error(data.ErrorMessage);
                }
            } catch (error) {
                console.error('Failed to fetch attendance:', error);
            }
        };

        fetchAttendance();
    }, [course, courseCode, enroll]);

    const pieChartData = {
        labels: ['Present', 'Absent'],
        datasets: [
            {
                data: [attendancePercentage, 100 - attendancePercentage],
                backgroundColor: ['#1b5e20', '#b71c1c'],
                borderColor: ['#0d3a13', '#7f0000'],
                borderWidth: 1,
            },
        ],
    };










    return (
  <div className="min-h-screen bg-white text-gray-900 pt-16 pb-16 overflow-auto max-w-md mx-auto shadow-lg rounded-lg">
    <h1 className="text-3xl text-center font-bold text-red-600 mb-4 mt-4">Attendance Dashboard</h1>

    {enroll && (
      <h2 className="text-lg text-center font-semibold text-gray-800 mb-6">
        Enrollment Number: <span className="text-blue-700">{enroll}</span>
      </h2>
    )}

    {showModal && !showDetails && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-90 z-40 p-4">
        <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-sm mx-auto text-white">
          <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">{course}</h2>
          <p className="text-xl mb-6 text-center">
            Attendance: <span className="text-green-400 font-semibold">{attendancePercentage}%</span>
          </p>

          <div className="mb-6 flex justify-center">
            <Pie data={pieChartData} className="w-48 h-48" />
          </div>

          <button
            onClick={() => {
              setShowModal(false);
              setShowDetails(true);
            }}
            className="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg font-semibold focus:outline-none transition"
          >
            View Detailed Attendance
          </button>
        </div>
      </div>
    )}

    <button
      onClick={downloadPDF}
      className="block w-11/12 max-w-xs mx-auto mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold focus:outline-none transition"
    >
      Download PDF
    </button>

    {showDetails && selectedSubject && (
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mt-8 mx-auto text-gray-900">
        <h2 className="text-2xl font-bold mb-4 text-red-600 text-center">{selectedSubject.name}</h2>
        <p className="mb-4 font-semibold text-center">
          Overall Attendance: <span className="text-red-500">{selectedSubject.attendance}%</span>
        </p>

        <div className="mb-6 flex justify-center">
          <Pie data={pieChartData} className="w-56 h-56" />
        </div>

        <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-1">Detailed Attendance Records</h3>
        <div className="overflow-y-auto max-h-64 rounded-md border border-gray-300">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-gray-700">Total Attendance</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupRecordsByDate(selectedSubject.records)).map(([date, data], index) => (
                <tr
                  key={index}
                  className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="px-4 py-2">{formatDate(date)}</td>
                  <td className="px-4 py-2">{data.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg text-white font-semibold focus:outline-none transition"
          >
            Back
          </button>
        </div>
      </div>
    )}
  </div>
);

}
