import Student from "@/models/Student";
import connectDb from "@/middleware/mongoose";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL_USER,
    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
  },
});

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        Success: false,
        ErrorCode: 400,
        ErrorMessage: "Email is required!",
      });
    }

    try {
      const student = await Student.findOne({ email });

      if (!student) {
        return res.status(404).json({
          Success: false,
          ErrorCode: 404,
          ErrorMessage: "Student not registered.",
        });
      }

      const code = Math.floor(100000 + Math.random() * 900000); 

      const mailOptions = {
        from: process.env.NEXT_PUBLIC_EMAIL_USER,
        to: email,
        subject: "Verification Code",
        html: `
          <p>Your verification code is: <strong>${code}</strong></p>
          <p>Please use this code to verify your account.</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      student.verification_code = code;
      await student.save();

      return res.status(200).json({
        Success: true,
        SuccessMessage: "Verification code sent to email.",
      });
    } catch (error) {
      return res.status(500).json({
        Success: false,
        ErrorMessage: error.message || "An error occurred.",
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
