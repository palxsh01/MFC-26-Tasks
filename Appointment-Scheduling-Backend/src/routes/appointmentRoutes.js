const express = require('express');
const router = express.Router();
const { book, reschedule, cancel, getSchedule } = require('../controllers/appointmentController');

router.post('/book', book);
router.put('/reschedule', reschedule);
router.delete('/cancel', cancel);
router.get('/schedule', getSchedule);

module.exports = router;