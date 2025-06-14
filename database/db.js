import mongoose from "mongoose";
export const connectDB = async () => {
  try{
    await mongoose.connect(process.env.DB)
      console.log("MongoDB connected");
  }catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}