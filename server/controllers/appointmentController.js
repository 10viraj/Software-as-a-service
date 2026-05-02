import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private/Patient
export const bookAppointment = async (req, res) => {
  const { doctorId, date, time, problemType, description } = req.body;

  const appointment = await Appointment.create({
    patientId: req.user._id,
    doctorId, // This is the User ID of the doctor
    date,
    time,
    problemType,
    description,
  });

  if (appointment) {
    res.status(201).json(appointment);
  } else {
    res.status(400).json({ message: 'Invalid appointment data' });
  }
};

// @desc    Get patient appointments
// @route   GET /api/appointments/my
// @access  Private/Patient
export const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user._id })
    .populate('doctorId', 'name email profilePic')
    .sort({ createdAt: -1 });
  res.json(appointments);
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor
// @access  Private/Doctor
export const getDoctorAppointments = async (req, res) => {
  const appointments = await Appointment.find({ doctorId: req.user._id })
    .populate('patientId', 'name email profilePic')
    .sort({ createdAt: -1 });
  res.json(appointments);
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private/Doctor
export const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this appointment' });
      return;
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments/all
// @access  Private/Admin
export const getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email')
    .sort({ createdAt: -1 });
  res.json(appointments);
};

