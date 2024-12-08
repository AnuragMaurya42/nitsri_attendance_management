import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver'; // Import FileSaver.js

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

        doc.setFontSize(12);
        doc.text(`Overall Attendance: ${attendancePercentage}%`, 14, 30);

        const groupedRecords = groupRecordsByDate(records);
        const tableData = Object.entries(groupedRecords).map(([date, data]) => [formatDate(date), data.count]);

        doc.autoTable({
            startY: 40,
            head: [['Date', 'Total Attendance']],
            body: tableData,
        });

        // Save the PDF using FileSaver.js for mobile compatibility
        const pdfBlob = doc.output('blob');
        saveAs(pdfBlob, `${name}_Attendance_Report.pdf`);
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

    return (
        <div className="dark min-h-screen bg-gray-900 text-gray-100">
            <h1 className="text-3xl font-bold text-green-500 mb-6">Attendance Dashboard</h1>

            {showModal && !showDetails && (
                <div className="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-semibold text-gray-100">{course}</h2>
                        <p className="text-lg text-gray-300">Attendance: {attendancePercentage}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                            <div
                                className="bg-blue-500 h-4 rounded-full"
                                style={{ width: `${attendancePercentage}%` }}
                            ></div>
                        </div>
                        <button
                            onClick={() => {
                                setShowModal(false);
                                setShowDetails(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            View Detailed Attendance
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={downloadPDF}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 mt-6 mx-auto block"
            >
                Download PDF
            </button>

            {showDetails && selectedSubject && (
                <div className="w-full max-w-md mt-6 bg-gray-800 shadow-md rounded-lg p-4 mb-4">
                    <h2 className="text-xl font-semibold mb-2 text-gray-100">{selectedSubject.name}</h2>
                    <p className="text-gray-400">Attendance: {selectedSubject.attendance}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div
                            className="bg-blue-500 h-4 rounded-full"
                            style={{ width: `${selectedSubject.attendance}%` }}
                        ></div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 text-gray-100">Detailed Attendance Records</h3>
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border text-left text-gray-100">Date</th>
                                <th className="px-4 py-2 border text-left text-gray-100">Total Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(groupRecordsByDate(selectedSubject.records)).map(([date, data], index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-4 py-2 text-gray-200">{formatDate(date)}</td>
                                    <td className="px-4 py-2 text-gray-200">{data.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={() => router.push('/student/dashboard')}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
                        >
                            Back to Subjects
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
