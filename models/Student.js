import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  batch: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  enrollmentNumber: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
