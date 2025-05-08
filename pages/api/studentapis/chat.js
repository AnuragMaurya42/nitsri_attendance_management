import connectDb from "@/middleware/mongoose";
import Course from "@/models/Course";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";

// Helper function to call OpenRouter
const getOpenRouterResponse = async (prompt) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // Replace with your site URL in production
        "X-Title": "NIT Attendance Chatbot"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-distill-llama-70b:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });




    const data = await response.json();
    if (
      data &&
      data.choices &&
      data.choices.length > 0 &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return data.choices[0].message.content.trim();
    } else {
      return "I'm sorry, I couldn't generate a response right now.";
    }
  } catch (err) {
    console.error("OpenRouter error:", err.message || err);
    return "I'm facing issues connecting to AI. Please try again later.";
  }
};











const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  const { message, token } = req.body;
  if (!token) return res.status(401).json({ reply: "Unauthorized: Token missing." });



  
  try {
    const data = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET3);
    const student = await Student.findOne({ email: data.email });
    if (!student) return res.status(404).json({ reply: "Unauthorized: Student not found." });

    const enrollmentNumber = student.enrollmentNumber;
    const name = student.name;
    const email = student.email;
    const msg = message.toLowerCase().trim();
    let reply = "I'm sorry, I didn't quite understand that. Could you please rephrase?";
    let percentageData = null;

    const allCourses = await Course.find();
    const studentCourses = allCourses.filter((course) =>
      course.attendanceStatusofStudents.some((record) =>
        record.attendances.some((a) => a.studentEnrollment === enrollmentNumber)
      )
    );

    const getAttendanceDetails = (course) => {
      let totalScheduledHours = 0;
      let attendedHours = 0;
      for (const record of course.attendanceStatusofStudents) {
        const studentAttendance = record.attendances.find(
          (a) => a.studentEnrollment === enrollmentNumber
        );
        if (studentAttendance) {
          const duration = parseInt(record.classDuration, 10) || 1;
          totalScheduledHours += duration;
          attendedHours += studentAttendance.totalPresents;
        }
      }
      const percentage = totalScheduledHours > 0
        ? Math.round((attendedHours / totalScheduledHours) * 100)
        : 0;
      return {
        courseCode: course.courseCode,
        courseName: course.courseName,
        totalScheduledHours,
        attendedHours,
        percentage,
      };
    };

    // Predefined responses
    if (msg === "hi" || msg === "hello" || msg === "hey") {
      reply = "Hello there! How may I assist you today?";
    } else if (msg.includes("how are you") || msg.includes("kaise ho")) {
      reply = "I'm functioning perfectly, thank you! How are you?";
    } else if (msg.includes("thank")) {
      reply = "You're welcome! Let me know how else I can help.";
    } else if (msg === "help") {
      reply = `I can help you with:
• Checking attendance
• Listing enrolled courses
• Getting your enrollment details
• Generating a study plan for a subject (e.g., "detail of DBMS")`;
    } else if (msg.includes("what can you do") || msg.includes("kya kar sakte ho")) {
      reply = `I can assist you with:
• Your attendance details
• Courses you're enrolled in
• Personal student info
• Study planner for a subject (like DBMS or AI)`;
    }

    // General attendance
    else if (msg.includes("attendance") && !msg.match(/(in|of)\s+\w+/)) {
      if (!studentCourses.length) {
        reply = "No attendance records found for you.";
      } else {
        const details = studentCourses.map(getAttendanceDetails);
        reply = "Your attendance summary:\n\n" + details
          .map(d => `${d.courseCode} (${d.courseName}): ${d.attendedHours}/${d.totalScheduledHours} hours, ${d.percentage}%`)
          .join("\n\n");
        percentageData = details;
      }
    }

    // Specific subject attendance
    else if (
      msg.includes("attendance") &&
      (msg.match(/\b(in|of|me|mai|maii|mee)\s+([\w\s]+)/) ||
       msg.match(/([\w\s]+)\s+(me|mai|maii|mee)\s+attendance/))
    ) {
      let match = msg.match(/\b(in|of|me|mai|maii|mee)\s+([\w\s]+)/);
      if (!match) match = msg.match(/([\w\s]+)\s+(me|mai|maii|mee)\s+attendance/);

      if (match) {
        const queryCourse = (match[2] || match[1]).trim().toLowerCase();
        const course = studentCourses.find(
          (c) => c.courseName.toLowerCase().includes(queryCourse) ||
                 c.courseCode.toLowerCase() === queryCourse
        );

        if (!course) {
          reply = `No course matched "${queryCourse}".`;
        } else {
          const d = getAttendanceDetails(course);
          reply = `Attendance for ${d.courseCode} (${d.courseName}): ${d.attendedHours}/${d.totalScheduledHours} hours, ${d.percentage}%`;
        }
      } else {
        reply = "Please specify the course name for attendance.";
      }
    }

    // Subject detail or timetable planner
    else if (msg.includes("detail of") || msg.includes("time table") || msg.includes("study plan")) {
      const prompt =
        `A student asked: "${message}".
Please provide a detailed study plan or subject topic breakdown (like for DBMS, AI, etc.).
It should include main topics, suggested study time, and helpful tips.
Example output:
- Subject: DBMS
- Topics:
  1. ER Diagrams (2 hours)
  2. Relational Model (3 hours)
  3. SQL Queries (4 hours)
- Tips: Start with concepts, practice queries, revise from university notes.

Respond in bullet points and clear English.`;
      reply = await getOpenRouterResponse(prompt);
    }

    // Courses enrolled
    else if (msg.includes("course") || msg.includes("subject")) {
      if (!studentCourses.length) {
        reply = "You are not enrolled in any courses currently.";
      } else {
        const courseNames = studentCourses.map(c => `${c.courseCode} - ${c.courseName}`);
        reply = `Your enrolled courses:\n${courseNames.join("\n")}`;
      }
    }

    // Student info
    else if (msg.includes("name") || msg.includes("naam")) {
      reply = `Your name is ${name}.`;
    } else if (msg.includes("enroll")) {
      reply = `Your enrollment number is ${enrollmentNumber}.`;
    } else if (msg.includes("email") || msg.includes("mail") || msg.includes("gmail")) {
      reply = `Your registered email is ${email}.`;
    } else if (msg.includes("password")) {
      reply = "For security reasons, I can't share your password. Please use 'Forgot Password' option.";

    // Fallback to OpenRouter AI
    } else {
      const guidePrompt = `A student asked: "${message}".
Respond helpfully based on academic context, attendance, subjects, or general support.`;
      reply = await getOpenRouterResponse(guidePrompt);
    }

    return res.status(200).json({ reply, percentageData });

  } catch (err) {
    console.error("Server error:", err.message || err);
    return res.status(500).json({ reply: "Server Error: " + (err.message || "Unknown") });
  }
};

export default connectDb(handler);
