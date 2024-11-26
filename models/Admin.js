import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passcode: { type: String, required: true },
    adminName: { type: String, required: true },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;