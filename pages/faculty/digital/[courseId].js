import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let socket;

function getSocket() {
  if (!socket) {
    socket = io({
      path: '/api/socketio',
    });
  }
  return socket;
}

export default function FacultyBluetoothPage() {
  const router = useRouter();
  const { courseId } = router.query;

  const [students, setStudents] = useState([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [classDuration, setClassDuration] = useState('2');
  const [manualName, setManualName] = useState('');
  const [manualEnrollment, setManualEnrollment] = useState('');

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      console.log('👨‍🏫 Faculty connected to socket');
    });

    socket.on('new-student', (data) => {
      if (data.courseId !== courseId) return;

      setStudents((prev) => {
        if (prev.some(s => s.enrollment === data.enrollment)) return prev;
        setAttendanceStatuses((prevStatuses) => ({
          ...prevStatuses,
          [data.enrollment]: { half1: true, half2: true },
        }));
        return [...prev, data];
      });
    });

    return () => {
      socket.off('connect');
      socket.off('new-student');
    };
  }, [courseId]);

  const handleCheckboxChange = (enrollment, half, checked) => {
    setAttendanceStatuses((prev) => ({
      ...prev,
      [enrollment]: {
        ...prev[enrollment],
        [half]: checked,
      },
    }));
  };

  const handleDeleteStudent = (enrollment) => {
    setStudents((prev) => prev.filter(s => s.enrollment !== enrollment));
    setAttendanceStatuses((prev) => {
      const newStatuses = { ...prev };
      delete newStatuses[enrollment];
      return newStatuses;
    });
    toast.info(`Student ${enrollment} removed.`);
  };

  const handleAddManualStudent = () => {
    if (!manualName || !manualEnrollment) {
      toast.error('Please enter both name and enrollment');
      return;
    }
    if (students.some(s => s.enrollment === manualEnrollment.trim())) {
      toast.error('Enrollment already exists');
      return;
    }
    const newStudent = {
      name: manualName.trim(),
      enrollment: manualEnrollment.trim(),
    };
    setStudents((prev) => [...prev, newStudent]);
    setAttendanceStatuses((prev) => ({
      ...prev,
      [newStudent.enrollment]: { half1: true, half2: true },
    }));
    setManualName('');
    setManualEnrollment('');
    toast.success('Student added manually');
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    const attendancePayload = students.map(student => {
      const status = attendanceStatuses[student.enrollment] || { half1: false, half2: false };
      const presentCount = classDuration === '1'
        ? (status.half1 ? 1 : 0)
        : (status.half1 ? 1 : 0) + (status.half2 ? 1 : 0);
      return {
        enrollmentNumber: student.enrollment,
        name: student.name,
        presentCount,
      };
    });

    const res = await fetch('/api/facultyapis/markAttendance', {
      method: 'POST',
      body: JSON.stringify({
        courseCode: courseId,
        selectedDate,
        attendanceStatuses: attendancePayload,
        classDuration,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (data.Success) toast.success('Attendance marked successfully!');
    else toast.error(data.ErrorMessage || 'Something went wrong!');
  };

  return (
    <div className="min-h-screen pt-20 pb-14 px-4 max-w-md mx-auto bg-white rounded overflow-auto shadow">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-xl font-bold text-center mb-4">Bluetooth Attendance: {courseId}</h1>

      {/* Date and Duration */}
      <div className="mb-4">
        <label className="block text-sm font-semibold">Date</label>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
          className="w-full border rounded p-2 text-sm" />
        <label className="block mt-2 text-sm font-semibold">Class Duration</label>
        <div className="flex gap-4 mt-1">
          <label><input type="radio" value="1" checked={classDuration === '1'} onChange={e => setClassDuration(e.target.value)} /> 1 Hour</label>
          <label><input type="radio" value="2" checked={classDuration === '2'} onChange={e => setClassDuration(e.target.value)} /> 2 Hours</label>
        </div>
      </div>

      {/* Manual Add */}
      <div className="mb-4 p-3 bg-gray-50 border rounded">
        <h2 className="text-sm font-semibold mb-2">Add Student Manually</h2>
        <input placeholder="Name" value={manualName} onChange={e => setManualName(e.target.value)} className="w-full mb-2 border rounded p-2 text-sm" />
        <input placeholder="Enrollment" value={manualEnrollment} onChange={e => setManualEnrollment(e.target.value)} className="w-full mb-2 border rounded p-2 text-sm" />
        <button onClick={handleAddManualStudent} className="w-full bg-blue-600 text-white rounded py-2 text-sm">Add Student</button>
      </div>

      {/* Student Table */}
      <table className="w-full text-xs border-collapse mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-1">Name</th>
            <th className="border p-1">Enroll</th>
            <th className="border p-1">H1</th>
            {classDuration === '2' && <th className="border p-1">H2</th>}
            <th className="border p-1">Delete</th>
          </tr>
        </thead>
        <tbody>
          {students.map(({ name, enrollment }) => (
            <tr key={enrollment}>
              <td className="border p-1">{name}</td>
              <td className="border p-1">{enrollment}</td>
              <td className="border p-1 text-center"><input type="checkbox" checked={attendanceStatuses[enrollment]?.half1 || false} onChange={e => handleCheckboxChange(enrollment, 'half1', e.target.checked)} /></td>
              {classDuration === '2' && (
                <td className="border p-1 text-center"><input type="checkbox" checked={attendanceStatuses[enrollment]?.half2 || false} onChange={e => handleCheckboxChange(enrollment, 'half2', e.target.checked)} /></td>
              )}
              <td className="border p-1 text-red-500 text-center cursor-pointer" onClick={() => handleDeleteStudent(enrollment)}>✖</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-2 rounded text-sm">Submit Attendance</button>
    </div>
  );
}
