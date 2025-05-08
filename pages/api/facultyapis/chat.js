import connectDb from "@/middleware/mongoose";
import Course from "@/models/Course";
import Faculty from "@/models/Faculty";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    console.log("Invalid Method:", req.method);
    return res.status(405).json({ Success: false, ErrorMessage: "Method Not Allowed" });
  }

  try {
    const { query, token } = req.body;
    console.log("Received query:", query);
    console.log("Received token:", token);

    if (!token) return res.status(401).json({ Success: false, ErrorMessage: "Token missing" });

    const data = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET3);
    // console.log("Decoded JWT data:", data);

    const faculty = await Faculty.findOne({ email: data.email });
    // console.log("Found faculty:", faculty);

    if (!faculty) {
      // console.error("Faculty not found for email:", data.email);
      return res.status(401).json({ Success: false, ErrorMessage: "Unauthorized access" });
    }

    const courses = await Course.find({ courseFacultyId: faculty._id });
    // console.log("Courses found:", courses.length);

    let enrichedCourses = [];
    for (let course of courses) {
      enrichedCourses.push({
        courseCode: course.courseCode,
        courseName: course.courseName,
        attendanceStatusofStudents: course.attendanceStatusofStudents,
      });
    }

    const context = `
You are a helpful assistant for a faculty member. Respond only in English.
Faculty name: ${faculty.name}
Department: ${faculty.department}
Query: "${query}"
Here is the course and attendance data in JSON format:

${JSON.stringify(enrichedCourses, null, 2)}

Interpret the user query and reply with attendance insights based on course name, code, enrollment number, date range, etc. 
If data is missing, say "Attendance data not found for given criteria."
`;

    // console.log("Context prepared for OpenRouter:", context);

    const completion = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-distill-llama-70b:free",
        messages: [
          { role: "system", content: "You are a helpful AI assistant for faculty attendance queries." },
          { role: "user", content: context },
        ],
        temperature: 0.3,
        stream: false,
      }),
    });

    // console.log("Waiting for AI response...");

    let result;
    try {
      result = await completion.json();
    } catch (parseError) {
      console.error("Failed to parse OpenRouter JSON response:", parseError);
      const rawText = await completion.text();
      console.error("Raw response:", rawText);
      return res.status(500).json({ Success: false, ErrorMessage: "Invalid AI response format." });
    }

    console.log("AI result:", JSON.stringify(result, null, 2));

    const fullMessage = result?.choices?.[0]?.message;
    // console.log("Full AI message object:", fullMessage);

    const responseText = fullMessage?.content;

    if (!responseText) {
      // console.error("Missing responseText in AI response");
      return res.status(500).json({ Success: false, ErrorMessage: "AI response failed." });
    }

    // console.log("Final AI response text:", responseText);

    return res.status(200).json({ Success: true, response: responseText });
  } catch (error) {
    console.error("Chat API Error:", error);

    if (error?.response) {
      try {
        const errData = await error.response.text();
        console.error("OpenRouter Response Error:", errData);
      } catch (errTextParseErr) {
        console.error("Failed to read OpenRouter error response:", errTextParseErr);
      }
    }

    if (error?.stack) {
      console.error("Stack Trace:", error.stack);
    }

    if (error?.message) {
      console.error("Error Message:", error.message);
    }

    return res.status(500).json({
      Success: false,
      ErrorMessage: error.message || "Internal Server Error",
    });
  }
};

export default connectDb(handler);
