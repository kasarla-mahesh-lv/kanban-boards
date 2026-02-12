const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail");
const {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require("../validators/authValidator");

exports.register = async (req,res)=>{
try{

     const { error } = registerSchema.validate(req.body);
     if (error)
        return res.status(400).json({ message: error.details[0].message });
     const { name, email, password, mobilenumber } = req.body;

      // 🔥 FETCH USER FIRST
     let user = await UserModel.findOne({ email });

    // already verified user
    if(user && user.isVerified)
        return res.status(400).json({message:"User already registered, please login"});

    // generate OTP
    const otp = Math.floor(100000 + Math.random()*900000).toString();
    const expiry = new Date(Date.now()+2*60*1000);

    const hashedPassword = await bcrypt.hash(password,10);

    // create or update temp user
    user = await UserModel.findOneAndUpdate(
        {email},
        {
            name,
            password:hashedPassword,
            mobilenumber,
            otp,
            expiresAt:expiry,
            isVerified:false
        },
        {upsert:true,new:true}
    );

    // send mail
    await sendMail(
    email,
    "OTP Verification",
    `Welcome to Luvetha Tech Solutions
    Your OTP is ${otp}`
);

    res.status(200).json({message:"OTP sent to email"});

}catch(error){
    res.status(500).json({message:error.message});
}
};


 exports.verifyOtp = async (req,res)=>{
try{


    const { error } = verifyOtpSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });
    const { email, otp } = req.body;

    const user = await UserModel.findOne({email});

    if(!user)
        return res.status(400).json({message:"User not found"});

    if(!user.otp || !user.expiresAt)
        return res.status(400).json({message:"Please request OTP first"});

    if(user.expiresAt < Date.now())
        return res.status(400).json({message:"OTP expired"});

    if(user.otp !== otp)
        return res.status(400).json({message:"Invalid OTP"});

    // SUCCESS → ACTIVATE ACCOUNT
    user.isVerified = true;
    user.otp = null;
    user.expiresAt = null;

    await user.save();

    res.status(200).json({
        message:"User Registered Succesfully 🙏🤝",
        userId:user._id
    });
    console.log("User Registered Succesfully 🙏🤝")

}catch(error){
    res.status(500).json({message:error.message});
}
};



exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log("Invalid email");
      return res.status(400).json({ message: "Invalid email 📩" });
    }
 
    if(!user.isVerified){
        return res.status(401).json({
            message:"Please verify OTP before login"
        });
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

    const userData = await UserModel.findById(user._id);
    userData.tokens.push({ token });
    await userData.save();
    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(200).json({
      message: "Login Successful 🤝👍",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    console.log("Login Successful 🤝👍");

  } catch (error) {
    console.log(error,"----------------");
    
    res.status(500).json({ message: error.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error)
       return res.status(400).json({ message: error.details[0].message });
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 2 * 60 * 1000);

    user.otp = otp;
    user.expiresAt = expiry;
    await user.save();

    // send mail
    await sendMail(
    email,
    "Password Reset OTP",
    `Your password reset OTP is ${otp}`
);

    res.status(200).json({ message: "Reset OTP sent to email" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.resetPassword = async (req, res) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error)
       return res.status(400).json({ message: error.details[0].message });
    const { email, otp, newPassword } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.expiresAt)
      return res.status(400).json({ message: "Please request OTP first" });

    if (user.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // clear otp
    user.otp = null;
    user.expiresAt = null;

    await user.save();

    res.status(200).json({ message: "Password reset successful 🎉" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
