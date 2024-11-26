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
    const { name, department, batch, email, password } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    if (!name || !department || !batch || !email || !password) {
      return res.status(400).json({
        Success: false,
        ErrorCode: 400,
        ErrorMessage: "All fields are required.",
      });
    }

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to: email,
      subject: "Verification Code",
      html: `
        <div style="border: 1px solid #ccc; background-color: #3b82f6; padding: 20px; border-radius: 8px; color: white;">
          <p>Hi ${name},</p>
          <p>Here is your unique verification code to create an account: <strong>${verificationCode}</strong>.</p>
          <p style="color:white">We have implemented these measures as an extra layer of security, which is extremely important to us.</p>
          <p style="color:white">Questions or concerns? Contact our support team.</p>
          <hr>
          <p>© NIT Srinagar, All Rights Reserved</p>
        </div>
      `,
    };

    try {
      const existingStudent = await Student.findOne({ email });

      if (existingStudent) {
        if (!existingStudent.email_verified) {
          await Student.findOneAndUpdate(
            { email },
            { verification_code: verificationCode }
          );
          await transporter.sendMail(mailOptions);
          return res.status(200).json({
            Success: true,
            SuccessMessage: "Email already registered but not verified. Verification code resent.",
          });
        } else {
          return res.status(409).json({
            Success: false,
            ErrorCode: 409,
            ErrorMessage: "Email already registered and verified.",
          });
        }
      } else {
        const newStudent = new Student({
          name,
          department,
          batch,
          email,
          verification_code: verificationCode,
        });

        await newStudent.save();
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
          Success: true,
          SuccessMessage: "Account created successfully. A verification code has been sent to your email.",
        });
      }
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
