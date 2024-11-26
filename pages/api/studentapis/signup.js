import Student from "@/models/Student";
import connectDb from "@/middleware/mongoose";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { name, department, batch, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !department || !batch || !email || !password) {
      return res.status(400).json({
        Success: false,
        ErrorCode: 400,
        ErrorMessage: "All fields are required.",
      });
    }

    try {
      // Check if the student already exists
      const existingStudent = await Student.findOne({ email });

      if (existingStudent) {
        return res.status(409).json({
          Success: false,
          ErrorCode: 409,
          ErrorMessage: "Email already registered.",
        });
      } else {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new student record
        const newStudent = new Student({
          name,
          department,
          batch,
          email,
          password: hashedPassword, // Save the hashed password
        });

        // Save the new student record to the database
        await newStudent.save();

        return res.status(200).json({
          Success: true,
          SuccessMessage: "Account created successfully.",
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
