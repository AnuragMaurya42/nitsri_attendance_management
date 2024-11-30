import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { courseId, newCourseName, newCourseCode } = req.body;
    if (!courseId || !newCourseName || !newCourseCode) {
      return res.status(400).json({
        Success: false,
        ErrorCode: 400,
        ErrorMessage: "Missing required fields.",
      });
    }

    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          Success: false,
          ErrorCode: 404,
          ErrorMessage: "Course not found.",
        });
      }

      course.courseName = newCourseName;
      course.courseCode = newCourseCode;

      await course.save();

      return res.status(200).json({
        Success: true,
        SuccessMessage: "Course updated successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        Success: false,
        ErrorCode: 500,
        ErrorMessage: error.message,
      });
    }
  } else {
    return res.status(405).json({
      Success: false,
      ErrorCode: 405,
      ErrorMessage: "Method Not Allowed!",
    });
  }
};

export default connectDb(handler);
