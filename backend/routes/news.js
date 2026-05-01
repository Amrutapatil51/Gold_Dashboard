import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const router = express.Router();
const newsCache = new NodeCache({ stdTTL: 1800 }); // Cache for 30 minutes to respect API limits

// Mock fallback data
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
    id: 3,
    title: 'India Gold Demand Rises Ahead of Wedding Season',
    summary: 'Physical gold demand in India sees a sharp uptick as the festive and wedding season approaches.',
    source: 'Economic Times',
    time: '1 day ago',
    url: '#'
  }
];

// Helper to format 'publishedAt' into relative time (e.g., '2 hours ago')
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
};

// @desc    Get market news
// @route   GET /api/news
// @access  Public
router.get('/', async (req, res) => {
  try {
    // 1. Check Cache
    const cachedNews = newsCache.get('market_news');
    if (cachedNews) {
      return res.json(cachedNews);
    }

    // 2. Validate API Key
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey || apiKey === 'your_news_api_key') {
      throw new Error('Valid News API key not found');
    }

    // 3. Fetch from NewsAPI
    // Querying specifically for topics related to our Vector tags
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: '(gold OR silver OR market) AND (fed OR reserve OR inflation OR hedge OR central bank OR etf OR geopolitics OR economy)',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 50,
        apiKey: apiKey
      }
    });

    if (response.data.status !== 'ok' || !response.data.articles) {
      throw new Error('Invalid response from News API');
    }

    // 4. Map to frontend schema
    const articles = response.data.articles
      .filter(a => a.title && a.description && a.title !== '[Removed]') // Remove dead articles
      .map((article, index) => {
        // Determine an impact badge randomly or based on keywords (for UI flair)
        const text = (article.title + ' ' + article.description).toLowerCase();
        let impact = 'Neutral';
        if (text.includes('record high') || text.includes('surge') || text.includes('bull')) impact = 'Positive';
        if (text.includes('drop') || text.includes('fall') || text.includes('bear')) impact = 'Negative';

        return {
          id: index + 1,
          title: article.title,
          summary: article.description.slice(0, 150) + (article.description.length > 150 ? '...' : ''),
          source: article.source.name || 'Global News',
          time: getRelativeTime(article.publishedAt),
          url: article.url,
          image: article.urlToImage, // Will be displayed if the frontend supports it
          impact: impact
        };
      });

    // 5. Cache and Return
    if (articles.length > 0) {
      newsCache.set('market_news', articles);
      return res.json(articles);
    } else {
       throw new Error('No articles found matching criteria');
    }

  } catch (error) {
    console.error('News API Error:', error.message);
    // Fall back to mock data so UI doesn't break
    res.status(200).json(mockNews);
  }
});

export default router;
