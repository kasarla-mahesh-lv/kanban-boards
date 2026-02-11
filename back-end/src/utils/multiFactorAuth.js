const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtpMail(toEmail, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your Login OTP",
    text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
  });
}

module.exports = sendOtpMail;
