import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { useRouter } from "next/router";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoriseStudent = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { courseCode } = router.query;

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/facultyapis/getAllStudents`);
        const data = await res.json();
        if (data.Success) {
          const sorted = data.students.sort((a, b) =>
            a.enrollmentNumber.localeCompare(b.enrollmentNumber)
          );
          setStudents(sorted);
        } else {
          toast.error("Failed to fetch students.", {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        toast.error("An error occurred while fetching students.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          transition: Bounce,
        });
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const fetchStudentsForCourse = async () => {
    try {
      const res = await fetch(`/api/facultyapis/getStudentForCourse?courseCode=${courseCode}`);
      const data = await res.json();
      if (data.Success) {
        const alreadySelected = data.students.reduce((acc, student) => {
          acc[student.enrollmentNumber] = true;
          return acc;
        }, {});
        setSelectedStudents(alreadySelected);
      } else {
        toast.error("Failed to load students already in course", {
          position: "top-center",
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("Error fetching enrolled students", {
        position: "top-center",
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleSelectToggle = async () => {
    if (!selectMode) {
      await fetchStudentsForCourse();
    } else {
      setSelectedStudents({});
    }
    setSelectMode((prev) => !prev);
  };

  const toggleStudentSelection = (enrollmentNumber) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [enrollmentNumber]: !prev[enrollmentNumber],
    }));
  };

  const handleConfirm = async () => {
    setLoading(true);
    const selected = students.filter((student) => selectedStudents[student.enrollmentNumber]);

    const payload = {
      courseCode: courseCode,
      selectedStudents: selected,
    };

    try {
      const res = await fetch("/api/facultyapis/addStudentsToCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.Success) {
        toast.success("Students successfully added to the course.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error("Failed to add students: " + result.ErrorMessage, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });
    }

    setSelectMode(false);
    setSelectedStudents({});
    setLoading(false);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-10 px-4">
      <ToastContainer position="top-center" autoClose={5000} theme="colored" transition={Bounce} />
      <h1 className="text-3xl font-bold mb-6 text-red-600">Manage Students</h1>

      <div className="mb-6 w-full max-w-4xl flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Search by name or enrollment number"
          className="w-full sm:w-2/3 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className={`${
            selectMode ? "bg-gray-500 hover:bg-gray-400" : "bg-green-600 hover:bg-green-500"
          } text-white font-semibold px-4 py-3 rounded-lg w-full sm:w-auto`}
          onClick={handleSelectToggle}
        >
          {selectMode ? "Cancel Selection" : "Choose Students"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {filteredStudents.map((student) => (
          <div
            key={student.enrollmentNumber}
            className="relative bg-red-100 p-4 rounded-lg shadow-md hover:bg-red-200 transition-all duration-200"
          >
            {selectMode && (
              <input
                type="checkbox"
                className="absolute top-16 right-2 w-5 h-5 text-red-600"
                checked={!!selectedStudents[student.enrollmentNumber]}
                onChange={() => toggleStudentSelection(student.enrollmentNumber)}
              />
            )}
            <div className="flex flex-col items-start justify-center space-y-2">
              <p className="text-xl font-semibold text-red-700">{student.name}</p>
              <p className="text-sm text-gray-700">Enroll: {student.enrollmentNumber}</p>
              <p className="text-sm text-gray-600">Email: {student.email}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <p className="mt-8 text-red-600 font-semibold">No students found.</p>
      )}

      {selectMode && filteredStudents.length > 0 && (
        <button
          className="mt-10 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold"
          onClick={handleConfirm}
        >
          Confirm Selection
        </button>
      )}

      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
        </div>
      )}
    </div>
  );
};

export default CategoriseStudent;
