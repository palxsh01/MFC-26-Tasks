const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the time slot schema
const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookingId: {
    type: String,
    default: null
  }
});

// Define the schedule schema for recurring availability
const scheduleSchema = new mongoose.Schema({
  professionalId: {
    type: String,
    required: true
  },
  dayOfWeek: {
    type: Number, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    required: true
  },
  startTime: {
    type: String, // Format: "HH:mm"
    required: true
  },
  endTime: {
    type: String, // Format: "HH:mm"
    required: true
  },
  interval: {
    type: Number, // Interval in minutes (e.g., 30 for 30-minute blocks)
    default: 30
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Define the booking schema
const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  professionalId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'rescheduled', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Define the professional schema
const professionalSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  specialty: {
    type: String
  },
  schedules: [scheduleSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  TimeSlot: mongoose.model('TimeSlot', timeSlotSchema),
  Schedule: mongoose.model('Schedule', scheduleSchema),
  Booking: mongoose.model('Booking', bookingSchema),
  Professional: mongoose.model('Professional', professionalSchema)
};