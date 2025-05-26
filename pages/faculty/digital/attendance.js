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
  <div
    className="pt-16 pb-20 px-4 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 flex flex-col items-center overflow-y-auto"
    style={{ WebkitOverflowScrolling: 'touch' }}
  >
    <h1 className="text-3xl font-extrabold text-red-700 mb-6">Bluetooth Attendance Marking</h1>

    {/* Course and Date Info */}
    <div className="bg-white p-5 rounded-xl shadow-lg w-full max-w-2xl mb-6 ring-1 ring-red-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Course Code</label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Class Duration</label>
          <div className="flex space-x-8">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="1"
                checked={classDuration === '1'}
                onChange={(e) => setClassDuration(e.target.value)}
                className="w-6 h-6 text-red-600"
              />
              <span className="text-gray-800 font-medium">1 Hour</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="2"
                checked={classDuration === '2'}
                onChange={(e) => setClassDuration(e.target.value)}
                className="w-6 h-6 text-red-600"
              />
              <span className="text-gray-800 font-medium">2 Hours</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    {/* Enrollment List */}
    <div className="bg-white p-5 rounded-xl shadow-lg w-full max-w-3xl mb-6 ring-1 ring-red-300">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Received Enrollments</h2>
      {receivedEnrolls.length === 0 ? (
        <p className="text-gray-500 text-center">No students added yet.</p>
      ) : (
        <ul className="space-y-3 max-h-72 overflow-y-auto">
          {receivedEnrolls.map((e) => (
            <li
              key={e.enrollmentNumber}
              className="flex justify-between items-center bg-red-50 p-3 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <span className="font-medium text-gray-800">{e.enrollmentNumber} - {e.name}</span>
              <button
                onClick={() => handleDelete(e.enrollmentNumber)}
                className="text-red-700 hover:text-red-500 text-xl font-bold"
                aria-label="Remove enrollment"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Manual Add */}
    <div className="bg-white p-5 rounded-xl shadow-lg w-full max-w-3xl mb-8 ring-1 ring-red-300">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Add Enrollment Manually</h3>
      <div className="flex space-x-4">
        <input
          type="text"
          value={manualEnroll}
          onChange={(e) => setManualEnroll(e.target.value)}
          placeholder="Enter Enrollment Number"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleAddManual}
          className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Add
        </button>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex space-x-6 mb-12">
      <button
        onClick={simulateEmit}
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
      >
        Simulate Bluetooth Emit
      </button>
      <button
        onClick={handleSubmit}
        className="bg-green-700 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
      >
        Submit Attendance
      </button>
    </div>

    {/* Popup Message */}
    {popupMessage && (
      <div
        className={`fixed top-16 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white font-semibold z-50 ${
          popupType === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}
        role="alert"
      >
        {popupMessage}
      </div>
    )}
  </div>
);

}
