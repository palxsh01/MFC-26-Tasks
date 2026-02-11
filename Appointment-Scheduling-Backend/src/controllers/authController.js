const jwt = require('jsonwebtoken');
const { generateAndSendOTP, verifyOTP } = require('../services/otpService');

async function requestOTP(req, res) {
  try {
    const { identifier, method } = req.body;

    if (!identifier) {
      return res.status(400).json({ error: 'Identifier is required' });
    }

    await generateAndSendOTP(identifier, method);

    res.status(200).json({
      message: `OTP sent successfully to ${identifier}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function verifyOTPAndLogin(req, res) {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ error: 'Identifier and OTP are required' });
    }

    const isValid = await verifyOTP(identifier, otp);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const token = jwt.sign(
      { identifier },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Authentication successful',
      token,
      identifier
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { requestOTP, verifyOTPAndLogin };