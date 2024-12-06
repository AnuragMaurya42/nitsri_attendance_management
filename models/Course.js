import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    courseFaculty: { type: String },
    courseFacultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    attendanceStatusofStudents: [
      {
        date: { type: Date, required: true },
        classDuration: {
          type: String,
          enum: ["1", "2"], // 1-hour or 2-hour class
          required: true,
        },
        attendances: [
          {
            studentName: { type: String, required: true },
            studentEnrollment: { type: String, required: true },
            totalPresents: {
              type: Number,
              enum: [0, 1, 2], // 0 = Absent, 1 = Present, 2 = Excused
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
