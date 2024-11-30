import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "DELETE") {
    try {
      const { courseCode } = req.body;

      if (!courseCode) {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "Course Code is required!",
        });
      }

      const deletedCourse = await Course.findOneAndDelete({ courseCode });
      if (!deletedCourse) {
        return res.status(404).json({
          Success: false,
          ErrorCode: 404,
          ErrorMessage: "Course not found!",
        });
      }

      return res.status(200).json({
        Success: true,
        message: `Course with Course Code: ${courseCode} has been deleted successfully!`,
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
