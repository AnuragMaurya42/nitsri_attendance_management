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
    const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);

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

            // Update the course details without refreshing
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

            const updatedFaculty = faculties.find((faculty) => faculty._id === selectedFaculty);
            setCourseDetails({
                ...courseDetails,
                courseFaculty: updatedFaculty ? updatedFaculty.name : "Not Assigned",
                courseFacultyId: selectedFaculty,
            });
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
        <div className="dark min-h-screen bg-gray-900 text-gray-100">
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
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-md mx-auto mb-6">
                        <h1 className="text-2xl font-bold text-green-500 mb-4">Course Details</h1>
                        <p className="text-gray-400 mb-4">
                            <strong>Course Name:</strong> {courseDetails.courseName}
                        </p>
                        <p className="text-gray-400 mb-4">
                            <strong>Course Code:</strong> {courseDetails.courseCode}
                        </p>
                        <p className="text-gray-400 mb-4">
                            <strong>Current Faculty:</strong>{" "}
                            {courseDetails.courseFaculty ? `${courseDetails.courseFaculty} (ID: ${courseDetails.courseFacultyId})` : "Not Assigned"}
                        </p>
                        <div className="flex justify-center mt-4">
                            <Link href="/faculty/showSummary/DBMS">
                                <button className="w-auto py-2 px-3 rounded-lg text-center bg-orange-500">
                                    View Attendance
                                </button>
                            </Link>
                        </div>
                    </div>


                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={() => setShowUpdateModal(true)}
                            className="w-40 p-2 bg-green-500 text-white rounded-lg"
                        >
                            Update Course
                        </button>
                        <button
                            onClick={() => setShowFacultyDropdown(!showFacultyDropdown)}
                            className="w-40 p-2 bg-blue-500 text-white rounded-lg"
                        >
                            Choose New Faculty
                        </button>
                    </div>

                    {showFacultyDropdown && (
                        <div className="flex flex-col items-center mb-4 text-black">
                            <select
                                value={selectedFaculty}
                                onChange={(e) => setSelectedFaculty(e.target.value)}
                                className="w-60 p-2 text-sm border rounded-md"
                            >
                                <option value="">Select Faculty</option>
                                {faculties.map((faculty) => (
                                    <option key={faculty._id} value={faculty._id}>
                                        {faculty.name}
                                    </option>
                                ))}
                            </select>
                            {selectedFaculty && (
                                <button
                                    onClick={assignNewFaculty}
                                    className="mt-4 p-2 bg-yellow-500 text-white rounded-lg"
                                >
                                    Save Faculty Assignment
                                </button>
                            )}
                        </div>
                    )}

                </>
            )}

            {showUpdateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div
                        className="bg-gray-800 p-6 rounded-lg w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Update Course Information</h2>
                        <input
                            type="text"
                            placeholder="Course Name"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            className="w-full p-2 my-2 border rounded-md text-black"
                        />
                        <input
                            type="text"
                            placeholder="Course Code"
                            value={newCourseCode}
                            onChange={(e) => setNewCourseCode(e.target.value)}
                            className="w-full p-2 my-2 border rounded-md text-black"
                        />
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={updateCourseDetails}
                                className="px-4 py-2 text-white bg-green-600 rounded-lg"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="px-4 py-2 text-white bg-red-600 rounded-lg"
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
