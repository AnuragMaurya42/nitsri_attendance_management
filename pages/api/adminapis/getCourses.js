import Course from "@/models/Course";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const courses = await Course.find({});
            return res.status(200).json({ Success: true, courses });
        } catch (error) {
            return res.status(500).json({ Success: false, ErrorCode: 500, ErrorMessage: error.message });
        }
    } else {
        return res.status(405).json({ Success: false, ErrorCode: 405, ErrorMessage: "Method Not Allowed!" });
    }
};

export default connectDb(handler);
