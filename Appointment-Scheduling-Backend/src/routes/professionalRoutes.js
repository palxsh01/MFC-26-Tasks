const express = require('express');
const router = express.Router();
const {
  createProfessional,
  addSchedule,
  getAllProfessionals,
  getProfessionalById
} = require('../controllers/professionalController');

router.post('/', createProfessional);
router.post('/:id/schedule', addSchedule);
router.get('/', getAllProfessionals);
router.get('/:id', getProfessionalById);

module.exports = router;