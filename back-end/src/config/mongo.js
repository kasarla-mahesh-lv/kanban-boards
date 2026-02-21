
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Mongo Connected");
    console.log("👉 DB Name:", mongoose.connection.name);   // 👈 ADD THIS
  } catch (err) {
    console.error("❌ DB error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;