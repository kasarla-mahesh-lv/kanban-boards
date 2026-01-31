const mongoose=require("mongoose");
// const bcrypt = require("bcryptjs");
const userSchema=new mongoose.Schema(
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
            minlength:6,
            maxlength:8
        },

        mobilenumber:{
            type:Number,
            required:true,
            minlength:10
        },
    },
    {timestamps:true}
);
module.exports=mongoose.model("User",userSchema);