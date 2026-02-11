const { Booking, Professional } = require('../models/AppointmentModels');
const { checkCollision, generateAvailableSlots } = require('../utils/schedulingUtils');
const mongoose = require('mongoose');

async function bookAppointment(professionalId, userId, startTime, endTime) {
  const hasCollision = await checkCollision(professionalId, startTime, endTime);
  if (hasCollision) {
    throw new Error('Time slot is already booked');
  }

  const booking = new Booking({ professionalId, userId, startTime, endTime });
  return await booking.save();
}

async function rescheduleAppointment(bookingId, newStartTime, newEndTime) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingBooking = await Booking.findById(bookingId).session(session);
    if (!existingBooking) {
      throw new Error('Booking not found');
    }

    const hasCollision = await checkCollision(
      existingBooking.professionalId,
      newStartTime,
      newEndTime,
      bookingId
    );

    if (hasCollision) {
      throw new Error('New time slot is already booked');
    }

    existingBooking.startTime = newStartTime;
    existingBooking.endTime = newEndTime;
    existingBooking.status = 'rescheduled';
    existingBooking.updatedAt = new Date();

    const updatedBooking = await existingBooking.save({ session });

    await session.commitTransaction();
    return updatedBooking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async function cancelAppointment(bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  booking.status = 'cancelled';
  booking.updatedAt = new Date();

  return await booking.save();
}

async function getUserSchedule(professionalId, startDate, endDate) {
  const bookings = await Booking.find({
    professionalId,
    startTime: { $gte: startDate },
    endTime: { $lte: endDate },
    status: { $in: ['confirmed', 'rescheduled'] }
  }).sort({ startTime: 1 });

  const availableSlots = await generateAvailableSlots(professionalId, startDate, endDate);

  return { bookings, availableSlots };
}

module.exports = { bookAppointment, rescheduleAppointment, cancelAppointment, getUserSchedule };