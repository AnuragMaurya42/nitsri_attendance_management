import mongoose from 'mongoose';

// Define the schema for Faculty
const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  email_verified: { type: Boolean, default: false },
  verification_code: { type: String },
  password: { type: String },
}, { timestamps: true });

const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);

export default Faculty;
