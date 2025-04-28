import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const { courseCode } = req.query; // Get courseCode from the query parameter

    if (!courseCode) {
      return res.status(400).json({ Success: false, ErrorMessage: "Course code is required." });
    }

    try {
      // Find the course by courseCode
      const course = await Course.findOne({ courseCode });

      // If course is not found, return an error
      if (!course) {
        return res.status(404).json({ Success: false, ErrorMessage: "Course not found." });
      }

      // Extract the full student details from the course document
      const students = course.students.map((student) => ({
        enrollmentNumber: student.enrollmentNumber,
        name: student.name,
        email: student.email,
        batch: student.batch,
        // Add any additional fields if needed
      }));

      return res.status(200).json({ Success: true, students });
    } catch (error) {
      console.error("Error occurred:", error);
      return res.status(500).json({ Success: false, ErrorMessage: error.message });
    }
  } else {
    return res.status(405).json({ Success: false, ErrorMessage: "Method Not Allowed" });
  }
};

export default connectDb(handler);
