'use client';
import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

export default function FacultyBluetoothAttendance() {
  const [courseCode, setCourseCode] = useState('CSL-1345');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [classDuration, setClassDuration] = useState('1');
  const [receivedEnrolls, setReceivedEnrolls] = useState([]);
  const [manualEnroll, setManualEnroll] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');

  const receiveEnrollment = (enroll) => {
    if (!receivedEnrolls.find((e) => e.enrollmentNumber === enroll)) {
      setReceivedEnrolls([
        ...receivedEnrolls,
        { enrollmentNumber: enroll, name: `Student ${enroll}`, presentCount: classDuration === '2' ? 2 : 1 },
      ]);
    }
  };

  const simulateEmit = () => {
    const rand = Math.floor(Math.random() * 100) + 1;
    receiveEnrollment(`2021BCSE0${rand.toString().padStart(2, '0')}`);
  };

  const handleAddManual = () => {
    if (manualEnroll && !receivedEnrolls.find((e) => e.enrollmentNumber === manualEnroll)) {
      receiveEnrollment(manualEnroll);
      setManualEnroll('');
    }
  };

  const handleDelete = (enroll) => {
    setReceivedEnrolls(receivedEnrolls.filter((e) => e.enrollmentNumber !== enroll));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        courseCode,
        selectedDate,
        classDuration,
        attendanceStatuses: receivedEnrolls,
      };
      const res = await axios.post('/api/facultyapis/markAttendance', payload);
      setPopupMessage(res.data.Message || 'Attendance marked successfully!');
      setPopupType('success');
    } catch (err) {
      console.error(err);
      setPopupMessage('Error marking attendance');
      setPopupType('error');
    }
    setTimeout(() => setPopupMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-8 px-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Bluetooth Attendance Marking</h1>

      {/* Course and Date Info */}
      <div className="bg-red-100 p-4 rounded-lg shadow-md w-full max-w-2xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Course Code</label>
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-black mb-1">Class Duration</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="1"
                  checked={classDuration === '1'}
                  onChange={(e) => setClassDuration(e.target.value)}
                  className="w-5 h-5 text-red-500"
                />
                <span>1 Hour</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="2"
                  checked={classDuration === '2'}
                  onChange={(e) => setClassDuration(e.target.value)}
                  className="w-5 h-5 text-red-500"
                />
                <span>2 Hours</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment List */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl mb-6">
        <h2 className="text-xl font-semibold mb-3">Received Enrollments</h2>
        {receivedEnrolls.length === 0 ? (
          <p className="text-gray-500">No students added yet.</p>
        ) : (
          <ul className="space-y-2">
            {receivedEnrolls.map((e) => (
              <li key={e.enrollmentNumber} className="flex justify-between items-center bg-red-100 p-2 rounded-lg">
                <span>{e.enrollmentNumber} - {e.name}</span>
                <button
                  onClick={() => handleDelete(e.enrollmentNumber)}
                  className="text-white bg-red-600 px-2 py-1 rounded hover:bg-red-500"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Manual Add */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Enrollment Manually</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={manualEnroll}
            onChange={(e) => setManualEnroll(e.target.value)}
            placeholder="Enter Enrollment Number"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleAddManual}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={simulateEmit}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Simulate Bluetooth Emit
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit Attendance
        </button>
      </div>

      {/* Popup Message */}
      {popupMessage && (
        <div className={`fixed top-0 left-0 right-0 py-3 text-center text-white font-semibold ${popupType === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {popupMessage}
        </div>
      )}
    </div>
  );
}
