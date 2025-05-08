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
<<<<<<< HEAD
    if (localStorage.getItem("studentToken")) {
      let token = localStorage.getItem("studentToken");
      const helper = async () => {
        try {
          const res = await fetch("/api/studentapis/getStudent", {
            method: "POST",
            body: JSON.stringify({ token }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          if (!data.Success) {
            localStorage.removeItem("studentToken");
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
              router.push("/login/student");
            }, 2000);
          } else {
            localStorage.setItem("role", "student");
            setUser(data.user);
=======
    const token = localStorage.getItem("studentToken");
>>>>>>> 6e9759bf937835e3b7f91cdd559dc1d753e1f1ef

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

        // ✅ Fetch only the enrolled courses
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
    <div className="min-h-screen bg-white text-black">
<<<<<<< HEAD
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

=======
      <ToastContainer theme="colored" transition={Bounce} />
>>>>>>> 6e9759bf937835e3b7f91cdd559dc1d753e1f1ef
      {loading ? (
        <div className="relative min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
        </div>
      ) : (
        <div>
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full mb-6 mx-auto">
            <h1
              className="text-5xl font-bold text-red-600 mb-5"
              style={{ fontFamily: "Courier New, Courier, monospace" }}
            >
              STUDENT
            </h1>
            <h2 className="text-2xl font-bold mb-4">{user?.name || "Undefined"}</h2>
            <p className="text-black mb-4">Enrollment: {user?.enrollmentNumber || "Undefined"}</p>
            <p className="text-black mb-4">Batch: {user?.batch || "Undefined"}</p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center text-black">No courses assigned to you.</div>
          ) : (
            courses.map((course, index) => (
              <div
                key={index}
                className="w-4/5 bg-red-200 border border-red-500 rounded-lg shadow-md mb-6 mx-auto"
              >
                <div className="flex flex-col items-center pb-10">
                  <h5 className="mb-1 mt-5 text-xl font-medium text-black">{course.courseName}</h5>
                  <span className="text-sm text-gray-600">{course.courseFaculty}</span>
                  <button
                    onClick={() =>
                      (window.location.href = `/student/${course.courseCode}?course=${course.courseName}&enroll=${user.enrollmentNumber}`)
                    }
<<<<<<< HEAD
                    className="mt-4 px-4 py-2 text-white bg-red-600 border border-red-500 rounded-lg hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300"
=======
                    className="mt-4 px-4 py-2 text-white bg-red-600 border border-red-500 rounded-lg hover:bg-red-700"
>>>>>>> 6e9759bf937835e3b7f91cdd559dc1d753e1f1ef
                  >
                    Go to {course.courseName}
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Floating Chatbot Button */}
          <div
            onClick={() => router.push("/student/chat/studentchat")}
            className="fixed bottom-5 right-5 z-50 cursor-pointer group"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 animate-bounce transition-transform duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712038.png"
                alt="Chatbot"
                className="w-full h-full rounded-full shadow-xl"
              />
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm bg-black text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Chatbot
              </span>
            </div>
          </div>

          {/* 📨 Floating Find Email Button */}
          <div
            onClick={() => router.push("/email/frontemail")}
            className="fixed bottom-5 left-5 z-50 cursor-pointer group"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 animate-bounce transition-transform duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                alt="Find Email"
                className="w-full h-full rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
              />
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm bg-black text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Find Email
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
