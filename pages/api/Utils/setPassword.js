import Student from "@/models/Student";
import Admin from "@/models/Admin";
import Faculty from "@/models/Faculty";
import connectDb from "@/middleware/mongoose";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { role, email, password } = req.body;

    // Validate input
    if (!role || !email || !password) {
      return res.status(400).json({
        Success: false,
        ErrorCode: 400,
        ErrorMessage: "Role, email, and password are required.",
      });
    }

    try {
      let Model;
      let existingUser;

      // Determine the model based on the role
      switch (role.toLowerCase()) {
        case "student":
          Model = Student;
          existingUser = await Model.findOne({ email });
          break;
        case "faculty":
          Model = Faculty;
          existingUser = await Model.findOne({ email });
          break;
        case "admin":
          Model = Admin;
          existingUser = await Model.findOne({ email });
          break;
        default:
          return res.status(400).json({
            Success: false,
            ErrorCode: 400,
            ErrorMessage: "Invalid role provided.",
          });
      }

      // If user not found, return error
      if (!existingUser) {
        return res.status(404).json({
          Success: false,
          ErrorCode: 404,
          ErrorMessage: "User not found.",
        });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password
      existingUser.password = hashedPassword;
      await existingUser.save();

      return res.status(200).json({
        Success: true,
        SuccessMessage: "Password updated successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        Success: false,
        ErrorCode: error.code || 500,
        ErrorMessage: error.message || "Internal server error.",
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
