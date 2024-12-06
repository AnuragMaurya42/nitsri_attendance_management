import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { courseCode, enrollmentNumber } = req.body;

      // Validate the input
      if (!courseCode || !enrollmentNumber) {
        return res
          .status(400)
          .json({ Success: false, ErrorMessage: "courseCode and enrollmentNumber are required" });
      }

      // Find the course by courseCode
      const course = await Course.findOne({ courseCode });
      if (!course) {
        return res
          .status(404)
          .json({ Success: false, ErrorMessage: "Course not found" });
      }

      // Extract attendance records for the specified student
      const studentAttendanceRecords = [];

      for (const record of course.attendanceStatusofStudents) {
        // Find the student's attendance in the current record
        const studentAttendance = record.attendances.find(
          (att) => att.studentEnrollment === enrollmentNumber
        );

        if (studentAttendance) {
          studentAttendanceRecords.push({
            date: record.date, // Date of the class
            classDuration: record.classDuration, // Class duration
            totalPresents: studentAttendance.totalPresents, // Attendance status
          });
        }
      }

      // Check if any attendance records were found
      if (studentAttendanceRecords.length === 0) {
        return res
          .status(404)
          .json({ Success: false, ErrorMessage: "No attendance records found for the student" });
      }

      // Return the filtered attendance records
      return res
        .status(200)
        .json({ Success: true, studentAttendance: studentAttendanceRecords });
    } catch (error) {
      return res
        .status(500)
        .json({ Success: false, ErrorMessage: error.message });
    }
  } else {
    return res
      .status(405)
      .json({ Success: false, ErrorMessage: "Method Not Allowed" });
  }
};

export default connectDb(handler);
