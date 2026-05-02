import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private/Admin
export const getAllDoctors = async (req, res) => {
  const doctors = await Doctor.find().populate('userId', 'name email profilePic');
  res.json(doctors);
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  const doctorCount = await Doctor.countDocuments();
  const patientCount = await User.countDocuments({ role: 'patient' });
  const appointmentCount = await Appointment.countDocuments();
  const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
  
  // Recent activity (last 5 appointments)
  const recentAppointments = await Appointment.find()
    .populate('patientId', 'name')
    .populate('doctorId', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    doctorCount,
    patientCount,
    appointmentCount,
    pendingAppointments,
    recentAppointments
  });
};

// @desc    Add a new doctor
// @route   POST /api/admin/doctors
// @access  Private/Admin
export const addDoctor = async (req, res) => {
  const { name, email, password, specialization, experience, fees, about } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // Create User with role 'doctor'
  const user = await User.create({
    name,
    email,
    password,
    role: 'doctor',
  });

  if (user) {
    // Create Doctor Profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      experience,
      fees,
      about,
    });

    res.status(201).json({
      _id: doctor._id,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      specialization: doctor.specialization,
    });
  } else {
    res.status(400).json({ message: 'Invalid doctor data' });
  }
};

// @desc    Delete a doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Private/Admin
export const deleteDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    await User.findByIdAndDelete(doctor.userId);
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor removed' });
  } else {
    res.status(404).json({ message: 'Doctor not found' });
  }
};
