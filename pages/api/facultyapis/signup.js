import Faculty from "@/models/Faculty";
import connectDb from "@/middleware/mongoose";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { name, department, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !department || !email || !password) {
      return res.status(400).json({
        Success: false,
        ErrorCode: 400,
        ErrorMessage: "All fields are required.",
      });
    }

    try {
      // Check if the faculty already exists
      const existingFaculty = await Faculty.findOne({ email });

      if (existingFaculty) {
        return res.status(409).json({
          Success: false,
          ErrorCode: 409,
          ErrorMessage: "Email already registered.",
        });
      } else {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new faculty record
        const newFaculty = new Faculty({
          name,
          department,
          email,
          password: hashedPassword, // Save the hashed password
        });

        // Save the new faculty record to the database
        await newFaculty.save();

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