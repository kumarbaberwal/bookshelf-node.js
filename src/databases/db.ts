import mongoose from "mongoose"
import { ENV_VARS } from "../configs/config"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error Connecting to monogoDB: ${error}`);
        process.exit(1);
    }
}