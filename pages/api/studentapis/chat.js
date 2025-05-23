import connectDb from "@/middleware/mongoose";
import Course from "@/models/Course";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  console.log("Request received:", req.method, req.body);

  if (req.method !== "POST") {
    console.log("Invalid method, only POST allowed");
    return res.status(405).json({ Success: false, ErrorMessage: "Method Not Allowed" });
  }

  try {
    const { query, token } = req.body;

    console.log("Received query:", query);
    console.log("Received token:", token);

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ Success: false, ErrorMessage: "Token missing" });
    }

    const data = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET3);
    console.log("Decoded JWT data:", data);

    const student = await Student.findOne({ email: data.email });
    if (!student) {
      console.log("Student not found with email:", data.email);
      return res.status(401).json({ Success: false, ErrorMessage: "Unauthorized access" });
    }
    console.log("Student found:", student);

    const courseCodes = student.enrolledCourses?.map((c) => c.courseCode) || [];
    console.log("Student enrolled courses codes:", courseCodes);

    const courses = await Course.find({ courseCode: { $in: courseCodes } });
    console.log(`Found ${courses.length} courses for the student`);

    // Check if query is about DBMS attendance
    const isDBMSQuery = query.toLowerCase().includes("dbms");

    let detailedDBMSAttendance = null;

    // Prepare enrichedCourses and attendanceSummary for all courses
    let enrichedCourses = [];
    let attendanceSummary = [];

    for (let course of courses) {
      console.log(`Processing course: ${course.courseCode} - ${course.courseName}`);

      if (!course.attendanceStatusofStudents || !Array.isArray(course.attendanceStatusofStudents)) {
        console.log(`No attendance data for course ${course.courseCode}`);
        continue;
      }

      let dayWiseAttendance = [];
      let totalPossible = 0;
      let totalAttended = 0;

      course.attendanceStatusofStudents.forEach((record) => {
        const studentRecord = record.attendances.find(
          (att) => att.studentEnrollment === student.enrollmentNumber
        );
        if (studentRecord) {
          dayWiseAttendance.push({
            date: record.date,
            classDuration: record.classDuration || "N/A",
            totalPresents: studentRecord.totalPresents,
          });
          const classDur = Number(record.classDuration);
          totalPossible += isNaN(classDur) ? 0 : classDur;
          totalAttended += studentRecord.totalPresents;
        }
      });

      if (dayWiseAttendance.length === 0) {
        console.log(`No attendance records found for student in course ${course.courseCode}`);
        continue;
      }

      const attendancePercent = totalPossible
        ? ((totalAttended / totalPossible) * 100).toFixed(2)
        : "N/A";
      const totalClasses = dayWiseAttendance.length;

      attendanceSummary.push({
        courseName: course.courseName,
        courseCode: course.courseCode,
        totalClasses,
        totalPossible,
        totalAttended,
        attendancePercent,
      });

      enrichedCourses.push({
        courseCode: course.courseCode,
        courseName: course.courseName,
        teacher: course.teacherName || "N/A",
        semester: course.semester || "N/A",
        credits: course.credits || "N/A",
        dayWiseAttendance,
        totalClasses,
        totalPossible,
        totalAttended,
        attendancePercent,
      });

      console.log(`Summary for course ${course.courseCode}: Attendance ${attendancePercent}%`);

      // Prepare detailed DBMS attendance if course matches
      if (
        isDBMSQuery &&
        (course.courseCode.toLowerCase() === "dbms" ||
          course.courseName.toLowerCase().includes("dbms"))
      ) {
        detailedDBMSAttendance = {
          courseCode: course.courseCode,
          courseName: course.courseName,
          dayWiseAttendance,
        };
      }
    }

    // If query asks for DBMS details, send day-wise attendance for DBMS
    if (isDBMSQuery) {
      if (detailedDBMSAttendance && detailedDBMSAttendance.dayWiseAttendance.length > 0) {
        const dayWiseDetails = detailedDBMSAttendance.dayWiseAttendance
          .map(
            (d) =>
              `Date: ${d.date}, Duration: ${d.classDuration}, Present: ${d.totalPresents}`
          )
          .join("\n");

        return res.status(200).json({
          Success: true,
          response: `Detailed Attendance for DBMS:\n${dayWiseDetails}`,
        });
      } else {
        return res.status(200).json({
          Success: true,
          response: "Attendance data not found for DBMS.",
        });
      }
    }

    // If not DBMS query, send full summary as before
    const summaryString = attendanceSummary
      .map(
        (s) =>
          `${s.courseName} (${s.courseCode}): Attended ${s.totalAttended}/${
            s.totalPossible
          }, Attendance: ${s.attendancePercent}%`
      )
      .join("\n");

    console.log("Final attendance summary string:", summaryString);

    const context = `
You are a helpful assistant for a faculty member. Respond only in English.

Student Information:
Name: ${student.name}
Department: ${student.department}
Enrollment No: ${student.enrollmentNumber}
Email: ${student.email}
Semester: ${student.semester || "N/A"}
Phone: ${student.phone || "N/A"}

Query: "${query}"

Detailed course and attendance information in JSON format:
${JSON.stringify(enrichedCourses, null, 2)}

Summary attendance per course:
${summaryString}

Interpret the user query and provide attendance insights based on course name, code, enrollment number, specific dates, or other criteria. If data is missing, respond with "Attendance data not found for given criteria."
`;

    console.log("Context built for AI:\n", context);

    // Simulate AI response
    const simulatedAIResponse = `You asked: "${query}". Here is your attendance summary:\n${summaryString}`;

    console.log("Sending response:", simulatedAIResponse);

    return res.status(200).json({
      Success: true,
      response: simulatedAIResponse,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({
      Success: false,
      ErrorMessage: error.message || "Internal Server Error",
    });
  }
};

export default connectDb(handler);
