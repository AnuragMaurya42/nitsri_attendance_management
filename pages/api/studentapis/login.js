import Student from "@/models/Student";
import connectDb from "@/middleware/mongoose";
import bcrypt from "bcryptjs";
const jwt = require('jsonwebtoken');

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      // Validate input fields
      if (!email || !password) {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "Email and password are required.",
        });
      }

      // Find student by email
      const existingStudent = await Student.findOne({ email });

      if (!existingStudent) {
        return res.status(404).json({
          Success: false,
          ErrorCode: 404,
          ErrorMessage: "Student not found with the provided email.",
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, existingStudent.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          Success: false,
          ErrorCode: 401,
          ErrorMessage: "Invalid password. Please try again.",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          studentId: existingStudent._id,
          email: existingStudent.email,
          studentName: existingStudent.name,
        },
        process.env.NEXT_PUBLIC_JWT_SECRET3, 
        { expiresIn: '7d' }  // Optional: Token expiry (7 days)
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
