import Student from "@/models/Student";
import Faculty from "@/models/Faculty";
import bcrypt from "bcrypt";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email, verificationCode, password, userType } = req.body;

    if (!email || !verificationCode || !password || !userType) {
      return res.status(400).json({
        Success: false,
        ErrorCode: 400,
        ErrorMessage: "Email, verification code, password, and user type are required.",
      });
    }

    try {
      let user;
      if (userType === "student") {
        user = await Student.findOne({ email });
      } else if (userType === "faculty") {
        user = await Faculty.findOne({ email });
      } else {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "Invalid user type. Must be either 'faculty' or 'student'.",
        });
      }

      if (!user) {
        return res.status(404).json({
          Success: false,
          ErrorCode: 404,
          ErrorMessage: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found.`,
        });
      }

      if (user.verification_code !== verificationCode) {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "Invalid verification code.",
        });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Set email_verified to true and save the password
      user.password = hashedPassword;
      user.email_verified = true;
      user.verification_code = undefined; // Clear the verification code
      await user.save();

      return res.status(200).json({
        Success: true,
        SuccessMessage: `${userType.charAt(0).toUpperCase() + userType.slice(1)} email verified and password set successfully.`,
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
