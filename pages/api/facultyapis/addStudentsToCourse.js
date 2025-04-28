import Course from "@/models/Course";
import Student from "@/models/Student"; // to fetch complete student data
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { courseCode, selectedStudents } = req.body;

    if (!courseCode || !selectedStudents || selectedStudents.length === 0) {
      return res.status(400).json({ Success: false, ErrorMessage: "Course code and students are required." });
    }

    try {
      // Find the course by courseCode
      const course = await Course.findOne({ courseCode });
      if (!course) {
        return res.status(404).json({ Success: false, ErrorMessage: "Course not found." });
      }

      // Fetch full student data from DB
      const enrollmentNumbers = selectedStudents.map((s) => s.enrollmentNumber);
      const studentsToAdd = await Student.find({ enrollmentNumber: { $in: enrollmentNumbers } });

      // Reset the students array and add the new students
      const newStudentData = studentsToAdd.map((s) => ({
        enrollmentNumber: s.enrollmentNumber,
        name: s.name,
        email: s.email,
        batch: s.batch,
      }));

      // Reset students array and assign the new students
      course.students = newStudentData;

      // Save the updated course document
      await course.save();

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
