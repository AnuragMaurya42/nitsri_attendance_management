import React, { useState,useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify"; 

const subjects = [
  { name: "DBMS", courseCode: "304" },
  { name: "Mathematics", courseCode: "102" },
  { name: "Science", courseCode: "567" },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Added state for user
  const router = useRouter();

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCourse = () => {
    subjects.push({ name: newCourseName, courseCode: newCourseCode });
    setShowModal(false);
    setNewCourseName("");
    setNewCourseCode("");
    toast.success(
      `Course: ${newCourseName}, Course Code: ${newCourseCode} added successfully!`
    );
  };

  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem("adminToken")) {
      let token = localStorage.getItem("adminToken");
      const helper = async () => {
        try {
          const res = await fetch("/api/adminapis/getadmin", {
            method: "POST",
            body: JSON.stringify({ token }), // Wrapped token in an object
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          if (!data.Success) {
            localStorage.removeItem("adminToken");
            toast.error(data.ErrorMessage, {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
            setTimeout(() => {
              router.push("/login/admin");
            }, 2000);
          } else {
            localStorage.setItem('role',"admin");
            setUser(data.user);
          }
        } catch (error) {
          console.error(error);
        }
      };
      helper();
    } else {
      router.push("/login/admin");
    }
    setLoading(false);
  }, [router]);


  return (
    <div className="dark min-h-screen bg-gray-900 text-gray-100">
      <ToastContainer ></ToastContainer>
      {loading ? (
        <div className="relative h-custom flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <div>
      <div className="bg-gray-800 shadow-md rounded-lg p-6 max-w-md w-full mb-6 mx-auto">
        <h1
          className="text-5xl font-bold text-green-500 mb-5"
          style={{
            fontFamily: "Courier New, Courier, monospace",
            color: "rgb(34 197 50)",
          }}
        >
          Admin
        </h1>
        <h2 className="text-2xl font-bold mb-4">Mohammad Chisti</h2>
        <p className="text-gray-400 mb-4">Department: Computer Science</p>
      </div>

      <div className="w-4/5 bg-gray-800 border border-gray-700 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 mb-6 mx-auto p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by subject name or course code"
          className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ color: "black" }}
        />
      </div>

      <div className="w-4/5 mx-auto flex justify-around mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Add Course
        </button>
      </div>

      {filteredSubjects.map((subject, index) => (
        <div
          key={index}
          className="w-4/5 bg-gray-800 border border-gray-700 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 mb-6 mx-auto"
        >
          <div className="flex justify-end px-4 pt-4"></div>
          <div className="flex flex-col items-center pb-10">
            <h5 className="mb-1 text-xl font-medium text-gray-100">
              {subject.name}
            </h5>
            <span className="text-sm text-gray-400">
              Course-Code: {subject.courseCode}
            </span>
            <a href={`/faculty/takeAttendence/${subject.name}`}>
              <button className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                Choose Faculty
              </button>
            </a>
            <button className="mt-4 px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-300">
              Update Course
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder="Course Name"
              className="w-full px-4 py-2 mb-4 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ color: "black" }}
            />
            <input
              type="text"
              value={newCourseCode}
              onChange={(e) => setNewCourseCode(e.target.value)}
              placeholder="Course Code"
              className="w-full px-4 py-2 mb-4 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ color: "black" }}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleAddCourse}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Cancel
              </button>
            </div>
          </div>0
        </div>
      )}
      </div>
      )}
    </div>
  );
}
