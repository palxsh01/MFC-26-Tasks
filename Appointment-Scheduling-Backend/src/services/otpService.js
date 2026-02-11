const nodemailer = require('nodemailer');
const twilio = require('twilio');
const bcrypt = require('bcryptjs');

let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Appointment System - OTP Verification',
    text: `Your OTP for verification is: ${otp}. This code will expire in 10 minutes.`
  };

  return await transporter.sendMail(mailOptions);
}

async function sendOTPSMS(phoneNumber, otp) {
  if (!twilioClient) {
    throw new Error('Twilio is not configured');
  }

  return await twilioClient.messages.create({
    body: `Your OTP for verification is: ${otp}. This code will expire in 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
}

async function generateAndSendOTP(identifier, method = 'email') {
  const otp = generateOTP();

  const expirationTime = Date.now() + 10 * 60 * 1000;
  otpStore.set(identifier, {
    otp: await bcrypt.hash(otp, 10),
    expires: expirationTime
  });

  if (method === 'email') {
    await sendOTPEmail(identifier, otp);
  } else if (method === 'sms') {
    await sendOTPSMS(identifier, otp);
  } else {
    throw new Error('Invalid method. Use "email" or "sms"');
  }

  return otp;
}

async function verifyOTP(identifier, otp) {
  const storedData = otpStore.get(identifier);

  if (!storedData) {
    return false;
  }

  if (Date.now() > storedData.expires) {
    otpStore.delete(identifier);
    return false;
  }

  const isValid = await bcrypt.compare(otp, storedData.otp);

  if (isValid) {
    otpStore.delete(identifier);
  }

  return isValid;
}

module.exports = { generateAndSendOTP, verifyOTP };