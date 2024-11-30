import Faculty from "@/models/Faculty";
import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { _id } = req.body;  

        try {
            if (!_id) {
                throw new Error("Faculty ID is Missing!");
            }

            const faculty = await Faculty.findById(_id);

            if (!faculty) {
                return res.status(404).json({ Success: false, ErrorCode: 404, ErrorMessage: "Faculty not found!" });
            }

            const courses = await Course.find({ courseFacultyId: _id });

            return res.status(200).json({
                Success: true,
                SuccessMessage: "Courses retrieved successfully",
                courses: courses
            });
        } catch (error) {
            return res.status(500).json({ Success: false, ErrorCode: 500, ErrorMessage: error.message });
        }
    } else {
        return res.status(405).json({ Success: false, ErrorCode: 405, ErrorMessage: "Method Not Allowed!" });
    }
};

export default connectDb(handler);
