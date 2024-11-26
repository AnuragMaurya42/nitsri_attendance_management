import Admin from "@/models/Admin"; 
import connectDb from "@/middleware/mongoose";
import bcrypt from 'bcrypt';

const handler = async (req, res) => {
  const { adminId, email, passcode, adminName } = req.body;
  const saltRounds = 10;

  if (req.method === 'POST') {
    try {
      const hashedPasscode = await bcrypt.hash(passcode, saltRounds);

      const newAdmin = new Admin({
        adminId: userid,
        email: email,
        passcode: hashedPasscode,
        adminName: adminName,
      });

      await newAdmin.save();

      return res.status(200).json({ Success: true, SuccessMessage: 'Admin details have been successfully set.'});
    } catch (error) {
      return res.status(500).json({ Success: false, ErrorCode: error.code, ErrorMessage: error.message });
    }
  } else {
    return res.status(405).json({ Success: false, ErrorCode: 405, ErrorMessage: "Method Not Allowed!" });
  }
};

export default connectDb(handler);
