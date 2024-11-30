
import Faculty from "@/models/Faculty";  
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
    const { dept } = req.query;  
    if (req.method === 'GET') {  
        if (!dept) {
            return res.status(400).json({
                Success: false,
                ErrorCode: 400,
                ErrorMessage: "Department is required!"
            });
        }

        try {
            const faculties = await Faculty.find({ department: dept });

            if (faculties.length === 0) {
                return res.status(404).json({
                    Success: false,
                    ErrorCode: 404,
                    ErrorMessage: "No faculty found for this department!"
                });
            }

            return res.status(200).json({
                Success: true,
                SuccessMessage:"Faculites list fetched successfully",
                faculties: faculties
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
