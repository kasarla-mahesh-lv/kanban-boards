const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail");
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

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

    if (user && user.isVerified !== false)
    return res.status(400).json({ message: "User already registered, please login" });

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

   res.status(200).json({
  message: "OTP sent to email",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role   // ✅ add
  }
});


}catch(error){
    res.status(500).json({message:error.message});
}
};


 exports.verifyOtp = async (req, res) => {
  try {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, otp, type = "register" } = req.body; // ✅ type added

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // ✅ REGISTER OTP verify
    if (type === "register") {
      if (!user.otp || !user.expiresAt)
        return res.status(400).json({ message: "Please request OTP first" });

      if (user.expiresAt < Date.now())
        return res.status(400).json({ message: "OTP expired" });

      if (user.otp !== otp)
        return res.status(400).json({ message: "Invalid OTP" });

      user.isVerified = true;
      user.otp = null;
      user.expiresAt = null;
      await user.save();

      return res.status(200).json({
        message: "User Registered Successfully 🙏🤝",
        userId: user._id
      });
    }

    // ✅ LOGIN OTP verify → return token here only
    if (type === "login") {
      if (!user.loginOtp || !user.loginOtpExpiresAt)
        return res.status(400).json({ message: "Please login first to get OTP" });

      if (user.loginOtpExpiresAt < Date.now())
        return res.status(400).json({ message: "OTP expired" });

      if (user.loginOtp !== otp)
        return res.status(400).json({ message: "Invalid OTP" });

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // clear login otp
      user.loginOtp = null;
      user.loginOtpExpiresAt = null;
      await user.save();

      const userData = await UserModel.findById(user._id);
      userData.tokens.push({ token });
      await userData.save();

      res.setHeader("Authorization", `Bearer ${token}`);

      return res.status(200).json({
        message: "Login OTP verified ✅",
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }

    // safety
    return res.status(400).json({ message: "Invalid type" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email 📩" });


    if (user?.isVerified === false) {
      return res.status(401).json({ message: "Please verify OTP before login" });
    }

    if (user?.isVerified === undefined) {
       user.isVerified = true;
      await user.save();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        // ✅ ✅ MAIN CHANGE: If MFA is OFF => direct token => dashboard
    if (!user.mfaEnabled) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      user.tokens.push({ token });
      await user.save();
      res.setHeader("Authorization", `Bearer ${token}`);



      return res.status(200).json({
        message: "Login success ✅",
        mfaRequired: false,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, // ✅ correct
        },
      
      });
    }

    // MFA ON: send login OTP...
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 2 * 60 * 1000);

    user.loginOtp = otp;
    user.loginOtpExpiresAt = expiry;
    await user.save();


    await sendMail(email, "Login OTP", `Your login OTP is ${otp}. Valid for 2 minutes.`);

    return res.status(200).json({
      message: "OTP sent to email. Please verify OTP using /verify-otp with type=login"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
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

// 1) Checkbox ON -> Send MFA OTP
exports.requestMfaOtp = async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId || req.user?.id; // depends on your middleware
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 2 * 60 * 1000); // 2 mins

    user.mfaOtp = otp;
    user.mfaOtpExpiresAt = expiry;
    await user.save();


    await sendMail(
      user.email,
      "MFA Enable OTP",
      `Your MFA enable OTP is ${otp}. It is valid for 2 minutes.`
    );
    res.setHeader("Authorization", `Bearer ${req.token}`);

    return res.status(200).json({ message: "MFA OTP sent to email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2) Verify MFA OTP -> MFA true
exports.verifyMfaOtp = async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: "OTP required" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user?.mfaOtp || !user?.mfaOtpExpiresAt)
      return res.status(400).json({ message: "Please request MFA OTP first" });

    if (user?.mfaOtpExpiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (user?.mfaOtp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    user.mfaEnabled = true;
    user.mfaOtp = null;
    user.mfaOtpExpiresAt = null;
    await user.save();

    res.setHeader("Authorization", `Bearer ${req.token}`);


    return res.status(200).json({ message: "MFA enabled ✅", mfaEnabled: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// ✅ Disable MFA
exports.disableMfa = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id || req.user?._id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.mfaEnabled = false;
    user.mfaOtp = null;
    user.mfaOtpExpiresAt = null;

    await user.save();

    res.setHeader("Authorization", `Bearer ${req.token}`);

    return res.status(200).json({ message: "MFA disabled", mfaEnabled: false });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.requestDisableMfaOtp = async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 2 * 60 * 1000);

    user.disableMfaOtp = otp;
    user.disableMfaOtpExpiresAt = expiry;
    await user.save();

    await sendMail(
      user.email,
      "Disable MFA OTP",
      `Your OTP to disable MFA is ${otp}. Valid for 2 minutes.`
    );
    res.setHeader("Authorization", `Bearer ${req.token}`);
    return res.status(200).json({ message: "Disable MFA OTP sent to email" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.verifyDisableMfaOtp = async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: "OTP required" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user?.disableMfaOtp || !user?.disableMfaOtpExpiresAt)
      return res.status(400).json({ message: "Please request OTP first" });

    if (user?.disableMfaOtpExpiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (user?.disableMfaOtp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    user.mfaEnabled = false;
    user.disableMfaOtp = null;
    user.disableMfaOtpExpiresAt = null;
    await user.save();
    res.setHeader("Authorization", `Bearer ${req.token}`);

    return res.status(200).json({ message: "MFA disabled ✅", mfaEnabled: false });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
