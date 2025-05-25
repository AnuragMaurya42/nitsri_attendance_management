import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageFaculties() {
  const router = useRouter();
  const { dept } = router.query;

  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDept, setEditDept] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electrical Engineering",
    "Electronics and communication engineering",
    "Civil engineering",
    "Mechanical engineering",
    "Chemical engineering",
    "Metallurgy",
  ];

  useEffect(() => {
    if (!dept) return;

    const fetchFacultyList = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/adminapis/getFacultyByDept?dept=${dept}`);
        const data = await res.json();

        if (data.Success) {
          setFaculties(data.faculties);
        } else {
          toast.error(data.ErrorMessage, {
            position: "top-center",
            autoClose: 1500,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch {
        toast.error("Failed to fetch faculties.", { autoClose: 1500 });
      }
      setLoading(false);
    };

    fetchFacultyList();
  }, [dept]);

  const requestDelete = (faculty) => {
    setFacultyToDelete(faculty);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!facultyToDelete) return;

    try {
      const res = await fetch("/api/adminapis/deleteFaculty", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: facultyToDelete.email }),
      });
      const data = await res.json();

      if (data.Success) {
        toast.success(data.message, { autoClose: 1500 });
        setFaculties((prev) =>
          prev.filter((f) => f.email !== facultyToDelete.email)
        );
      } else {
        toast.error(data.ErrorMessage || "Failed to delete faculty.", {
          autoClose: 1500,
        });
      }
    } catch {
      toast.error("Error deleting faculty.", { autoClose: 1500 });
    }
    setConfirmOpen(false);
    setFacultyToDelete(null);
  };

  const handleDeleteCancelled = () => {
    setConfirmOpen(false);
    setFacultyToDelete(null);
  };

  const handleDeptChange = (facultyId, value) => {
    setEditDept((prev) => ({ ...prev, [facultyId]: value }));
  };

  const handleUpdate = async (faculty) => {
    const newDept = editDept[faculty._id];
    if (!newDept || newDept.trim() === "") {
      toast.error("Department cannot be empty.", { autoClose: 1500 });
      return;
    }
    if (newDept === faculty.department) {
      toast.info("Department is unchanged.", { autoClose: 1500 });
      return;
    }

    try {
      const res = await fetch("/api/adminapis/updateFaculty", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: faculty.email, department: newDept.trim() }),
      });
      const data = await res.json();

      if (data.Success) {
        toast.success(data.message, { autoClose: 1500 });
        setFaculties((prev) =>
          prev.map((f) =>
            f.email === faculty.email ? { ...f, department: newDept.trim() } : f
          )
        );
        setEditDept((prev) => ({ ...prev, [faculty._id]: "" }));
      } else {
        toast.error(data.ErrorMessage || "Failed to update department.", {
          autoClose: 1500,
        });
      }
    } catch {
      toast.error("Error updating department.", { autoClose: 1500 });
    }
  };

  const filteredFaculties = faculties.filter((f) =>
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
    <ToastContainer position="top-center" autoClose={5000} theme="colored" transition={Bounce} />
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Manage Faculties {dept ? `for ${dept}` : ""}
      </h1>

      <input
        type="text"
        placeholder="Search by email..."
        className="mb-6 w-full max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-gray-600">Loading faculties...</p>
      ) : filteredFaculties.length === 0 ? (
        <p className="text-center text-gray-600">No faculties found.</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredFaculties.map((faculty) => (
            <div
              key={faculty._id}
              className="bg-white shadow rounded-lg p-5 border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="mb-4 sm:mb-0">
                <p>
                  <strong>Name:</strong> {faculty.name}
                </p>
                <p>
                  <strong>Email:</strong> {faculty.email}
                </p>
                <p>
                  <strong>Department:</strong>{" "}
                  <select
                    className="border border-gray-300 rounded px-2 py-1 w-60 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={
                      editDept[faculty._id] !== undefined
                        ? editDept[faculty._id]
                        : faculty.department
                    }
                    onChange={(e) =>
                      handleDeptChange(faculty._id, e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleUpdate(faculty)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Update Dept
                </button>

                <button
                  onClick={() => requestDelete(faculty)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <strong>{facultyToDelete?.name}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancelled}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
