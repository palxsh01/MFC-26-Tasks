const jwt = require('jsonwebtoken');
const { verifyOTP } = require('../services/otpService');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

async function authenticateOTP(req, res, next) {
  const { identifier, otp } = req.body;

  if (!identifier || !otp) {
    return res.status(400).json({ error: 'Identifier and OTP are required' });
  }

  try {
    const isValid = await verifyOTP(identifier, otp);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }
    req.verifiedIdentifier = identifier;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { authenticateToken, authenticateOTP };