const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.register = async (req,res)=>{
try{

    const {name,email,password,mobilenumber} = req.body;

    if(!name || !email || !password || !mobilenumber)
        return res.status(400).json({message:"All fields required"});

    //  length check
    if(password.length < 8 || password.length > 8 ){
       return res.status(400).json({
        message:"Password must be 8 characters long"
    });
    }

    //  first letter capital check
    const firstChar = password[0];
    if(firstChar !== firstChar.toUpperCase()){
        return res.status(400).json({
        message:"Password must start with a capital letter"
    });
    }

    //  special character check
    const specialChars = "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?";
    let hasSpecialChar = false;

    for(let i = 0; i < password.length; i++){
    if(specialChars.includes(password[i])){
        hasSpecialChar = true;
        break;
    }
   }

   if(!hasSpecialChar){
        return res.status(400).json({
        message:"Password must contain at least one special character"
    });
    }

    if(String(mobilenumber).length !== 10)
        return res.status(400).json({message:"Invalid mobile number📱, please enter 10 digit mobilenumber"});

    let user = await UserModel.findOne({email});

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
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        },
        tls:{rejectUnauthorized:false}
    });

    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"OTP Verification",
        text:`Your OTP is ${otp}`
    });

    res.status(200).json({message:"OTP sent to email"});

}catch(error){
    res.status(500).json({message:error.message});
}
};


 exports.verifyOtp = async (req,res)=>{
try{

    const {email,otp} = req.body;

    if(!email || !otp)
        return res.status(400).json({message:"Email and OTP required"});

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
    console.log(res,"User Registered Succesfully 🙏🤝")

}catch(error){
    res.status(500).json({message:error.message});
}
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required 📩" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log(res,"Invalid email");
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

    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(200).json({
      message: "Login Successful 🤝👍",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    console.log(res,"Login Successful 🤝👍");

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};