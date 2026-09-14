import mongoose from "mongoose";
import config from "../config/config.js";


/**
 * @Name : connectDb
 * @param : None
 * @description :
 * Establishes a connection between the Skillio backend and MongoDB
 * using the MongoDB connection URI provided through environment variables.
 * Terminates the application if the database connection fails during startup.
 */

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(config.MONGO_URI);
        console.log("Mongo DB connected !! DB host :", connectionInstance.connection.host);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}

export default connectDb;