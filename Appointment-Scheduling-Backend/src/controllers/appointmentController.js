const {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  getUserSchedule
} = require('../services/appointmentService');

async function book(req, res) {
  try {
    const { professionalId, userId, startTime, endTime } = req.body;

    if (!professionalId || !userId || !startTime || !endTime) {
      return res.status(400).json({
        error: 'Missing required fields: professionalId, userId, startTime, endTime'
      });
    }

    const booking = await bookAppointment(
      professionalId,
      userId,
      new Date(startTime),
      new Date(endTime)
    );

    res.status(201).json({
      message: 'Appointment booked successfully',
      booking
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function reschedule(req, res) {
  try {
    const { bookingId, newStartTime, newEndTime } = req.body;

    if (!bookingId || !newStartTime || !newEndTime) {
      return res.status(400).json({
        error: 'Missing required fields: bookingId, newStartTime, newEndTime'
      });
    }

    const updatedBooking = await rescheduleAppointment(
      bookingId,
      new Date(newStartTime),
      new Date(newEndTime)
    );

    res.status(200).json({
      message: 'Appointment rescheduled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function cancel(req, res) {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: 'Missing required field: bookingId' });
    }

    const updatedBooking = await cancelAppointment(bookingId);

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getSchedule(req, res) {
  try {
    const { professionalId, startDate, endDate } = req.query;

    if (!professionalId || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Missing required query parameters: professionalId, startDate, endDate'
      });
    }

    const schedule = await getUserSchedule(
      professionalId,
      new Date(startDate),
      new Date(endDate)
    );

    res.status(200).json({ schedule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { book, reschedule, cancel, getSchedule };