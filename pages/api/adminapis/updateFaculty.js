import Faculty from "@/models/Faculty";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { email, department } = req.body;

      if (!email) {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "Email is required!",
        });
      }
      if (!department) {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "Department is required!",
        });
      }

      // Find faculty by email and update department
      const updatedFaculty = await Faculty.findOneAndUpdate(
        { email },
        { department },
        { new: true } // return the updated document
      );

      if (!updatedFaculty) {
        return res.status(404).json({
          Success: false,
          ErrorCode: 404,
          ErrorMessage: "Faculty not found!",
        });
      }

      return res.status(200).json({
        Success: true,
        message: `Faculty department updated successfully for email: ${email}`,
        faculty: updatedFaculty,
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
