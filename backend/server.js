import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import marketRoutes from './routes/market.js';
import newsRoutes from './routes/news.js';
import portfolioRoutes from './routes/portfolio.js';
import alertsRoutes from './routes/alerts.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/alerts', alertsRoutes);

// Basic Route for Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gold Dashboard API is running' });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    console.log('Server is continuing without DB (Registration/Login will fail until DB is fixed)');
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
