import express from 'express';
import Alert from '../models/Alert.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

// @desc    Get all alerts for a user
// @route   GET /api/alerts
// @access  Private
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user._id });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new alert
// @route   POST /api/alerts
// @access  Private
router.post('/', async (req, res) => {
  const { targetPrice, condition, metal, currency } = req.body;

  try {
    const alert = await Alert.create({
      user: req.user._id,
      targetPrice,
      condition,
      metal: metal || 'gold',
      currency: currency || 'INR',
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete an alert
// @route   DELETE /api/alerts/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    if (alert.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await alert.deleteOne();
    res.json({ message: 'Alert removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
