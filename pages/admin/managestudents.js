import { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const departments = [
  "Computer Science",
  "Information Technology",
  "Electrical Engineering",
  "Electronics and Communication Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
  "Chemical Engineering",
  "Metallurgy",
];

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editFields, setEditFields] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [studentToDelete, setStudentToDelete] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/facultyapis/getAllStudents");
      const data = await res.json();

      if (data.Success) {
        const sorted = data.students.sort((a, b) =>
          a.enrollmentNumber.localeCompare(b.enrollmentNumber)
        );
        setStudents(sorted);
      } else {
        toast.error(data.ErrorMessage || "Failed to fetch students.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch {
      toast.error("An error occurred while fetching students.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const confirmDelete = (student) => {
    setStudentToDelete(student);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      const res = await fetch("/api/adminapis/deleteStudent", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: studentToDelete.email }),
      });
      const data = await res.json();

      if (data.Success) {
        toast.success(data.message, { autoClose: 1500 });
        setStudents(students.filter((s) => s.email !== studentToDelete.email));
      } else {
        toast.error(data.ErrorMessage || "Failed to delete student.", {
          autoClose: 1500,
        });
      }
    } catch {
      toast.error("Error deleting student.", { autoClose: 1500 });
    } finally {
      setStudentToDelete(null);
    }
  };

  const handleFieldChange = (studentId, field, value) => {
    setEditFields((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (student) => {
    const updated = editFields[student._id] || {};
    const { department, batch } = updated;

    if (
      (!department || department === student.department) &&
      (!batch || batch === student.batch)
    ) {
      toast.info("No changes detected.", { autoClose: 1500 });
      return;
    }

    try {
      const body = { email: student.email };

      if (department && department !== student.department) body.department = department;
      if (batch && batch !== student.batch) body.batch = batch;

      const res = await fetch("/api/adminapis/updateStudent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.Success) {
        toast.success(data.message, { autoClose: 1500 });

        setStudents((prev) =>
          prev.map((s) =>
            s.email === student.email
              ? {
                  ...s,
                  department: body.department ?? s.department,
                  batch: body.batch ?? s.batch,
                }
              : s
          )
        );

        setEditFields((prev) => ({ ...prev, [student._id]: {} }));
      } else {
        toast.error(data.ErrorMessage || "Failed to update student.", {
          autoClose: 1500,
        });
      }
    } catch {
      toast.error("Error updating student.", { autoClose: 1500 });
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
   <ToastContainer position="top-center" autoClose={5000} theme="colored" transition={Bounce} />
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Student List</h1>

      <input
        type="text"
        placeholder="Search by enrollment number or email..."
        className="mb-6 w-full max-w-lg px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-gray-600">Loading students...</p>
      ) : filteredStudents.length === 0 ? (
        <p className="text-center text-gray-600">No students found.</p>
      ) : (
        <div className="space-y-6 max-w-5xl mx-auto">
          {filteredStudents.map((student) => {
            const edited = editFields[student._id] || {};
            return (
              <div
                key={student._id}
                className="bg-white shadow rounded-lg p-5 border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="mb-4 sm:mb-0 space-y-1 w-full sm:w-auto sm:flex-1">
                  <p>
                    <strong>Name:</strong> {student.name}
                  </p>

                  <p>
                    <strong>Enrollment No:</strong> {student.enrollmentNumber}
                  </p>

                  <p>
                    <strong>Department:</strong>{" "}
                    <select
                      className="border border-gray-300 rounded px-2 py-1 w-60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      value={edited.department ?? student.department}
                      onChange={(e) =>
                        handleFieldChange(student._id, "department", e.target.value)
                      }
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </p>

                  <p>
                    <strong>Batch:</strong>{" "}
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      value={edited.batch ?? student.batch}
                      onChange={(e) =>
                        handleFieldChange(student._id, "batch", e.target.value)
                      }
                    />
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpdate(student)}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => confirmDelete(student)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {studentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete student <strong>{studentToDelete.name}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
