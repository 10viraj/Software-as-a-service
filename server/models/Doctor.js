import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
    default: '',
  },
  qualifications: [String],
  availableSlots: [
    {
      day: String, // e.g., 'Monday'
      startTime: String, // e.g., '09:00'
      endTime: String, // e.g., '17:00'
    }
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
