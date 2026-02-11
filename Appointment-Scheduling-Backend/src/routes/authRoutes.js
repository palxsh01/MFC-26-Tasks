const express = require('express');
const router = express.Router();
const { requestOTP, verifyOTPAndLogin } = require('../controllers/authController');

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTPAndLogin);

module.exports = router;