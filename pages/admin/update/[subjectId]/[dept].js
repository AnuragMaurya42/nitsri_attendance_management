import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Bounce } from "react-toastify";

const UpdateSubject = () => {
  const router = useRouter();
  const { subjectId, dept } = router.query;

  const [courseDetails, setCourseDetails] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);

  useEffect(() => {
    if (subjectId && dept) {
      fetchCourseDetails(subjectId);
      fetchFacultyList(dept);
    }
  }, [subjectId, dept]);

  const fetchCourseDetails = async (id) => {
    const res = await fetch(`/api/adminapis/fetchCourseDetails?id=${id}`);
    const data = await res.json();

    if (data.Success) {
      setCourseDetails(data.course);
      setNewCourseName(data.course.courseName);
      setNewCourseCode(data.course.courseCode);
      setSelectedFaculty(data.course.courseFacultyId || "");
    } else {
      toast.error(data.ErrorMessage, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const fetchFacultyList = async (dept) => {
    const res = await fetch(`/api/adminapis/getFacultyByDept?dept=${dept}`);
    const data = await res.json();

    if (data.Success) {
      setFaculties(data.faculties);
    } else {
      toast.error(data.ErrorMessage, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const updateCourseDetails = async () => {
    const res = await fetch(`/api/adminapis/updateCourse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: courseDetails._id,
        newCourseName,
        newCourseCode,
      }),
    });

    const data = await res.json();
    if (data.Success) {
      toast.success("Course updated successfully", {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
        transition: Bounce,
      });

      setCourseDetails({
        ...courseDetails,
        courseName: newCourseName,
        courseCode: newCourseCode,
      });

      setShowUpdateModal(false);
    } else {
      toast.error("Failed to update course", {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const assignNewFaculty = async () => {
    if (!selectedFaculty) {
      toast.error("Please select a faculty", {
        position: "top-center",
        autoClose: 1500,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    const res = await fetch(`/api/adminapis/assignNewFaculty`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: subjectId,
        facultyId: selectedFaculty,
      }),
    });

    const data = await res.json();
    if (data.Success) {
      toast.success("Faculty assigned successfully", {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
        transition: Bounce,
      });

      const updatedFaculty = faculties.find(
        (faculty) => faculty._id === selectedFaculty
      );

      setCourseDetails({
        ...courseDetails,
        courseFaculty: updatedFaculty ? updatedFaculty.name : "Not Assigned",
        courseFacultyId: selectedFaculty,
      });

      setShowFacultyModal(false);
    } else {
      toast.error("Failed to assign faculty", {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 pt-[68px] pb-[56px] flex flex-col items-center">
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

      {courseDetails && (
        <>
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full mb-6 text-black">
            <h1 className="text-3xl font-bold text-green-600 mb-5">
              Course Details
            </h1>
            <p className="mb-3">
              <strong>Course Name:</strong> {courseDetails.courseName}
            </p>
            <p className="mb-3">
              <strong>Course Code:</strong> {courseDetails.courseCode}
            </p>
            <p className="mb-3">
              <strong>Current Faculty:</strong>{" "}
              {courseDetails.courseFaculty
                ? `${courseDetails.courseFaculty} (ID: ${courseDetails.courseFacultyId})`
                : "Not Assigned"}
            </p>
            <div className="flex justify-center mt-6">
              <Link href={`/faculty/showSummary/${courseDetails.courseCode}`}>
                <button className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors font-semibold">
                  View Attendance
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6 w-full max-w-lg">
            <button
              onClick={() => setShowUpdateModal(true)}
              className="min-w-[180px] px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl shadow-md transition-all duration-200"
            >
              Update Course
            </button>

            <button
              onClick={() => setShowFacultyModal(true)}
              className="min-w-[180px] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md transition-all duration-200"
            >
              Choose New Faculty
            </button>

            <button
              onClick={() =>
                router.push(
                  `/admin/categoriseStudent?courseCode=${courseDetails.courseCode}`
                )
              }
              className="min-w-[180px] px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-2xl shadow-md transition-all duration-200"
            >
              Select Students
            </button>

            <button
              onClick={() =>
                router.push(
                  `/faculty/viewStudents?course=${courseDetails.courseCode}&courseName=${encodeURIComponent(
                    courseDetails.courseName
                  )}`
                )
              }
              className="min-w-[180px] px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl shadow-md transition-all duration-200"
            >
              View Students
            </button>
          </div>
        </>
      )}

      {/* Update Course Modal */}
      {showUpdateModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setShowUpdateModal(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-5">
              Update Course Information
            </h2>
            <input
              type="text"
              placeholder="Course Name"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-400 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Course Code"
              value={newCourseCode}
              onChange={(e) => setNewCourseCode(e.target.value)}
              className="w-full p-3 mb-6 border border-gray-400 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={updateCourseDetails}
                className="px-5 py-2 bg-green-600 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-5 py-2 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Choose New Faculty Modal */}
      {showFacultyModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setShowFacultyModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-5 text-gray-900">
              Choose New Faculty
            </h2>
          <select
  value={selectedFaculty}
  onChange={(e) => setSelectedFaculty(e.target.value)}
  className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
>
  <option value="" className="text-black">Select Faculty</option>
  {faculties.map((faculty) => (
    <option key={faculty._id} value={faculty._id} className="text-black">
      {faculty.name}
    </option>
  ))}
</select>


            <div className="flex justify-end space-x-4">
              <button
                onClick={assignNewFaculty}
                className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
              >
                Save Faculty Assignment
              </button>
              <button
                onClick={() => setShowFacultyModal(false)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateSubject;
