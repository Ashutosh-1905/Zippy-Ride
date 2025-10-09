import nodemailer from 'nodemailer';
import config from '../../config/config.js';

// Transporter initialization outside the function for efficiency
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

export const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: config.emailUser,
    to: toEmail,
    subject: 'Your OTP for Ride Confirmation',
    text: `Hello! Your OTP code for ride confirmation is ${otp}. It will expire in 30 minutes. Please do not share it with anyone.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // OPTIMIZATION: Log the failure but DO NOT re-throw.
    // Email failure should not halt the main flow (ride acceptance).
    console.error(`CRITICAL: Failed to send OTP email to ${toEmail}:`, error);
  }
};