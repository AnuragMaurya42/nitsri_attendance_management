import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
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

  const toggleExpand = (enrollmentNumber) => {
    setExpandedRows((prev) =>
      prev.includes(enrollmentNumber)
        ? prev.filter((num) => num !== enrollmentNumber)
        : [...prev, enrollmentNumber]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-12 px-3 sm:px-4 flex flex-col items-center">
      <ToastContainer />
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-xl p-4 border border-blue-400 overflow-auto">
        <h1 className="text-lg sm:text-xl font-extrabold text-green-700 mb-6 text-center tracking-wide">
          Students Enrolled in{" "}
          <span className="italic">{courseName || course}</span> ({course})
        </h1>

        {students.length === 0 ? (
          <p className="text-gray-500 text-center text-sm py-16">No students found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
            <table className="min-w-full border border-gray-300 text-xs sm:text-sm">
              <thead className="bg-red-600 text-white rounded-t-lg">
                <tr>
                  <th className="px-2 py-2 border border-blue-500 font-semibold text-left select-none">
                    Enrollment Number
                  </th>
                  <th className="px-2 py-2 border border-blue-500 font-semibold text-left select-none">
                    Actions
                  </th>
                  {expandedRows.length > 0 && (
                    <>
                      <th className="px-2 py-2 border border-blue-500 font-semibold text-left select-none">
                        Name
                      </th>
                      <th className="px-2 py-2 border border-blue-500 font-semibold text-left select-none max-w-[160px]">
                        Email
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const isExpanded = expandedRows.includes(student.enrollmentNumber);
                  return (
                    <tr
                      key={student.enrollmentNumber}
                      className="text-gray-800 hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-2 py-2 border border-blue-300 font-medium">
                        {student.enrollmentNumber}
                      </td>
                      <td className="px-2 py-2 border border-blue-300">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleExpand(student.enrollmentNumber)}
                            className={`px-3 py-1.5 text-[10px] font-semibold rounded-full border transition-all duration-200 focus:outline-none transform ${
                              isExpanded
                                ? "bg-blue-100 border-blue-400 text-blue-700 shadow-sm scale-105"
                                : "border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-sm hover:scale-105"
                            } focus:ring-1 focus:ring-blue-300`}
                            aria-label={`${isExpanded ? "Collapse" : "Expand"} details for ${student.enrollmentNumber}`}
                          >
                            {isExpanded ? "Collapse" : "Expand"}
                          </button>

                          <button
                            onClick={() =>
                              (window.location.href = `/student/${course}?course=${courseName}&enroll=${student.enrollmentNumber}`)
                            }
                            className="px-3 py-1.5 text-[10px] font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-600 rounded-full hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all duration-200 transform focus:outline-none hover:scale-105 focus:ring-1 focus:ring-blue-300"
                            aria-label={`View report of ${student.name}`}
                          >
                            View
                          </button>
                        </div>
                      </td>
                      {isExpanded && (
                        <>
                          <td className="px-2 py-2 border border-blue-300">{student.name}</td>
                          <td className="px-2 py-2 border border-blue-300 max-w-[160px] break-words text-gray-600">
                            {student.email}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudents;
