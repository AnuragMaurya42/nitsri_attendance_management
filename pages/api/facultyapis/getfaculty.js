import Faculty from "@/models/Faculty";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const jwt = require('jsonwebtoken');
        const {token} = req.body;

        try {
            if (!token) {
                throw new Error("Token is Missing!");
            }

            const data = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET3);
            const user = await Faculty.findOne({ email: data.email });

            if (!user) {
                return res.status(404).json({ Success: false, ErrorCode: 404, ErrorMessage: "Unauthorized Access!" });
            } else {
                return res.status(200).json({ Success: true, user: user });
            }
        } catch (error) {
            return res.status(401).json({ Success: false, ErrorCode: 401, ErrorMessage: error.message });
        }
    } else {
        return res.status(405).json({ Success: false, ErrorCode: 405, ErrorMessage: "Method Not Allowed!" });
    }
}

export default connectDb(handler);
