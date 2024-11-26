import mongoose from "mongoose";

const connectDb = (handler) => async (req, res) => {
    if (mongoose.connections[0].readyState) {
        return handler(req, res);
    }

    try {
        await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
        return handler(req, res);
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        res.status(500).json({ error: "Failed to connect to mongoDB database" });
    }
}

export default connectDb;
