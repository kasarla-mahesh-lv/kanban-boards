const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password:hashedPassword,
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

exports.login=async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message:"Email and password are required"})
        }

        const user=await User.findOne({email});
        if (!user) {
          return res.status(400).json({ message: "Invalid email" });
}

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) {
            return res.status(400).json({message:"Invalid password, please type valid password"});
        }

        const token = jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );

        res.status(200).json({message:"Login successful",token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        });
    }catch(error){
        res.status(500).json({message:"please do Register first"});
    }
};