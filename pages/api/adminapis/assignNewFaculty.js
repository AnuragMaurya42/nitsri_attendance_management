import Course from "@/models/Course";
import Faculty from "@/models/Faculty";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { courseId, facultyId } = req.body;

        try {
            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({
                    Success: false,
                    ErrorCode: 404,
                    ErrorMessage: "Course not found!"
                });
            }

            course.courseFacultyId = facultyId || null;  
            course.courseFaculty = facultyId ? (await Faculty.findById(facultyId)).name : "Not Assigned"; 

            await course.save();

            return res.status(200).json({
                Success: true,
                SuccessMessage: "Faculty assigned successfully",
            });
        } catch (error) {
            return res.status(500).json({
                Success: false,
                ErrorCode: 500,
                ErrorMessage: error.message
            });
        }
    } else {
        return res.status(405).json({
            Success: false,
            ErrorCode: 405,
            ErrorMessage: "Method Not Allowed!"
        });
    }
};

export default connectDb(handler);
