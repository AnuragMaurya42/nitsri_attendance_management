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
        <div className="min-h-screen bg-white text-gray-100">
            <h1 className="text-3xl text-center font-bold text-red-600 mb-2">Attendance Dashboard</h1>
            {enroll && (
                <h2 className="text-xl text-center font-semibold text-gray-800 mb-4">
                    Enrollment Number: <span className="text-blue-700">{enroll}</span>
                </h2>
            )}
            {showModal && !showDetails && (
                <div className="modal fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-80">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 max-w-lg">
                        <h2 className="text-2xl font-bold text-red mb-4">{course}</h2>
                        <p className="text-xl mb-4">Attendance: <span className="text-green-400">{attendancePercentage}%</span></p>

                        <div className="mb-6">
                            <Pie data={pieChartData} />
                        </div>

                        <button
                            onClick={() => {
                                setShowModal(false);
                                setShowDetails(true);
                            }}
                            className="px-4 py-2 bg-teal-600 text-gray-100 rounded-lg hover:bg-teal-700"
                        >
                            View Detailed Attendance
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={downloadPDF}
                className="px-4 py-2 bg-blue-600 text-gray-100 rounded-lg hover:bg-blue-700 focus:outline-none mt-6 mx-auto block"
            >
                Download PDF
            </button>

            {showDetails && selectedSubject && (
                <div className="w-full max-w-2xl text-black mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-red">{selectedSubject.name}</h2>
                    <p className="mb-4 font-semibold">Overall Attendance: <span className="text-red-400 font-semibold">{selectedSubject.attendance}%</span></p>

                    <div
                        className="mb-5"
                        style={{ width: '250px', height: '250px', margin: '0 auto', position: 'relative' }}
                    >
                        <Pie data={pieChartData} />
                    </div>


                    <h3 className="text-lg font-semibold mb-2">Detailed Attendance Records</h3>
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b border-gray-700 text-left">Date</th>
                                <th className="px-4 py-2 border-b border-gray-700 text-left">Total Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(groupRecordsByDate(selectedSubject.records)).map(([date, data], index) => (
                                <tr key={index} className="border-b border-gray-700">
                                    <td className="px-4 py-2">{formatDate(date)}</td>
                                    <td className="px-4 py-2">{data.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-teal-600 text-gray-100 rounded-lg hover:bg-teal-700"
                        >
                            Back
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
