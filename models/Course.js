import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    courseFaculty: { type: String }, 
    courseFacultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }, 
    attendanceStatusofStudents: [
      {
        studentName: { type: String, required: true },
        enrollmentNumber: { type: String, required: true },
        attendance: [
          {
            date: { type: Date, required: true },
            status: { type: String, enum: ["Present", "Absent"], required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
