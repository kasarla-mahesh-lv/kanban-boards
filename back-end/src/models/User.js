const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required:true,
        minlength:6
    },

    mobilenumber:{
        type:String,
        required:true,
        minlength:10
    },

    // OTP fields
    otp:{ type:String, default:null },
    expiresAt:{ type:Date, default:null },

    isVerified:{
        type:Boolean,
        default:false
    },
    loginOtp: { type: String, default: null },
    loginOtpExpiresAt: { type: Date, default: null },
        // ✅ MFA Settings (Project settings checkbox)
    mfaEnabled: { type: Boolean, default: false },
    mfaOtp: { type: String, default: null },
    mfaOtpExpiresAt: { type: Date, default: null },
    disableMfaOtp: { type: String, default: null },
    disableMfaOtpExpiresAt: { type: Date, default: null },

    tokens:[
        {
            token:{ type:String, required:true }
        }
    ]


    
},{timestamps:true});

module.exports = mongoose.model("User",userSchema);