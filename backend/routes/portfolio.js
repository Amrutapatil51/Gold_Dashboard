import express from 'express';
import PortfolioItem from '../models/PortfolioItem.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Use auth middleware for all portfolio routes
router.use(authMiddleware);

// @desc    Get all portfolio items for a user
// @route   GET /api/portfolio
// @access  Private
router.get('/', async (req, res) => {
  try {
    const items = await PortfolioItem.find({ user: req.user._id }).sort({ date: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new portfolio item
// @route   POST /api/portfolio
// @access  Private
router.post('/', async (req, res) => {
  const { weight, purity, purchasePrice, date, notes } = req.body;

  try {
    const item = await PortfolioItem.create({
      user: req.user._id,
      weight,
      purity,
      purchasePrice,
      date: date || Date.now(),
      notes,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
