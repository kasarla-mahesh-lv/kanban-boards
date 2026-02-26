// src/services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInvitationEmail = async (email, token, projectId, tempPassword) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Team Invitation - Kanban Board",
    text: `
You have been invited to join Kanban Board.

Login Credentials:

Email: ${email}
Password: ${tempPassword}
Login URL: ${loginUrl}

Keep your credentials safe and confidential.
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendInvitationEmail };