import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { courseName, courseCode } = req.body;

      if (!courseName || !courseCode) {
        return res
          .status(400)
          .json({ Success: false, ErrorCode: 400, ErrorMessage: "Course Name and Code are required!" });
      }

      const newCourse = new Course({
        courseName,
        courseCode,
      });

      await newCourse.save();

      return res.status(201).json({ Success: true, SuccessMessage:"Course added Successfully",course: newCourse });
    } catch (error) {
      return res.status(500).json({ Success: false, ErrorCode: 500, ErrorMessage: error.message });
    }
  } else {
    return res.status(405).json({ Success: false, ErrorCode: 405, ErrorMessage: "Method Not Allowed!" });
  }
};

export default connectDb(handler);
