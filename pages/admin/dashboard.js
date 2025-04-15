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
    if(localStorage.getItem("adminToken"))
    {
     setLoading(true);
    fetchAdminInfo();
    fetchCourses();
    }
    else
    {
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
    <div className=" min-h-screen bg-white-900 text-gray-100">
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
        <div className="relative min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full mb-6 mx-auto">
            <h1 className="text-5xl font-bold text-green-500 mb-5">Admin</h1>
            {user ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-black">{user.adminName}</h2>
                <p className="text-black mb-4">Department: {user.department}</p>
                <p className="text-black mb-4">Email: {user.email}</p>
              </>
            ) : (
              <p className="text-gray-400 mb-4">Loading admin info...</p>
            )}
          </div>

          <div className="w-4/5 bg-gray-800 border border-gray-700 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 mb-6 mx-auto p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course name or course code"
              className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ color: "black" }}
            />
          </div>

          {/* Add Course Button */}
          <div className="flex justify-center items-center mb-4">
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="w-40 p-2 bg-green-500 text-white rounded-md"
            >
              Add New Course
            </button>
          </div>


          {/* Add Course Modal */}
          {showAddCourseModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              onClick={() => setShowAddCourseModal(false)}
            >
              <div
                className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">Add Course</h2>
                <div className="mb-4">
                  <input
                    type="text"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="Course Name"
                    className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="Course Code"
                    className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleAddCourse}
                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowAddCourseModal(false)}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Courses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white p-4 border border-gray-700 rounded-lg shadow-md dark:bg-white dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold text-green-500">{course.courseName}</h3>
                <p className="text-red-400">Code: {course.courseCode}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {/* Your code for update course */ }}
                    className="w-40 m-1 px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  >
                    <Link href={`/admin/update/${course._id}/${user?.department}`}>
                      Update Course
                    </Link>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCourseCode(course.courseCode);
                      setShowDeleteCourseModal(true);
                    }}
                    className="w-40 m-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            ))}
          </div>


          {/* Confirmation Modal for Deletion */}
          {showDeleteCourseModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              onClick={() => setShowDeleteCourseModal(false)}
            >
              <div
                className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl mt-4 font-bold mb-4">
                  Do you really want to delete the course and its associated data?
                </h2>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleDeleteCourse}
                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    {loading ? 'Deleting...' : 'OK'}
                  </button>
                  <button
                    onClick={() => setShowDeleteCourseModal(false)}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
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
