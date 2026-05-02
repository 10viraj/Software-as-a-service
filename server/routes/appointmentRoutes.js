import express from 'express';
import { 
  bookAppointment, 
  getMyAppointments, 
  getDoctorAppointments, 
  updateAppointmentStatus,
  getAllAppointments
} from '../controllers/appointmentController.js';
import { protect, doctor, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, bookAppointment)
  .get(protect, getMyAppointments);

router.get('/doctor', protect, doctor, getDoctorAppointments);
router.get('/all', protect, admin, getAllAppointments);
router.put('/:id', protect, doctor, updateAppointmentStatus);


export default router;
