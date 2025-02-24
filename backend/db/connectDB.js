const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const DB_CONNECTION = process.env.MONGO_URI ?? "Not Connect";

const DBConnection = async () => {
  try {
    await mongoose.connect(DB_CONNECTION); 
    console.log("✅ DB connected, you can start storing data");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    throw err;
  }
};

module.exports = { DBConnection };
