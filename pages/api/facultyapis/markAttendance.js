import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { courseCode, selectedDate, attendanceStatuses } = req.body;

    // Ensure all fields are provided
    if (!courseCode || !selectedDate || !attendanceStatuses) {
      return res.status(400).json({ Success: false, ErrorMessage: "All fields are required." });
    }

    try {
      // Find the course by courseCode
      const course = await Course.findOne({ courseCode });

      if (!course) {
        return res.status(404).json({ Success: false, ErrorMessage: "Course not found." });
      }

      // Ensure the attendanceStatusofStudents is populated for all students enrolled in the course
      const enrollmentNumbers = Object.keys(attendanceStatuses);  // Assuming `attendanceStatuses` has student enrollment numbers as keys
      
      // Iterate over each enrollment number and ensure the student exists in the attendanceStatusofStudents array
      enrollmentNumbers.forEach(enrollmentNumber => {
        // Check if the student exists in the course's attendanceStatusofStudents array
        const student = course.attendanceStatusofStudents.find(student => student.enrollmentNumber === enrollmentNumber);

        // If the student does not exist, create a new student entry
        if (!student) {
          course.attendanceStatusofStudents.push({
            studentName: `Student ${enrollmentNumber}`,  // You might want to fetch the student's actual name from a student database
            enrollmentNumber: enrollmentNumber,
            attendance: [],
          });
        }
      });

      // Log course data after ensuring students are added
      console.log("Course Data after ensuring students: ", course);

      // Format the selected date
      const formattedSelectedDate = new Date(selectedDate).toISOString().split('T')[0];
      console.log("Formatted Selected Date: ", formattedSelectedDate);

      // Update the attendance status for each student
      course.attendanceStatusofStudents.forEach(student => {
        // Check if there's already an attendance record for the selected date
        const attendanceForDate = student.attendance.find(
          att => att.date.toISOString().split('T')[0] === formattedSelectedDate
        );

        if (attendanceForDate) {
          // Update status if attendance record is found
          attendanceForDate.status = attendanceStatuses[student.enrollmentNumber] ? "Present" : "Absent";
        } else {
          // If no attendance record exists for the selected date, create a new entry
          student.attendance.push({
            date: new Date(selectedDate),  // Store date as Date object
            status: attendanceStatuses[student.enrollmentNumber] ? "Present" : "Absent",
          });
        }
      });

      // Save the course document with updated attendance
      await course.save();
      console.log("Course saved successfully with updated attendance.");

      return res.status(200).json({ Success: true, Message: "Attendance marked successfully!" });
    } catch (error) {
      console.error("Error occurred: ", error);
      return res.status(500).json({ Success: false, ErrorMessage: error.message });
    }
  } else {
    return res.status(405).json({ Success: false, ErrorMessage: "Method Not Allowed" });
  }
};

export default connectDb(handler);
