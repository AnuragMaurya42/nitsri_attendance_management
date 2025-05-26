import Faculty from "@/models/Faculty";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "DELETE") {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "Email is required!",
        });
      }

      const deletedFaculty = await Faculty.findOneAndDelete({ email });
      if (!deletedFaculty) {
        return res.status(404).json({
          Success: false,
          ErrorCode: 404,
          ErrorMessage: "Faculty not found!",
        });
      }

      return res.status(200).json({
        Success: true,
        message: `Faculty with email: ${email} has been deleted successfully!`,
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
