import Admin from "@/models/Admin";
import connectDb from "@/middleware/mongoose";
import bcrypt from 'bcrypt';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { adminId, email, passcode, adminName, department } = req.body;
    const saltRounds = 10;

    // Check for missing fields
    if (!adminId || !email || !passcode || !adminName || !department) {
      return res.status(400).json({
        Success: false,
        ErrorCode: 400,
        ErrorMessage: "Missing required fields!",
      });
    }

    try {
      // Check if an admin with the same email already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(409).json({
          Success: false,
          ErrorCode: 409,
          ErrorMessage: "An admin with this email already exists!",
        });
      }

      // Hash the passcode
      const hashedPasscode = await bcrypt.hash(passcode, saltRounds);

      // Create a new admin
      const newAdmin = new Admin({
        adminId,
        email,
        passcode: hashedPasscode,
        adminName,
        department,
      });

      await newAdmin.save();

      return res.status(200).json({
        Success: true,
        SuccessMessage: 'Admin details have been successfully set.',
      });
    } catch (error) {
      return res.status(500).json({
        Success: false,
        ErrorMessage: error.message || "An error occurred",
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
