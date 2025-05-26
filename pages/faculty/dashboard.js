import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("facultyToken")) {
      setLoading(true);
      const token = localStorage.getItem("facultyToken");

      const fetchData = async () => {
        try {
          const res = await fetch("/api/facultyapis/getfaculty", {
            method: "POST",
            body: JSON.stringify({ token }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();

          if (!data.Success) {
            localStorage.removeItem("facultyToken");
            toast.error(data.ErrorMessage, {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
              transition: Bounce,
            });
            setTimeout(() => {
              router.push("/login/faculty");
            }, 2000);
          } else {
            localStorage.setItem("role", "faculty");
            setUser(data.user);

            const coursesRes = await fetch("/api/facultyapis/getfacultycourses", {
              method: "POST",
              body: JSON.stringify({ _id: data.user._id }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            const coursesData = await coursesRes.json();

            if (coursesData.Success) {
              setCourses(coursesData.courses);
            } else {
              toast.error(coursesData.ErrorMessage, {
                position: "top-center",
                autoClose: 2000,
                theme: "colored",
                transition: Bounce,
              });
            }
          }
        } catch (error) {
          console.error(error);
          toast.error("Something went wrong!", {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
            transition: Bounce,
          });
        }
        setLoading(false);
      };

      fetchData();
    } else {
      router.push("/login/faculty");
    }
  }, [router]);

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-24 px-4 relative">
      <ToastContainer />
      {loading ? (
        <div className="h-[calc(100vh-6rem)] flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-400"></div>
        </div>
      ) : (
        <>
          {/* Profile Card */}
          <div className="bg-white rounded-xl p-5 mb-5 shadow-md border">
            <h1 className="text-3xl text-center font-bold text-red-600 mb-2" style={{ fontFamily: "Courier New, Courier, monospace" }}>
              Faculty
            </h1>
            <h2 className="text-xl text-center font-semibold text-gray-800">{user?.name}</h2>
            <p className="text-center text-gray-600 mt-1">Department: {user?.department}</p>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search course name or code..."
              className="w-full px-4 py-3 text-sm border rounded-md focus:ring-2 focus:ring-red-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Scrollable Cards Section */}
          <div className="h-[calc(100vh-24rem)] overflow-y-auto pr-2 custom-scrollbar">
            {filteredCourses.length === 0 ? (
              <div className="text-center text-gray-600 text-lg">No matching courses found.</div>
            ) : (
              filteredCourses.map((course, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 transition-transform transform hover:scale-[1.02] duration-300"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-1 text-center">
                    {course.courseName} - {course.courseCode}
                  </h3>
                  <p className="text-sm text-center text-gray-500 mb-4 italic">
                    Faculty: {course.courseFaculty}
                  </p>


<div className="grid grid-cols-2 gap-1 justify-items-center">
  <a href={`/faculty/takeAttendence/${course.courseCode}?course=${course.courseName}`}>
    <button className="w-28 text-sm py-2 bg-red-600 text-white rounded-md font-semibold shadow hover:bg-red-700">
      Attendance
    </button>
  </a>
  <a href={`/faculty/updateAttendance/${course.courseCode}?course=${course.courseName}`}>
    <button className="w-28 text-sm py-2 bg-red-600 text-white rounded-md font-semibold shadow hover:bg-red-700">
      Update
    </button>
  </a>
 
</div>

<div className="grid grid-cols-2 gap-1 mt-2 justify-items-center">
  <a href={`/faculty/viewStudents?course=${course.courseCode}&courseName=${encodeURIComponent(course.courseName)}`}>
    <button className="w-28 text-sm py-2 bg-red-600 text-white rounded-md font-semibold shadow hover:bg-red-700">
      Students
    </button>
  </a>
  <a href={`/admin/categoriseStudent?courseCode=${course.courseCode}`}>
    <button className="w-28 text-sm py-2 bg-red-600 text-white rounded-md font-semibold shadow hover:bg-red-700">
      Select Student
    </button>
  </a>
   <a href={`/faculty/showSummary/${course.courseCode}?course=${course.courseName}`}>
    <button className="w-28 text-sm py-2 bg-red-600 text-white rounded-md font-semibold shadow hover:bg-red-700">
      Summary
    </button>
  </a>
</div>




                
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Chatbot Button */}
      <Link href="/faculty/chat/facultychat">
        <div className="fixed bottom-24 right-5 z-50">
          <div className="relative group animate-bounce">
            <div className="absolute inset-0 rounded-full bg-red-600 opacity-70 blur-xl animate-ping"></div>
            <button
              className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white text-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300"
              title="Chatbot"
            >
              🤖
            </button>
            <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Chatbot
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
