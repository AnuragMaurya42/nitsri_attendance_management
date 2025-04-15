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
            localStorage.setItem('role', "student");
            setUser(data.user);

            const coursesRes = await fetch("/api/studentapis/fetchUpgoingCoures", {
              method: "GET",
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
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
              });
            }
          }
        } catch (error) {
          console.error(error);
        }
        setLoading(false);
      };
      helper();
    } else {
      router.push("/login/student");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-black">
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
        </div>
      ) : (
        <div>
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full mb-6 mx-auto">
            <h1
              className="text-5xl font-bold text-red-600 mb-5"
              style={{
                fontFamily: "Courier New, Courier, monospace",
              }}
            >
              STUDENT
            </h1>
            <h2 className="text-2xl font-bold mb-4">{user?.name || "Undefined"}</h2>
            <p className="text-black mb-4">Enrollment: {user?.enrollmentNumber || "Undefined"}</p>
            <p className="text-black mb-4">Batch: {user?.batch || "Undefined"}</p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center text-black">
              No courses assigned to you.
            </div>
          ) : (
            courses.map((course, index) => (
              <div
                key={index}
                className="w-4/5 bg-red-200 border border-red-500 rounded-lg shadow-md mb-6 mx-auto"
              >
                <div className="flex justify-end px-4 pt-4"></div>
                <div className="flex flex-col items-center pb-10">
                  <h5 className="mb-1 text-xl font-medium text-black">{course.courseName}</h5>
                  <span className="text-sm text-gray-600">{course.courseFaculty}</span>
                  <div className="relative pt-1 w-4/5 mt-2"></div>
                  <button
                    onClick={() => (window.location.href = `/student/${course.courseCode}?course=${course.courseName}&enroll=${user.enrollmentNumber}`)}
                    className="mt-4 px-4 py-2 text-white bg-red-600 border border-red-500 rounded-lg hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Go to {course.courseName}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
