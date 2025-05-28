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
    <div className="min-h-screen bg-white text-black pt-16 pb-16 flex flex-col" style={{ height: '100vh' }}>
      <ToastContainer theme="colored" transition={Bounce} />

      {loading ? (
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-400"></div>
        </div>
      ) : (
        <>
          {/* Student Info Card */}
          <div className="bg-white shadow-md rounded-lg p-4 max-w-xs w-full mb-4 mx-auto text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-2" style={{ fontFamily: "Courier New, Courier, monospace" }}>
              Student
            </h1>
            <h2 className="text-lg font-bold mb-1">{user?.name || "Undefined"}</h2>
            <p className="text-black text-sm">Enrollment: {user?.enrollmentNumber || "Undefined"}</p>
            <p className="text-black text-sm">Batch: {user?.batch || "Undefined"}</p>
          </div>

          {/* Scrollable Courses */}
          <div className="flex-grow overflow-y-auto px-4 space-y-4 pb-4">
            {courses.length === 0 ? (
              <div className="text-center text-black text-sm">No courses assigned to you.</div>
            ) : (
              courses.map((course, index) => (
                <div
                  key={index}
                  className="w-full max-w-xs bg-red-100 border border-red-400 rounded-lg shadow-md mx-auto p-4 text-center"
                >
                  <h5 className="text-base font-semibold text-black">{course.courseName}</h5>
                  <p className="text-xs text-gray-700 mb-2">{course.courseFaculty}</p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() =>
                        (window.location.href = `/student/${course.courseCode}?course=${course.courseName}&enroll=${user.enrollmentNumber}`)
                      }
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `/student/digital/${course.courseCode}?course=${course.courseName}`)
                      }
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Mark Your Attendance
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Floating Chatbot Button */}
          <div
            onClick={() => router.push("/student/chat/studentchat")}
            className="fixed bottom-10 right-8 z-20 cursor-pointer group"
          >
            <div className="relative w-14 h-14 animate-bounce transition-transform duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712038.png"
                alt="Chatbot"
                className="w-full h-full rounded-full shadow-xl"
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
