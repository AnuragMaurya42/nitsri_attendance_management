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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
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
            headers: { "Content-Type": "application/json" },
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
            setTimeout(() => router.push("/login/faculty"), 2000);
          } else {
            localStorage.setItem("role", "faculty");
            setUser(data.user);

            const coursesRes = await fetch("/api/facultyapis/getfacultycourses", {
              method: "POST",
              body: JSON.stringify({ _id: data.user._id }),
              headers: { "Content-Type": "application/json" },
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

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAttendanceModal = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const navigateTo = (type) => {
    if (!selectedCourse) return;
    const code = encodeURIComponent(selectedCourse.courseCode);
    const name = encodeURIComponent(selectedCourse.courseName);
    if (type === "manual") {
      router.push(`/faculty/takeAttendence/${code}?course=${name}`);
    } else if (type === "automatic") {
      router.push(`/faculty/digital/${code}?course=${name}`);
    }
    setModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };






  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50 pt-10 pb-14 px-4 relative">
      <ToastContainer />
      {loading ? (
        <div className="h-[calc(100vh-6rem)] flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500"></div>
        </div>
      ) : (
        <>
          {/* Profile Card */}
         <div className="bg-gradient-to-r from-green-200 to-green-300 rounded-xl p-5 mb-5 shadow-lg border border-pink-600">
  <h1
    className="text-2xl text-center font-bold mb-2 tracking-wide text-gray-900"
    style={{ fontFamily: "Courier New, Courier, monospace" }}
  >
    Faculty
  </h1>
  <h2 className="text-lg text-center font-semibold text-gray-800">
    {user?.name}
  </h2>
  <p className="text-center mt-1 italic text-gray-700 font-medium">
    Department: {user?.department}
  </p>
</div>


          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search course name or code..."
              className="w-full px-3 py-2 text-sm rounded-md border border-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: "0.9rem" }}
            />
          </div>

          {/* Scrollable Cards Section */}
          <div className="h-[calc(100vh-18rem)] overflow-y-auto pr-2 custom-scrollbar">
            {filteredCourses.length === 0 ? (
              <div className="text-center text-gray-600 text-lg">
                No matching courses found.
              </div>
            ) : (
              filteredCourses.map((course, index) => (
                <div
                  key={index}
                  className="bg-white via-purple-100 to-indigo-100 rounded-xl shadow-xl p-5 mb-5 border border-purple-300 "
                  style={{ fontSize: "0.95rem" }}
                >
                  <h3 className="text-lg font-extrabold text-purple-800 mb-1 text-center">
                    {course.courseName} - {course.courseCode}
                  </h3>
                  <p className="text-xs text-center text-purple-700 mb-3 italic">
                    Faculty: {course.courseFaculty}
                  </p>

                  <div className="grid grid-cols-2 gap-1 justify-items-center">
                    <button
                      onClick={() => openAttendanceModal(course)}
                      className="w-24 text-xs py-2 rounded-md font-semibold shadow text-white bg-gradient-to-r from-red-400 to-pink-600 hover:from-pink-600 hover:to-red-400 transition-colors"
                    >
                      Attendance
                    </button>

                    <Link
                      href={`/faculty/updateAttendance/${course.courseCode}?course=${encodeURIComponent(
                        course.courseName
                      )}`}
                      passHref
                    >
                      <button className="w-24 text-xs py-2 rounded-md font-semibold shadow text-white bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-indigo-600 hover:to-blue-400 transition-colors">
                        Update
                      </button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-1 mt-2 justify-items-center">
                    <Link
                      href={`/faculty/viewStudents?course=${course.courseCode}&courseName=${encodeURIComponent(
                        course.courseName
                      )}`}
                      passHref
                    >
                      <button className="w-24 text-xs py-2 rounded-md font-semibold shadow text-white bg-gradient-to-r from-red-400 to-pink-600 hover:from-pink-600 hover:to-red-400 transition-colors">
                        Students
                      </button>
                    </Link>

                    <Link
                      href={`/admin/categoriseStudent?courseCode=${course.courseCode}`}
                      passHref
                    >
                      <button className="w-24 text-xs py-2 rounded-md font-semibold shadow text-white bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-indigo-600 hover:to-blue-400 transition-colors">
                        Select Student
                      </button>
                    </Link>

                    <Link
                      href={`/faculty/showSummary/${course.courseCode}?course=${encodeURIComponent(
                        course.courseName
                      )}`}
                      passHref
                    >
                      <button className="w-24 text-xs py-2 rounded-md font-semibold shadow text-white bg-gradient-to-r from-red-400 to-pink-600 hover:from-pink-600 hover:to-red-400 transition-colors">
                        Summary
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal */}
          {modalOpen && selectedCourse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl relative">
                <h2 className="text-xl font-semibold mb-4 text-center text-purple-800">
                  Select Attendance Mode
                </h2>
                <p className="mb-6 text-center font-medium text-purple-700">
                  {selectedCourse.courseName} - {selectedCourse.courseCode}
                </p>

                <div className="flex justify-around">
                  <button
                    onClick={() => navigateTo("manual")}
                    className="px-6 py-2 rounded bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow hover:from-pink-600 hover:to-red-500 transition-colors"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Manual
                  </button>
                  <button
                    onClick={() => navigateTo("automatic")}
                    className="px-6 py-2 rounded bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold shadow hover:from-green-500 hover:to-green-600 transition-colors"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Automatic
                  </button>
                </div>

                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Chatbot Button */}
      <Link href="/faculty/chat/facultychat">
        <div className="fixed bottom-14 right-5 z-50">
          <div className="relative group animate-bounce">
            <div className="absolute inset-0 rounded-full bg-pink-400 opacity-60 blur-xl animate-ping"></div>
            <button
              className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 text-white text-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300"
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
