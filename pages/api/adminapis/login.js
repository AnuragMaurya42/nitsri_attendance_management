import Admin from "@/models/Admin";
import connectDb from "@/middleware/mongoose";
import bcrypt from 'bcrypt';

const handler = async (req, res) => {
  const jwt = require('jsonwebtoken');

  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "Email and password are required.",
        });
      }

      const existingAdmin = await Admin.findOne({ email });
      if (!existingAdmin) {
        return res.status(404).json({
          Success: false,
          ErrorCode: 404,
          ErrorMessage: "Admin not found with the provided email.",
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, existingAdmin.passcode);
      if (!isPasswordValid) {
        return res.status(401).json({
          Success: false,
          ErrorCode: 401,
          ErrorMessage: "Invalid password. Please try again.",
        });
      }

      const token = jwt.sign(
        {
          adminId: existingAdmin.adminId,
          email: existingAdmin.email,
          adminName: existingAdmin.adminName,
        },
        process.env.NEXT_PUBLIC_JWT_SECRET3 
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
