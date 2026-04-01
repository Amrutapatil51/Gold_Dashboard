import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetPrice: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    enum: ['above', 'below'],
    required: true,
  },
  metal: {
    type: String,
    default: 'gold',
  },
  currency: {
    type: String,
    default: 'INR',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
