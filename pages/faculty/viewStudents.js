import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast, Bounce } from "react-toastify";
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4 sm:px-6 flex flex-col items-center">
      <ToastContainer />
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl p-8 border border-red-600 overflow-auto">
        <h1 className="text-2xl font-extrabold text-red-700 mb-8 text-center tracking-wide">
          Students Enrolled in <span className="italic">{courseName || course}</span> ({course})
        </h1>

        {students.length === 0 ? (
          <p className="text-gray-500 text-center text-lg py-20">No students found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-red-100">
            <table className="min-w-full border border-gray-300 text-sm rounded-lg">
              <thead className="bg-red-600 text-white rounded-t-lg">
                <tr>
                  <th className="px-4 py-3 border border-red-500 font-semibold text-left select-none">
                    Enrollment Number
                  </th>
                  <th className="px-4 py-3 border border-red-500 font-semibold text-left select-none">
                    Actions
                  </th>
                  {expandedRows.length > 0 && (
                    <>
                      <th className="px-4 py-3 border border-red-500 font-semibold text-left select-none">
                        Name
                      </th>
                      <th className="px-4 py-3 border border-red-500 font-semibold text-left select-none max-w-[180px]">
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
                      className="text-gray-800 hover:bg-red-50 transition-colors"
                    >
                      <td className="px-4 py-3 border border-red-300 font-medium">{student.enrollmentNumber}</td>
<td className="px-4 py-3 border border-red-300 space-x-3">
  <button
    onClick={() => toggleExpand(student.enrollmentNumber)}
    className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 focus:outline-none transform ${
      isExpanded
        ? "bg-red-100 border-red-400 text-red-700 shadow-lg scale-105"
        : "border-red-600 text-red-600 hover:bg-red-50 hover:shadow-md hover:scale-105"
    } focus:ring-2 focus:ring-red-300`}
    aria-label={`${isExpanded ? "Collapse" : "Expand"} details for ${student.enrollmentNumber}`}
  >
    {isExpanded ? "Collapse" : "Expand"}
  </button>

  <button
    onClick={() =>
      (window.location.href = `/student/${course}?course=${courseName}&enroll=${student.enrollmentNumber}`)
    }
    className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 border border-red-600 rounded-full hover:from-red-600 hover:to-red-700 shadow-md transition-all duration-200 transform focus:outline-none hover:scale-105 focus:ring-2 focus:ring-red-300"
    aria-label={`View report of ${student.name}`}
  >
    View
  </button>
</td>


                      {isExpanded && (
                        <>
                          <td className="px-4 py-3 border border-red-300">{student.name}</td>
                          <td className="px-4 py-3 border border-red-300 max-w-[180px] break-words text-gray-600">
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
