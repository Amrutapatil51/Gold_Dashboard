import express from 'express';

const router = express.Router();

// @desc    Get market news
// @route   GET /api/news
// @access  Public
router.get('/', async (req, res) => {
  try {
    const mockNews = [
      {
        id: 1,
        title: 'Gold Hits Record High Amid Global Economic Uncertainties',
        summary: 'Gold prices continue to surge as investors seek safe-haven assets in response to fluctuating market conditions.',
        source: 'Market Watch',
        time: '2 hours ago',
        url: '#'
      },
      {
        id: 2,
        title: 'Central Banks Increase Gold Reserves in Q1 2024',
        summary: 'A significant trend is emerging as central banks across the globe bolster their gold holdings.',
        source: 'Financial Times',
        time: '5 hours ago',
        url: '#'
      },
      {
        id: 2,
        title: 'India Gold Demand Rises Ahead of Wedding Season',
        summary: 'Physical gold demand in India sees a sharp uptick as the festive and wedding season approaches.',
        source: 'Economic Times',
        time: '1 day ago',
        url: '#'
      }
    ];

    res.json(mockNews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market news' });
  }
});

export default router;
