import Student from "@/models/Student";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { email, department, batch } = req.body;

      if (!email) {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "Email is required!",
        });
      }

      // Prepare update fields only if they exist in the request
      const updateFields = {};
      if (department) updateFields.department = department;
      if (batch) updateFields.batch = batch;

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({
          Success: false,
          ErrorCode: 400,
          ErrorMessage: "At least one field (department or batch) must be provided for update!",
        });
      }

      const updatedStudent = await Student.findOneAndUpdate(
        { email },
        updateFields,
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({
          Success: false,
          ErrorCode: 404,
          ErrorMessage: "Student not found!",
        });
      }

      return res.status(200).json({
        Success: true,
        message: `Student updated successfully for email: ${email}`,
        student: updatedStudent,
      });
    } catch (error) {
      return res.status(500).json({
        Success: false,
        ErrorCode: 500,
        ErrorMessage: error.message,
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
