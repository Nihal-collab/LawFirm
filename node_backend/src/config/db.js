const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.ATLAS_MONGO_URI;
    if (!mongoUri) {
      throw new Error(
        "MongoDB URI is missing. Please set MONGO_URI or ATLAS_MONGO_URI in your .env file."
      );
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Database connection error:", err.message || err);
    process.exit(1);
  }
};

module.exports = connectDB;