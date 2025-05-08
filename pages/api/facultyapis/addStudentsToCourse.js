// pages/api/facultyapis/addStudentsToCourse.js
import Course from "@/models/Course";
import Student from "@/models/Student";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { courseCode, selectedStudents } = req.body;

    if (!courseCode || !selectedStudents || selectedStudents.length === 0) {
      return res.status(400).json({ Success: false, ErrorMessage: "Course code and students are required." });
    }

    try {
      const course = await Course.findOne({ courseCode });
      if (!course) {
        return res.status(404).json({ Success: false, ErrorMessage: "Course not found." });
      }

      const enrollmentNumbers = selectedStudents.map((s) => s.enrollmentNumber);
      const studentsToAdd = await Student.find({ enrollmentNumber: { $in: enrollmentNumbers } });

      const newStudentData = studentsToAdd.map((s) => ({
        enrollmentNumber: s.enrollmentNumber,
        name: s.name,
        email: s.email,
        batch: s.batch,
      }));

      // Update Course
      course.students = newStudentData;
      await course.save();

      // Update each student to include this course in `enrolledCourses`
      for (let student of studentsToAdd) {
        if (!student.enrolledCourses.some((c) => c.courseCode === courseCode)) {
          student.enrolledCourses.push({ courseCode });
          await student.save();
        }
      }

      return res.status(200).json({ Success: true, Message: "Students successfully added to the course." });
    } catch (error) {
      console.error("Error occurred:", error);
      return res.status(500).json({ Success: false, ErrorMessage: error.message });
    }
  } else {
    return res.status(405).json({ Success: false, ErrorMessage: "Method Not Allowed" });
  }
};

export default connectDb(handler);
