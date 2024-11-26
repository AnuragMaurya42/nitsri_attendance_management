import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Password is required
}, { timestamps: true });

const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);

export default Faculty;
