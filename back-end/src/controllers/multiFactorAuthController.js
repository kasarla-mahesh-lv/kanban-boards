const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const LoginOtp = require("../models/LoginOtpModel");
const nodemailer = require("nodemailer");

// ✅ create transporter once
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// ✅ STEP-1: password ok -> send OTP
exports.loginSendOtp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // ✅ generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // ✅ save/update OTP for this email
    await LoginOtp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // ✅ send OTP to USER email (IMPORTANT)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Login OTP",
      text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
    });

    return res.json({ message: "OTP sent for login", otpRequired: true, email });
  } catch (error) {
    console.log("LOGIN OTP MAIL ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ STEP-2: verify OTP -> issue JWT token
exports.verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and otp are required" });

    const record = await LoginOtp.findOne({ email });
    if (!record) return res.status(400).json({ message: "OTP not requested" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // ✅ OTP success -> delete record
    await LoginOtp.deleteOne({ email });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // if your schema has tokens array, keep your same logic
    if (user.tokens && Array.isArray(user.tokens)) {
      user.tokens.push({ token });
      await user.save();
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
