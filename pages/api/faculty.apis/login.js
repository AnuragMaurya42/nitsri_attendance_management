import Faculty from "@/models/Faculty";
import connectDb from "@/middleware/mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "Email and password are required.",
        });
      }

      const faculty = await Faculty.findOne({ email });

      if (!faculty) {
        return res.status(404).json({
          Success: false,
          ErrorCode: 404,
          ErrorMessage: "Faculty not found with the provided email.",
        });
      }

      if (!faculty.email_verified) {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "Email not verified. Please verify your email first.",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, faculty.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          Success: false,
          ErrorCode: 401,
          ErrorMessage: "Invalid password. Please try again.",
        });
      }

      const token = jwt.sign(
        {
          facultyId: faculty._id,
          email: faculty.email,
          facultyName: faculty.name,
        },
        process.env.NEXT_PUBLIC_JWT_SECRET3,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        Success: true,
        SuccessMessage: "Login successful.",
        token: token,
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
