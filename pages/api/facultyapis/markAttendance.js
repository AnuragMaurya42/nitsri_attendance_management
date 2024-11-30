import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { courseCode, selectedDate, attendanceStatuses } = req.body;

    // Validation for required fields
    if (!courseCode || !selectedDate || !attendanceStatuses) {
      return res
        .status(400)
        .json({ Success: false, ErrorMessage: "All fields are required." });
    }

    try {
      // Find the course by courseCode
      const course = await Course.findOne({ courseCode });
      if (!course) {
        return res
          .status(404)
          .json({ Success: false, ErrorMessage: "Course not found." });
      }

      const enrollmentNumbers = Object.keys(attendanceStatuses);

      // Format the selected date
      const formattedSelectedDate = new Date(selectedDate);

      // Iterate over enrollment numbers and update attendance
      enrollmentNumbers.forEach((enrollmentNumber) => {
        let student = course.attendanceStatusofStudents.find(
          (s) => s.enrollmentNumber === enrollmentNumber
        );

        if (!student) {
          // Add the student if they don't exist in the course
          student = {
            studentName: attendanceStatuses[enrollmentNumber].name, // Name from frontend
            enrollmentNumber,
            attendance: [],
          };
          course.attendanceStatusofStudents.push(student);
        }

        // Find if attendance for the date already exists
        const attendanceForDate = student.attendance.find(
          (att) =>
            att.date.toISOString().split("T")[0] ===
            formattedSelectedDate.toISOString().split("T")[0]
        );

        if (attendanceForDate) {
          // Update existing attendance record
          attendanceForDate.status =
            attendanceStatuses[enrollmentNumber].status === "1"
              ? "Present"
              : "Absent";
        } else {
          // Add new attendance record
          student.attendance.push({
            date: formattedSelectedDate,
            status:
              attendanceStatuses[enrollmentNumber].status === "1"
                ? "Present"
                : "Absent",
          });
        }
      });

      // Save the updated course document
      await course.save();

      return res
        .status(200)
        .json({ Success: true, Message: "Attendance marked successfully!" });
    } catch (error) {
      console.error("Error occurred:", error);
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
