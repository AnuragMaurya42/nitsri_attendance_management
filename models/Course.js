import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    courseFaculty: { type: String },
    courseFacultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },

    // NEW FIELD: List of student enrollment numbers enrolled in this course
    students: [
      {
        enrollmentNumber: { type: String, required: true },
        name: String,
        email: String,
        batch: String,
        // Add more fields if needed
      },
    ],


    attendanceStatusofStudents: [
      {
        date: { type: Date, required: true },
        classDuration: {
          type: String,
          enum: ["1", "2"],
          required: true,
        },
        attendances: [
          {
            studentName: { type: String, required: true },
            studentEnrollment: { type: String, required: true },
            totalPresents: {
              type: Number,
              enum: [0, 1, 2],
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
