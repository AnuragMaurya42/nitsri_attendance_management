import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("studentToken");

    if (!token) {
      router.push("/login/student");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/studentapis/getStudent", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!data.Success) {
          localStorage.removeItem("studentToken");
          toast.error(data.ErrorMessage, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
            transition: Bounce,
          });
          setTimeout(() => {
            router.push("/login/student");
          }, 2000);
          return;
        }

        localStorage.setItem("role", "student");
        setUser(data.user);

        const courseRes = await fetch("/api/studentapis/getEnrolledCourses", {
          method: "POST",
          body: JSON.stringify({ enrollmentNumber: data.user.enrollmentNumber }),
          headers: { "Content-Type": "application/json" },
        });

        const courseData = await courseRes.json();
        if (courseData.Success) {
          setCourses(courseData.courses);
        } else {
          toast.error(courseData.ErrorMessage, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
            transition: Bounce,
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 text-black pt-10 pb-24 flex flex-col items-center">
      <ToastContainer theme="colored" transition={Bounce} />

      {loading ? (
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Student Info Card */}
          <div className="bg-white shadow-lg rounded-2xl px-6 py-4 w-11/12 max-w-sm mb-6 text-center">
            <h1 className="text-3xl font-bold text-purple-700 mb-2 tracking-wide">🎓 Student</h1>
            <h2 className="text-lg font-semibold">{user?.name || "Undefined"}</h2>
            <p className="text-sm text-gray-600">Enrollment: {user?.enrollmentNumber || "Undefined"}</p>
            <p className="text-sm text-gray-600">Batch: {user?.batch || "Undefined"}</p>
          </div>

          {/* Courses Scrollable Section */}
          <div className="flex-grow overflow-y-auto px-4 w-full max-w-sm space-y-2 pb-6">
            {courses.length === 0 ? (
              <div className="text-center text-sm text-gray-700">No courses assigned to you.</div>
            ) : (
              courses.map((course, index) => (
                <div
                  key={index}
                  className="bg-white shadow-xl rounded-xl border border-gray-200 p-4 duration-200"
                >
                  <h3 className="text-lg font-semibold text-purple-800 mb-1">{course.courseName}</h3>
                  <p className="text-sm text-gray-500 mb-3">Faculty: {course.courseFaculty}</p>
                 
                 
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                    <button
                      onClick={() =>
                        (window.location.href = `/student/${course.courseCode}?course=${course.courseName}&enroll=${user.enrollmentNumber}`)
                      }
                      className="w-full sm:w-auto px-4 py-1.5 text-sm bg-purple-600 text-white rounded-lg bg-purple-700 "
                    >
                      📘 Dashboard
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `/student/digital/${course.courseCode}?course=${course.courseName}`)
                      }
                      className="w-full sm:w-auto px-4 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      ☑️ Attendance
                    </button>
                  </div>






                </div>
              ))
            )}
          </div>

          {/* Floating Chatbot Button */}
          <div
            onClick={() => router.push("/student/chat/studentchat")}
            className="fixed bottom-6 right-5 z-50 cursor-pointer group"
          >
            <div className="relative w-14 h-14 animate-bounce">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712038.png"
                alt="Chatbot"
                className="w-full h-full rounded-full shadow-lg"
              />
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] bg-black text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Chatbot
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
