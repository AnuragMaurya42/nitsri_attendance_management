// pages/api/studentapis/getEnrolledCourses.js
import Student from "@/models/Student";
import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { enrollmentNumber } = req.body;

    if (!enrollmentNumber) {
      return res.status(400).json({ Success: false, ErrorMessage: "Enrollment number is required." });
    }

    try {
      const student = await Student.findOne({ enrollmentNumber });

      if (!student) {
        return res.status(404).json({ Success: false, ErrorMessage: "Student not found." });
      }

      const courseCodes = student.enrolledCourses.map((c) => c.courseCode);

      const courses = await Course.find({ courseCode: { $in: courseCodes } });

      return res.status(200).json({ Success: true, courses });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ Success: false, ErrorMessage: error.message });
    }
  } else {
    return res.status(405).json({ Success: false, ErrorMessage: "Method Not Allowed" });
  }
};

export default connectDb(handler);
