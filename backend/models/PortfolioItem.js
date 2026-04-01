import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  weight: {
    type: Number,
    required: true, // in grams
  },
  purity: {
    type: String,
    enum: ['24K', '22K', '18K'],
    default: '24K',
  },
  purchasePrice: {
    type: Number,
    required: true, // total price paid
  },
  notes: String,
});

const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);
export default PortfolioItem;
