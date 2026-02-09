const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp=require("../models/OTPModel");
const nodemailer = require("nodemailer");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email required" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiry 5 mins
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // Save in DB (overwrite old OTP)
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt: expiry },
      { upsert: true, new: true }
    );

    // Mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email });

    if (!record)
      return res.status(400).json({ message: "OTP not requested" });

    if (record.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // success → delete OTP
    await Otp.deleteOne({ email });

    res.json({ message: "OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.register = async (req, res) => {
  try {
    const { name, email, password, mobilenumber } = req.body;

    if (!name || !email || !password || !mobilenumber)
      return res.status(400).json({ message: "All fields required" });

    // Check OTP verified or not
    const otpRecord = await Otp.findOne({ email });

    if (otpRecord)
      return res.status(400).json({ message: "Please verify OTP first" });

    // Check existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      mobilenumber
    });

    res.status(201).json({
      message: "Registered successfully",
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.tokens.push({ token });
    await user.save();

    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};