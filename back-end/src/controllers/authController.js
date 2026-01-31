const User = require("../models/User");
//const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { name, email, password ,mobilenumber} = req.body;

    if (!name || !email || !password || !mobilenumber) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Hash password
    //const salt = await bcrypt.genSalt(10);
    //const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password,
      mobilenumber
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};