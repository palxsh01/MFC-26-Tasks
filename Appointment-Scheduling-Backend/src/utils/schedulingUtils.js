const { Booking, Professional } = require('../models/AppointmentModels');

function generateTimeSlots(startDate, endDate, schedule) {
  const slots = [];
  const currentDate = new Date(startDate);

  while (currentDate.getDay() !== schedule.dayOfWeek) {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  while (currentDate <= endDate) {
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

    const slotDate = new Date(currentDate);
    slotDate.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(currentDate);
    endTime.setHours(endHour, endMinute, 0, 0);

    while (slotDate < endTime) {
      const slotEnd = new Date(slotDate);
      slotEnd.setMinutes(slotDate.getMinutes() + schedule.interval);

      if (slotEnd <= endTime) {
        slots.push({
          startTime: new Date(slotDate),
          endTime: new Date(slotEnd)
        });
      }

      slotDate.setMinutes(slotDate.getMinutes() + schedule.interval);
    }

    currentDate.setDate(currentDate.getDate() + 7);
  }

  return slots;
}

async function checkCollision(professionalId, startTime, endTime, excludeBookingId = null) {
  if (endTime < new Date()) {
    throw new Error('Cannot book appointments in the past');
  }

  const query = {
    professionalId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    status: { $ne: 'cancelled' }
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlappingBookings = await Booking.find(query);
  return overlappingBookings.length > 0;
}

async function generateAvailableSlots(professionalId, startDate, endDate) {
  const professional = await Professional.findById(professionalId);
  if (!professional) {
    throw new Error('Professional not found');
  }

  const existingBookings = await Booking.find({
    professionalId,
    startTime: { $gte: startDate },
    endTime: { $lte: endDate },
    status: { $ne: 'cancelled' }
  });

  const allSlots = [];

  for (const schedule of professional.schedules) {
    if (schedule.isActive) {
      const slots = generateTimeSlots(startDate, endDate, schedule);
      allSlots.push(...slots);
    }
  }

  const availableSlots = allSlots.map(slot => {
    const isBooked = existingBookings.some(booking =>
      booking.startTime < slot.endTime && booking.endTime > slot.startTime
    );

    return { ...slot, isBooked };
  });

  return availableSlots;
}

module.exports = { generateTimeSlots, checkCollision, generateAvailableSlots };