import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { courseCode, date } = req.body;

      if (!courseCode || !date) {
        return res.status(400).json({ Success: false, ErrorMessage: "courseCode and date are required" });
      }

      const course = await Course.findOne({ courseCode });

      if (!course) {
        return res.status(404).json({ Success: false, ErrorMessage: "Course not found" });
      }

      const attendanceRecord = course.attendanceStatusofStudents.find(
        (entry) => new Date(entry.date).toDateString() === new Date(date).toDateString()
      );

      if (!attendanceRecord) {
        return res.status(200).json({ Success: true, attendance: null }); // No attendance for this date
      }

      return res.status(200).json({
        Success: true,
        attendance: {
          classDuration: attendanceRecord.classDuration,
          attendances: attendanceRecord.attendances,
        },
      });
    } catch (error) {
      return res.status(500).json({ Success: false, ErrorMessage: error.message });
    }
  } else {
    return res.status(405).json({ Success: false, ErrorMessage: "Method Not Allowed" });
  }
};

export default connectDb(handler);
