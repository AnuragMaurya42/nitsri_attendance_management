import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { courseCode, selectedDate, attendanceStatuses, classDuration } = req.body;

    // Validation for required fields
    if (!courseCode || !selectedDate || !attendanceStatuses || !classDuration) {
      return res
        .status(400)
        .json({ Success: false, ErrorMessage: "All fields are required." });
    }

    // Validate classDuration
    if (!["1", "2"].includes(classDuration)) {
      return res.status(400).json({
        Success: false,
        ErrorMessage: "Invalid class duration. Must be either '1' or '2'.",
      });
    }

    try {
      // Find the course by courseCode
      const course = await Course.findOne({ courseCode });
      if (!course) {
        return res
          .status(404)
          .json({ Success: false, ErrorMessage: "Course not found." });
      }

      // Format the selected date
      const formattedSelectedDate = new Date(selectedDate);

      // Find or create the attendance record for the given date and class duration
      // Ensure formattedSelectedDate is a valid Date object
if (!(formattedSelectedDate instanceof Date) || isNaN(formattedSelectedDate)) {
  throw new Error("Invalid date provided for formattedSelectedDate");
}

// Find or create the attendance record for the given date and class duration
let attendanceRecord = course.attendanceStatusofStudents.find(
  (record) =>
    record.date instanceof Date &&
    !isNaN(record.date) &&
    record.date.toISOString().split("T")[0] ===
      formattedSelectedDate.toISOString().split("T")[0]
);

if (!attendanceRecord) {
  // If no attendance record for the given date and classDuration, create a new one
  attendanceRecord = {
    date: formattedSelectedDate,
    classDuration: classDuration,
    attendances: [],
  };
  course.attendanceStatusofStudents.push(attendanceRecord);
}

// Initialize attendance for all students if attendance is missing
// Now, initialize attendance for all students listed in attendanceStatuses
attendanceRecord = course.attendanceStatusofStudents.find(
  (record) =>
    record.date instanceof Date &&
    !isNaN(record.date) &&
    record.date.toISOString().split("T")[0] ===
      formattedSelectedDate.toISOString().split("T")[0]
);


      
     
      console.log(attendanceStatuses);
      for (let status of attendanceStatuses) {
        const { enrollmentNumber, name, presentCount } = status;

        // Check if the student is already in the attendances array for this record
        const studentAttendance = attendanceRecord.attendances.find(
          (att) => att.studentEnrollment === enrollmentNumber
        );

        if (!studentAttendance) {
          // If student attendance does not exist, create a new attendance entry
          attendanceRecord.attendances.push({
            studentName: name,
            studentEnrollment: enrollmentNumber,
            totalPresents: presentCount, // 0 = Absent, 1 = Present, 2 = Excused
          });
        } else {
          // If student attendance exists, update it
          studentAttendance.totalPresents = presentCount;
        }
      }

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