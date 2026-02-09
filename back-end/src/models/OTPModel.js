const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  mobilenumber: Number,
  otp: String,
  otpExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model("OtpUser", otpSchema);
