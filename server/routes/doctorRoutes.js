import express from 'express';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// @desc    Get all doctors for public viewing
// @route   GET /api/doctors
// @access  Public
router.get('/', async (req, res) => {
  const doctors = await Doctor.find().populate('userId', 'name email profilePic');
  res.json(doctors);
});

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
router.get('/:id', async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email profilePic');
  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404).json({ message: 'Doctor not found' });
  }
});

export default router;
