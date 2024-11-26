import Admin from "@/models/Admin";
import connectDb from "@/middleware/mongoose";
import bcrypt from 'bcrypt';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { adminId, email, passcode, adminName,department } = req.body;
    const saltRounds = 10;

    if (!adminId || !email || !passcode || !adminName || !department) {
      return res.status(400).json({
        Success: false,
        ErrorCode: 400,
        ErrorMessage: "Missing required fields!",
      });
    }

    try {
      const hashedPasscode = await bcrypt.hash(passcode, saltRounds);

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
