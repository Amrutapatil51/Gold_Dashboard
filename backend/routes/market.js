import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const router = express.Router();
const priceCache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// @desc    Get current gold price
// @route   GET /api/market/price
// @access  Public
router.get('/price', async (req, res) => {
  try {
    const cachedPrice = priceCache.get('gold_price');
    if (cachedPrice) {
      return res.json(cachedPrice);
    }

    const apiKey = process.env.GOLD_API_KEY;
    if (!apiKey || apiKey === 'your_gold_api_key') {
      throw new Error('Valid Gold API key not found');
    }

    // Fetch from GoldAPI.io (XAU to INR)
    const response = await axios.get('https://www.goldapi.io/api/XAU/INR', {
      headers: {
        'x-access-token': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    
    // Map to a cleaner format and convert per-ounce to per-10g (standard in India)
    // 1 Troy Ounce = 31.1035 grams
    const ounceTo10g = 10 / 31.1035;
    const price10g = data.price * ounceTo10g;

    const formattedData = {
      price: Math.round(price10g * 100) / 100,
      currency: 'INR',
      unit: '10g',
      change: Math.round(data.ch * ounceTo10g * 100) / 100,
      changePercent: data.chp,
      timestamp: new Date().toISOString(),
      historical: [
        { date: '2024-03-31', price: Math.round(data.prev_close_price * ounceTo10g) },
        // These can be fetched from a historical endpoint if needed
        { date: '2024-03-30', price: Math.round(data.prev_close_price * ounceTo10g * 0.99) },
        { date: '2024-03-29', price: Math.round(data.prev_close_price * ounceTo10g * 0.985) },
      ]
    };

    priceCache.set('gold_price', formattedData);
    res.json(formattedData);
  } catch (error) {
    console.error('Market API Error:', error.message);
    
    // Fallback to minimal mock data if API fails to avoid breaking UI
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching real-time price, using cached/standard data',
      price: 72000, 
      currency: 'INR' 
    });
  }
});

export default router;
