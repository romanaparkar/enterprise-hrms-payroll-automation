import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);

    process.exit(1);
  }
};

export default connectDB;