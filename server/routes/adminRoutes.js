import express from 'express';
import { getAllDoctors, addDoctor, deleteDoctor, getAdminStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getAdminStats);
router.route('/doctors')

  .get(protect, admin, getAllDoctors)
  .post(protect, admin, addDoctor);

router.route('/doctors/:id')
  .delete(protect, admin, deleteDoctor);

export default router;
