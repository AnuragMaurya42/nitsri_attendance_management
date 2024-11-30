import Student from "@/models/Student";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const students = await Student.find();
      return res.status(200).json({ Success: true, students });
    } catch (error) {
      return res.status(500).json({ Success: false, ErrorMessage: error.message });
    }
  } else {
    return res.status(405).json({ Success: false, ErrorMessage: "Method Not Allowed" });
  }
}

export default connectDb(handler);
