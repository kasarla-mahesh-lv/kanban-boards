const Joi = require("joi");

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
const mobileRegex = /^[0-9]{10}$/;

exports.registerSchema = Joi.object({
  name: Joi.string().min(3).required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be minimum 8 characters, include 1 uppercase letter and 1 special character"
    }),

  mobilenumber: Joi.string()
    .pattern(mobileRegex)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits"
    })
});

/* VERIFY OTP */
exports.verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  type: Joi.string().valid("register", "login").default("register")
});


/* LOGIN */
exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


/* FORGOT PASSWORD */
exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

//RESET PASSWORD//
exports.resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),

  newPassword: Joi.string()
    .pattern(passwordRegex)
    .required(),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match"
    })
});

/*exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// ✅ same endpoint verifyOtp used for register + login
exports.verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  type: Joi.string().valid("register", "login").default("register") // ✅ added
});*/