import mongoose from "mongoose";

const databaseConnection = async (DATABASE_URL) => {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("Database Connected Successfully...");
    } catch (error) {
        console.log("Database Connection Failed");
        console.error(error);
    }
}

export default databaseConnection;