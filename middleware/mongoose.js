import mongoose from "mongoose";

const connectDb = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }

  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URL); // No options needed in Mongoose 6+
    console.log("MongoDB connected successfully");
    return handler(req, res);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return res.status(500).json({ error: "Failed to connect to MongoDB database" });
  }
};

export default connectDb;
