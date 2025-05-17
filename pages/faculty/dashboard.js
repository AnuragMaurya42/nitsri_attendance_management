import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("facultyToken")) {
      setLoading(true);
      let token = localStorage.getItem("facultyToken");
      const helper = async () => {
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
            localStorage.setItem('role', "faculty");
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
      helper();
    } else {
      router.push("/login/faculty");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ToastContainer />

      {loading ? (
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-400"></div>
        </div>
      ) : (
        <div>
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full mb-6 mx-auto border border-gray-300">
            <h1
              className="text-5xl font-bold text-red-600 mb-5"
              style={{ fontFamily: "Courier New, Courier, monospace" }}
            >
              Faculty
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{user?.name}</h2>
            <p className="text-gray-600 mb-4">Department: {user?.department}</p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center text-gray-600 text-xl">
              No courses are assigned to you.
            </div>
          ) : (
            courses.map((course, index) => (
              <div
                key={index}
                className="w-4/5 bg-white border border-gray-300 rounded-lg shadow-md mb-6 mx-auto"
              >
                <div className="flex flex-col items-center pb-10">
                  <h5 className="mb-1 text-xl font-medium text-gray-900">
                    {course.courseName}
                  </h5>
                  <span className="text-sm text-gray-600">{course.courseFaculty}</span>
                  <a href={`/faculty/takeAttendence/${course.courseCode}?course=${course.courseName}`} >
                    <button className="mt-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
                      Take Attendance
                    </button>
                  </a>
                  <a href={`/faculty/updateAttendance/${course.courseCode}?course=${course.courseName}`} >
                    <button className="mt-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
                      Update Attendance
                    </button>
                  </a>
                  <a href={`/faculty/showSummary/${course.courseCode}?course=${course.courseName}`} >
                    <button
                      className="mt-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      Show Summary
                    </button>
                  </a>
                  <a href={`/faculty/viewStudents?course=${course.courseCode}&courseName=${encodeURIComponent(course.courseName)}`}>
                    <button
                      className="mt-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      View Students
                    </button>
                  </a>

                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bouncing Chatbot Button in Bottom-Right */}
      <Link href="/faculty/chat/facultychat">
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative group animate-bounce">
            <div className="absolute inset-0 rounded-full bg-red-600 opacity-70 blur-xl animate-ping"></div>
            <button
              className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white text-3xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300"
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
