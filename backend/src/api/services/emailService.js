import nodemailer from 'nodemailer';
import config from '../../config/config.js';

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
    console.error(`Failed to send OTP email to ${toEmail}:`, error);
    throw new Error('Could not send OTP email at this time');
  }
};
