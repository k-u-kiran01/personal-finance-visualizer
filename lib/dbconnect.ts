import mongoose from "mongoose";

const db_url = process.env.MONGODB_URI as string;

if (!db_url) {
  throw new Error("MONGODB_URI is not defined");
}

const connectDB = async () => {
  try {
    await mongoose.connect(db_url);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;