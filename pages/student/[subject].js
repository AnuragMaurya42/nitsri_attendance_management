import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const subjects = [
    {
        name: 'Mathematics',
        attendance: 85,
        records: [
            { date: '2024-11-20', status: 'Present' },
            { date: '2024-11-20', status: 'Absent' },
            { date: '2024-11-21', status: 'Present' }
        ]
    },
];

export default function Dashboard() {
    const [selectedSubject, setSelectedSubject] = useState(null);

    const groupRecordsByDate = (records) => {
        return records.reduce((acc, record) => {
            const { date, status } = record;
            if (!acc[date]) {
                acc[date] = { count: 0, statuses: [] };
            }
            acc[date].count += 1;
            acc[date].statuses.push(status);
            return acc;
        }, {});
    };

    const downloadPDF = () => {
        if (!selectedSubject) return;

        const doc = new jsPDF();
        const { name, attendance, records } = selectedSubject;

        // Add title
        doc.setFontSize(18);
        doc.text(`Attendance Report: ${name}`, 14, 20);

        // Add overall attendance
        doc.setFontSize(12);
        doc.text(`Overall Attendance: ${attendance}%`, 14, 30);

        // Add attendance records
        const groupedRecords = groupRecordsByDate(records);
        const tableData = [];

        Object.entries(groupedRecords).forEach(([date, data]) => {
            const statuses = data.statuses.join(', ');
            tableData.push([date, data.count, statuses]);
        });

        // Add table
        doc.autoTable({
            startY: 40,
            head: [['Date', 'Total Records', 'Statuses']],
            body: tableData,
        });

        // Save the PDF
        doc.save(`${name}_Attendance_Report.pdf`);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
            <h1 className="text-3xl font-bold mb-6">Attendance Dashboard</h1>


            <button
                                onClick={downloadPDF}
                                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                            >
                                Download PDF
                            </button>


            <div className="w-full max-w-md">
                {selectedSubject ? (
                    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                        <h2 className="text-xl font-semibold mb-2">{selectedSubject.name}</h2>
                        <p className="text-gray-700">Attendance: {selectedSubject.attendance}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                            <div
                                className="bg-blue-500 h-4 rounded-full"
                                style={{ width: `${selectedSubject.attendance}%` }}
                            ></div>
                        </div>
                        <div className="w-full">
                            <h3 className="text-lg font-semibold mb-2">Attendance Records</h3>
                            <ul className="list-disc list-inside text-gray-700">
                                {Object.entries(groupRecordsByDate(selectedSubject.records)).map(([date, data], recIndex) => (
                                    <li key={recIndex} className="mb-2">
                                        <div className="flex justify-between">
                                            <span className="font-bold">{date}</span>
                                            <span>{data.count} {data.count > 1 ? 'Attendances' : 'Attendance'}</span>
                                        </div>
                                        <ul className="ml-4">
                                            {data.statuses.map((status, statusIndex) => (
                                                <li key={statusIndex} className={status === 'Present' ? 'text-green-600' : 'text-red-600'}>
                                                    {status}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => setSelectedSubject(null)}
                                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800"
                            >
                                Back to Subjects
                            </button>
                           
                        </div>
                    </div>
                ) : (
                    subjects.map((subject, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer" onClick={() => setSelectedSubject(subject)}>
                            <h2 className="text-xl font-semibold mb-2">{subject.name}</h2>
                            <p className="text-gray-700">Attendance: {subject.attendance}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                                <div
                                    className="bg-blue-500 h-4 rounded-full"
                                    style={{ width: `${subject.attendance}%` }}
                                ></div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
