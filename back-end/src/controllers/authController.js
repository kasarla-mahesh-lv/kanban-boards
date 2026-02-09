const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OtpUser=require("../models/OTPModel");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  try {
    const { name, email, password, mobilenumber, otp } = req.body;

    // STEP 1 — If OTP not provided → send OTP
    if (!otp) {

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // store temp data
      await OtpUser.findOneAndUpdate(
        { email },
        {
          name,
          email,
          password: hashedPassword,
          mobilenumber,
          otp: generatedOtp,
          otpExpiry: new Date(Date.now() + 5 * 60 * 1000)
        },
        { upsert: true }
      );

      // send mail
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
        subject: "Your OTP Code",
        text: `Your OTP is ${generatedOtp}`
      });

      return res.json({ message: "OTP sent to email" });
    }

    // STEP 2 — OTP provided → verify and create account
    const tempUser = await OtpUser.findOne({ email });

    if (!tempUser)
      return res.status(400).json({ message: "Please request OTP first" });

    if (tempUser.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (tempUser.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    await UserModel.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      mobilenumber: tempUser.mobilenumber
    });

    await OtpUser.deleteOne({ email });

    res.json({ message: "Registered successfully" });

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