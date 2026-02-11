const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const timeSlotSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isBooked: { type: Boolean, default: false },
  bookingId: { type: String, default: null }
});

const scheduleSchema = new mongoose.Schema({
  dayOfWeek: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  interval: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true }
});

const bookingSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  professionalId: { type: String, required: true },
  userId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['confirmed', 'rescheduled', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const professionalSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  specialty: { type: String },
  schedules: [scheduleSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = {
  TimeSlot: mongoose.model('TimeSlot', timeSlotSchema),
  Schedule: mongoose.model('Schedule', scheduleSchema),
  Booking: mongoose.model('Booking', bookingSchema),
  Professional: mongoose.model('Professional', professionalSchema)
};