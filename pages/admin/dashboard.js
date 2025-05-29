import React, { useState, useEffect } from "react";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Bounce } from "react-toastify";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null); // To store the course to be deleted

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await fetch("/api/adminapis/getadmin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: localStorage.getItem("adminToken") }),
        });

        const data = await res.json();
        if (data.Success) {
          localStorage.setItem('role', "admin");
          setUser(data.user);
        } else {
          toast.error(data.ErrorMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
      setLoading(false);
    };

    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/adminapis/getCourses");
        const data = await res.json();
        if (data.Success) {
          setCourses(data.courses);
        } else {
          toast.error(data.ErrorMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
      setLoading(false);
    };
    if (localStorage.getItem("adminToken")) {
      setLoading(true);
      fetchAdminInfo();
      fetchCourses();
    }
    else {
      router.push("/login/admin");
    }
  }, []);

  // Function to add a new course
  const handleAddCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/adminapis/addCourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseName: newCourseName, courseCode: newCourseCode }),
      });

      const data = await res.json();

      if (data.Success) {
        setLoading(false);
        setCourses((prevCourses) => [...prevCourses, data.course]); // Add new course to state
        setShowAddCourseModal(false);
        setNewCourseName("");
        setNewCourseCode("");
        toast.success("Course added successfully!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        setLoading(false);
        toast.error(data.ErrorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error adding course:", error);
      toast.error("Failed to add course. Try again later.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  // Function to delete course
  const handleDeleteCourse = async () => {
    if (!selectedCourseCode) return;

    try {
      setLoading(true);
      const res = await fetch("/api/adminapis/deleteCourse", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseCode: selectedCourseCode }),
      });

      const data = await res.json();

      if (data.Success) {
        setCourses(courses.filter(course => course.courseCode !== selectedCourseCode)); // Remove deleted course from state
        setShowDeleteCourseModal(false);
        toast.success(data.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error(data.ErrorMessage, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course. Try again later.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  // Filter courses based on the search query
  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );






return (
  <div
    className="min-h-screen bg-white text-gray-900 flex flex-col items-center pt-16 pb-16 px-4"
    style={{ paddingTop: "34px", paddingBottom: "64px" }} // space for fixed Navbar and Footer
  >
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
    />

    {loading ? (
      <div className="flex-grow flex justify-center items-center w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    ) : (
      <>
        {/* Header */}
        <div className="bg-green-100 rounded-xl shadow-md p-6 w-full max-w-md mb-4 text-center">
          <h1
            className="text-4xl font-extrabold text-green-600 mb-2"
            style={{ fontFamily: "Courier New, Courier, monospace" }}
          >
            Admin
          </h1>
          {user ? (
            <>
              <h2 className="text-2xl font-semibold">{user.adminName}</h2>
              <p className="text-gray-700">Department: {user.department}</p>
              <p className="text-gray-700">Email: {user.email}</p>
            </>
          ) : (
            <p className="text-gray-500">Loading admin info...</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-4 w-full max-w-md justify-center">
          <button
            onClick={() => setShowAddCourseModal(true)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Add New Course
          </button>

          <Link
            href={`/admin/manageUsers/${user?.department}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Manage Users
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-full max-w-md mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course name or course code"
            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Courses List - Scrollable */}
        <div
          className="w-full max-w-md bg-white border border-gray-300 rounded-xl shadow-md overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px - 64px - 300px)" }} 
          // 100vh minus navbar(64px) minus footer(64px) minus approx height of above content (~300px)
          // Adjust this 300px if you add more content above courses list
        >
          {filteredCourses.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No courses found.</p>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                className="p-4 border-b last:border-b-0 border-gray-200 flex flex-col space-y-2"
              >
                <h3 className="text-lg font-semibold text-green-600">
                  {course.courseName}
                </h3>
                <p className="text-red-500">Code: {course.courseCode}</p>
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/update/${course._id}/${user?.department}`}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  >
                    Update Course
                  </Link>

                  <button
                    onClick={() => {
                      setSelectedCourseCode(course.courseCode);
                      setShowDeleteCourseModal(true);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Course Modal */}
        {showAddCourseModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
            onClick={() => setShowAddCourseModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Add Course
              </h2>
              <input
                type="text"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="Course Name"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
              />
              <input
                type="text"
                value={newCourseCode}
                onChange={(e) => setNewCourseCode(e.target.value)}
                placeholder="Course Code"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleAddCourse}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteCourseModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
            onClick={() => setShowDeleteCourseModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Do you really want to delete the course and its associated data?
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleDeleteCourse}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {loading ? "Deleting..." : "OK"}
                </button>
                <button
                  onClick={() => setShowDeleteCourseModal(false)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )}
  </div>
);


}
