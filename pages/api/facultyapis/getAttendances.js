import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { courseCode } = req.body; // Extract courseCode from the request body

      if (!courseCode) {
        return res.status(400).json({ Success: false, ErrorMessage: "courseCode is required" });
      }

      // Find the course by courseCode and return attendanceStatusofStudents
      const course = await Course.findOne({ courseCode });

      if (!course) {
        return res.status(404).json({ Success: false, ErrorMessage: "Course not found" });
      }
     
      const attendanceRecords = course.attendanceStatusofStudents;
      return res.status(200).json({ Success: true, attendanceRecords:attendanceRecords });
    } catch (error) {
      return res.status(500).json({ Success: false, ErrorMessage: error.message });
    }
  } else {
    return res.status(405).json({ Success: false, ErrorMessage: "Method Not Allowed" });
  }
};

export default connectDb(handler);