import mongoose from "mongoose";

const databaseConnection = async (DATABASE_URL, DATABASE_NAME) => {
  try {
    console.log("🔌 Connecting to DB...");
    console.log("👉 URL:", DATABASE_URL);
    console.log("👉 DB NAME:", DATABASE_NAME);

    let finalUrl = DATABASE_URL;

    if (!DATABASE_URL.includes(".net/") || DATABASE_URL.endsWith(".net/")) {
      if (DATABASE_NAME) {
        finalUrl = `${DATABASE_URL}/${DATABASE_NAME}`;
      }
    }

    await mongoose.connect(finalUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database Connected Successfully...");
  } catch (error) {
    console.log("❌ Database Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

export default databaseConnection;