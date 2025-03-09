const nodemailer = require("nodemailer");
require("dotenv").config();

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send Verification Email
const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const mailDetails = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - AlgoAscent",
    html: `<h2>Welcome to AlgoAscent</h2>
           <p>Click the link below to verify your email:</p>
           <a href="${verificationLink}">${verificationLink}</a>
           <p>This link will expire in 24 hours.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailDetails);
    console.log("Verification Email Sent!", info.messageId);
  } catch (error) {
    console.error("Error Sending Email!", error);
  }
};

module.exports = sendVerificationEmail;
