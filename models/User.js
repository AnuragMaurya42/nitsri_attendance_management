import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema({
  message: { type: String, required: true },
}, { _id: false, timestamps: true });

const marksHistorySchema = new Schema({
  resultDate: { type: Date, required: true },
  subject: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  outOf: { type: Number, required: true },
  rank: { type: Number }
}, { _id: false }); 

const userSchema = new Schema({
  img: {type:String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dob: { type: Date },
  class: { type: String, enum: ["IX", "X", "XI", "XII"] },
  previous_class_percentage: { type: Number },
  address: { type: String },
  contact_number: { type: Number },
  father_name: { type: String },
  mother_name: { type: String },
  guardian_name: { type: String },
  guardian_contact_number: { type: Number },
  pincode: { type: Number },
  school_name: { type: String },
  school_address: { type: String },
  alternate_contact_number: { type: Number },
  is_approved: { type: Boolean, default: false },
  email_verified: { type: Boolean, default: false },
  entries_entered: { type: Boolean, default: false },
  feedbackSubmitted:{type:Boolean,default:false},
  notifications: [notificationSchema],
  verification_code: { type: Number },
  marksHistory: [marksHistorySchema],
  feeHistory: [
    {
      month: { type: String, enum: ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'] },
      status: { type: String, enum: ['due', 'paid'] },
      paymentDate: { type: Date },
      amountPaid: { type: Number },
      modeOfPayment: { type: String, default: 'CASH' }
    }
  ]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User
