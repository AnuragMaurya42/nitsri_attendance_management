import connectDb from "@/middleware/mongoose";
import Course from "@/models/Course";

const handler = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ Success: false, ErrorMessage: "Method Not Allowed" });
  }

  const { courseCode, selectedDate } = req.body;

  if (!courseCode || !selectedDate) {
    return res.status(400).json({ Success: false, ErrorMessage: "courseCode and selectedDate are required" });
  }

  try {
    const formattedDate = new Date(selectedDate);
    if (!(formattedDate instanceof Date) || isNaN(formattedDate)) {
      throw new Error("Invalid selectedDate format");
    }

    const course = await Course.findOne({ courseCode });
    if (!course) {
      return res.status(404).json({ Success: false, ErrorMessage: "Course not found" });
    }

    const originalLength = course.attendanceStatusofStudents.length;
    course.attendanceStatusofStudents = course.attendanceStatusofStudents.filter(
      (record) => record.date.toISOString().split("T")[0] !== formattedDate.toISOString().split("T")[0]
    );

    if (course.attendanceStatusofStudents.length === originalLength) {
      return res.status(404).json({ Success: false, ErrorMessage: "No attendance found for this date" });
    }

    await course.save();

    return res.status(200).json({ Success: true, Message: "Attendance deleted for selected date" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ Success: false, ErrorMessage: error.message });
  }
};

export default connectDb(handler);
