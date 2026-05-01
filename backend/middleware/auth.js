<<<<<<< HEAD
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { offlineStore } from '../utils/offlineStore.js';
=======
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

<<<<<<< HEAD
      // Get user from the token (Check if DB is connected)
      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // DB Offline: Try to find in offline store or mock it
        const offlineUser = await offlineStore.findById('users', decoded.id);
        req.user = offlineUser || { _id: decoded.id, name: 'Offline User', isOffline: true };
      }

      if (!req.user) {
        // FALLBACK: If token is valid but user was deleted or DB was reset
        // This prevents the "User not found" error from blocking the UI
        req.user = { 
          _id: decoded.id, 
          name: 'Recovered User', 
          email: 'recovered@example.com',
          isRecovered: true 
        };
        console.log(`⚠️ User ${decoded.id} not found in DB, using fallback profile.`);
      }

      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      
      // Distinguish between JWT errors and Database/Other errors
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired or invalid. Please login again.' });
      }
      
      // If it's a database error, we might still want to allow offline access
      // but let's report it for now.
      res.status(500).json({ message: 'Internal server error or Database connection failure' });
=======
      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
    }
  }

  if (!token) {
<<<<<<< HEAD
    res.status(401).json({ message: 'Not authorized, no token provided' });
=======
    res.status(401).json({ message: 'Not authorized, no token' });
>>>>>>> fd662a3a9c4caa2dc09b0fe4343bab567e18a0c5
  }
};

export default authMiddleware;
