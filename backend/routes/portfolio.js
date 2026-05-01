import express from 'express';
import mongoose from 'mongoose';
import PortfolioItem from '../models/PortfolioItem.js';
import authMiddleware from '../middleware/auth.js';
import { offlineStore } from '../utils/offlineStore.js';

const router = express.Router();

// Use auth middleware for all portfolio routes
router.use(authMiddleware);

// @desc    Get all portfolio items for a user
// @route   GET /api/portfolio
// @access  Private
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const items = await PortfolioItem.find({ user: req.user._id }).sort({ date: -1 });
      res.json(items);
    } else {
      const items = await offlineStore.find('portfolio', { user: req.user._id.toString() });
      res.json(items);
    }
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
    if (mongoose.connection.readyState === 1) {
      const item = await PortfolioItem.create({
        user: req.user._id,
        weight,
        purity,
        purchasePrice,
        date: date || Date.now(),
        notes,
      });
      res.status(201).json(item);
    } else {
      const item = await offlineStore.create('portfolio', {
        user: req.user._id.toString(),
        weight,
        purity,
        purchasePrice,
        date: date || Date.now(),
        notes,
      });
      res.status(201).json(item);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
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
    } else {
      await offlineStore.deleteOne('portfolio', req.params.id);
      res.json({ message: 'Item removed (Offline)' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const item = await PortfolioItem.findById(req.params.id);

      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      if (item.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const { weight, purity, purchasePrice, date, notes } = req.body;
      item.weight = weight ?? item.weight;
      item.purity = purity ?? item.purity;
      item.purchasePrice = purchasePrice ?? item.purchasePrice;
      item.date = date ?? item.date;
      item.notes = notes ?? item.notes;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(501).json({ message: 'Update not yet implemented in offline mode' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
