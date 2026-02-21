// src/services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInvitationEmail = async (email, token, projectId) => {
  const acceptLink = `${process.env.FRONTEND_URL}/login`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You're invited to join our team!",
    text: `
Dear Team Member,

You have been invited to join the Kanban Board project team. Please accept 
the invitation by clicking the link below to get started:

${acceptLink}

This invitation link will expire in 7 days. If you did not expect this 
invitation, please contact your project manager.

Best regards,
Kanban Board Team
` // ✅ Just plain text with link
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendInvitationEmail };
