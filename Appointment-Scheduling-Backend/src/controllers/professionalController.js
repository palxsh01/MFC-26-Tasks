const { Professional } = require('../models/AppointmentModels');

async function createProfessional(req, res) {
  try {
    const { name, email, phone, specialty } = req.body;

    const existingProfessional = await Professional.findOne({ email });
    if (existingProfessional) {
      return res.status(400).json({ error: 'Professional with this email already exists' });
    }

    const professional = new Professional({ name, email, phone, specialty });
    const savedProfessional = await professional.save();

    res.status(201).json({
      message: 'Professional created successfully',
      professional: savedProfessional
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addSchedule(req, res) {
  try {
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime, interval = 30, isActive = true } = req.body;

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return res.status(400).json({ error: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)' });
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ error: 'Invalid time format. Use HH:mm format' });
    }

    const professional = await Professional.findById(id);
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    professional.schedules.push({ dayOfWeek, startTime, endTime, interval, isActive });
    professional.updatedAt = new Date();
    const updatedProfessional = await professional.save();

    res.status(200).json({
      message: 'Schedule added successfully',
      professional: updatedProfessional
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllProfessionals(req, res) {
  try {
    const professionals = await Professional.find().select('-schedules');
    res.status(200).json({ professionals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getProfessionalById(req, res) {
  try {
    const { id } = req.params;
    const professional = await Professional.findById(id);

    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    res.status(200).json({ professional });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createProfessional, addSchedule, getAllProfessionals, getProfessionalById };