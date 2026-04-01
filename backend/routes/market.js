import express from 'express';
import axios from 'axios';

const router = express.Router();

// @desc    Get current gold price
// @route   GET /api/market/price
// @access  Public
router.get('/price', async (req, res) => {
  try {
    // In a real scenario, you'd use process.env.GOLD_API_KEY
    // For now, providing a realistic mock response or fetching from a free tier if available
    // Example: GoldAPI.io logic would go here
    
    const mockData = {
      price: 72455.50,
      currency: 'INR',
      unit: '10g',
      change: 1.25,
      changePercent: 0.17,
      timestamp: new Date().toISOString(),
      historical: [
        { date: '2024-03-10', price: 71000 },
        { date: '2024-03-11', price: 71200 },
        { date: '2024-03-12', price: 71500 },
        { date: '2024-03-13', price: 72000 },
        { date: '2024-03-14', price: 72455 },
      ]
    };

    res.json(mockData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gold price' });
  }
});

export default router;
