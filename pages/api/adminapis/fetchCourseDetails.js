
import Course from "@/models/Course";  
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
    const { id } = req.query;  

    if (req.method === 'GET') {  
        if (!id) {
            return res.status(400).json({
                Success: false,
                ErrorCode: 400,
                ErrorMessage: "Course ID is required!"
            });
        }

        try {
            const course = await Course.findById(id);  

            if (!course) {
                return res.status(404).json({
                    Success: false,
                    ErrorCode: 404,
                    ErrorMessage: "Course not found!"
                });
            }

            return res.status(200).json({
                Success: true,
                SuccessMessage:"Course Details fetched successfully",
                course
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
