import express from 'express';
import { loginUser, registerUser, getUserProfile, updateUserProfile, getUserById } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get('/user/:id', protect, getUserById);

export default router;
