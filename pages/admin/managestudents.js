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
  <div className="pt-20 pb-24 h-screen overflow-y-auto bg-gray-100">
    <ToastContainer position="top-center" autoClose={5000} theme="colored" transition={Bounce} />

    <div className="px-4">
      <h1 className="text-xl font-bold text-purple-700 mb-4 text-center">Student List</h1>

      <input
        type="text"
        placeholder="Search enrollment no. or email..."
        className="mb-4 w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-gray-600">Loading students...</p>
      ) : filteredStudents.length === 0 ? (
        <p className="text-center text-gray-600">No students found.</p>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student) => {
            const edited = editFields[student._id] || {};
            return (
              <div
                key={student._id}
                className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
              >
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Name:</strong> {student.name}
                  </p>

                  <p className="text-sm">
                    <strong>Enrollment:</strong> {student.enrollmentNumber}
                  </p>

                  <p className="text-sm">
                    <strong>Department:</strong>{" "}
                    <select
                      className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
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

                  <p className="text-sm">
                    <strong>Batch:</strong>{" "}
                    <input
                      type="text"
                      className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={edited.batch ?? student.batch}
                      onChange={(e) =>
                        handleFieldChange(student._id, "batch", e.target.value)
                      }
                    />
                  </p>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleUpdate(student)}
                    className="w-full mr-2 bg-purple-600 text-white text-sm py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => confirmDelete(student)}
                    className="w-full ml-2 bg-red-600 text-white text-sm py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>

    {studentToDelete && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-11/12 max-w-sm shadow-lg">
          <h2 className="text-lg font-semibold mb-3">Confirm Delete</h2>
          <p className="mb-4 text-sm">
            Are you sure you want to delete <strong>{studentToDelete.name}</strong>?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setStudentToDelete(null)}
              className="text-sm px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="text-sm px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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
