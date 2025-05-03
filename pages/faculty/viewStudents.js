import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const router = useRouter();
  const { course, courseName } = router.query;

  useEffect(() => {
    const fetchStudents = async () => {
      if (!course) return;

      try {
        const res = await fetch(`/api/facultyapis/getStudentForCourse?courseCode=${course}`);
        const data = await res.json();

        if (data.Success) {
          setStudents(data.students);
        } else {
          toast.error(data.ErrorMessage || "Failed to fetch students.", {
            position: "top-center",
            autoClose: 3000,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        toast.error("Error fetching students.", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        console.error(error);
      }
    };

    fetchStudents();
  }, [course]);

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-10">
      <ToastContainer />
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-red-600">
        <h1 className="text-2xl font-semibold text-red-600 mb-6 text-center">
          Students Enrolled in {courseName || course} ({course})
        </h1>

        {students.length === 0 ? (
          <p className="text-gray-500 text-center">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Enrollment Number</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Email</th>
                  <th className="px-4 py-2 border border-gray-300 text-left">Report</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="text-gray-700 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 border border-gray-300">{student.name}</td>
                    <td className="px-4 py-2 border border-gray-300">{student.enrollmentNumber}</td>
                    <td className="px-4 py-2 border border-gray-300">{student.email}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      <button
                        onClick={() =>
                          (window.location.href = `/student/${course}?course=${courseName}&enroll=${student.enrollmentNumber}`)
                        }
                        className="px-3 py-1 text-sm text-white bg-red-600 border border-red-500 rounded-lg hover:bg-red-700"
                      >
                        View 
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudents;
