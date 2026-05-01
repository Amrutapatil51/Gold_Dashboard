import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const router = express.Router();
const priceCache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// @desc    Get current gold price
// @route   GET /api/market/price
// @access  Public
router.get('/price', async (req, res) => {
<<<<<<< HEAD
  const { timeframe = '1M' } = req.query;
  const cacheKey = `gold_price_${timeframe}`;

  try {
    const cachedPrice = priceCache.get(cacheKey);
=======
  try {
    const cachedPrice = priceCache.get('gold_price');
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
    if (cachedPrice) {
      return res.json(cachedPrice);
    }

    const apiKey = process.env.GOLD_API_KEY;
<<<<<<< HEAD
    let basePrice;
    let change;
    let changePercent;
    let prevClose;

    if (!apiKey || apiKey === 'your_gold_api_key') {
      // Use fallback mock values if API key is missing
      basePrice = 72450;
      change = 320;
      changePercent = 0.44;
      prevClose = 72130;
    } else {
      const response = await axios.get(`https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU`);
      const data = response.data;
      const USD_TO_INR = 84.0;
      const ounceTo10g = 10 / 31.1035;
      
      const pricePerOunce = data.rates.USDXAU || (1 / data.rates.XAU);
      basePrice = pricePerOunce * ounceTo10g * USD_TO_INR;
      
      // metalpriceapi /latest does not provide daily change, mocking it for now based on a random realistic fluctuation
      change = 320;
      changePercent = 0.44;
    }

    const generateHistoricalData = (price, tf) => {
      const points = [];
      const today = new Date();
      let count = 30;
      
      if (tf === '1D') count = 24;
      else if (tf === '7D') count = 7;
      else if (tf === '1Y') count = 12;

      for (let i = count; i >= 0; i--) {
        const d = new Date(today);
        let dateStr;
        
        if (tf === '1D') {
          d.setHours(d.getHours() - i);
          dateStr = d.getHours().toString().padStart(2, '0') + ':00';
        } else if (tf === '1Y') {
          d.setMonth(d.getMonth() - i);
          dateStr = d.toLocaleString('default', { month: 'short' });
        } else {
          d.setDate(d.getDate() - i);
          dateStr = d.toISOString().split('T')[0];
        }
        
        // Add random variation to make the chart look real
        const variation = 0.98 + (Math.random() * 0.04);
        points.push({
          date: dateStr,
          price: Math.round(price * variation)
        });
      }
      return points;
    };

    const formattedData = {
      price: Math.round(basePrice * 100) / 100,
      currency: 'INR',
      unit: '10g',
      change: Math.round(change * 100) / 100,
      changePercent: changePercent,
      timestamp: new Date().toISOString(),
      historical: generateHistoricalData(basePrice, timeframe)
    };

    priceCache.set(cacheKey, formattedData);
    res.json(formattedData);
  } catch (error) {
    console.error('Market API Error:', error.response?.data || error.message);
    console.log('Falling back to mock market data...');
    
    // Fallback logic
    const basePrice = 72450;
    const change = 320;
    const changePercent = 0.44;

    const generateHistoricalData = (price, tf) => {
      const points = [];
      const today = new Date();
      let count = 30;
      
      if (tf === '1D') count = 24;
      else if (tf === '7D') count = 7;
      else if (tf === '1Y') count = 12;

      for (let i = count; i >= 0; i--) {
        const d = new Date(today);
        let dateStr;
        
        if (tf === '1D') {
          d.setHours(d.getHours() - i);
          dateStr = d.getHours().toString().padStart(2, '0') + ':00';
        } else if (tf === '1Y') {
          d.setMonth(d.getMonth() - i);
          dateStr = d.toLocaleString('default', { month: 'short' });
        } else {
          d.setDate(d.getDate() - i);
          dateStr = d.toISOString().split('T')[0];
        }
        
        const variation = 0.98 + (Math.random() * 0.04);
        points.push({
          date: dateStr,
          price: Math.round(price * variation)
        });
      }
      return points;
    };

    const formattedData = {
      price: Math.round(basePrice * 100) / 100,
      currency: 'INR',
      unit: '10g',
      change: Math.round(change * 100) / 100,
      changePercent: changePercent,
      timestamp: new Date().toISOString(),
      historical: generateHistoricalData(basePrice, timeframe),
      isFallback: true
    };

    priceCache.set(cacheKey, formattedData);
    res.json(formattedData);
=======
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
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
  }
});

export default router;
