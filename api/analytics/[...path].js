// Vercel Serverless Function - Analytics API (Combined)
// Handles all analytics routes: track, stats

import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle Vercel path parsing
  let route = '';
  if (req.query.path) {
    const path = req.query.path;
    const pathArray = Array.isArray(path) ? path : [path];
    route = pathArray.filter(Boolean).join('/');
  } else if (req.url) {
    // Fallback: parse from URL
    const urlPath = req.url.split('?')[0];
    const match = urlPath.match(/\/api\/analytics\/(.+)$/);
    if (match) {
      route = match[1];
    }
  }

  console.log('=== ANALYTICS API REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Query:', JSON.stringify(req.query));
  console.log('Route:', route);

  try {
    // Track route
    if (route === 'track' && req.method === 'POST') {
      const eventData = req.body;
      
      if (!eventData.type || !eventData.timestamp) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const analyticsEvent = {
        id: Date.now().toString(),
        ...eventData,
        ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
        createdAt: new Date().toISOString(),
      };

      console.log('Analytics Event:', JSON.stringify(analyticsEvent));

      // Store in Google Sheets for analysis
      if (process.env.GOOGLE_SHEET_ID && (process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SHEETS_API_KEY)) {
        try {
          const sheetsUrl = `${req.headers.origin || 'https://ibrahimabdullayev-portfolio.vercel.app'}/api/google-sheets-analytics`;
          fetch(sheetsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(analyticsEvent),
          }).catch(err => console.error('Analytics Sheets error:', err));
        } catch (err) {
          console.error('Analytics Sheets request error:', err);
        }
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Analytics event tracked',
        eventId: analyticsEvent.id 
      });
    }

    // Stats route
    if (route === 'stats' && req.method === 'GET') {
      // Check authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      try {
        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { startDate, endDate, type } = req.query;

      // Mock stats structure (in production, query database)
      const stats = {
        pageViews: {
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
          byPath: {},
        },
        clicks: {
          total: 0,
          byElement: {},
          topElements: [],
        },
        scrolls: {
          averageDepth: 0,
          byDepth: {
            25: 0,
            50: 0,
            75: 0,
            100: 0,
          },
        },
        users: {
          unique: 0,
          returning: 0,
          new: 0,
        },
        devices: {
          desktop: 0,
          mobile: 0,
          tablet: 0,
        },
        referrers: {},
        timeRange: {
          startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: endDate || new Date().toISOString(),
        },
      };

      return res.status(200).json({
        success: true,
        data: stats,
        message: 'Statistics retrieved successfully',
      });
    }

    return res.status(404).json({ success: false, message: 'Route not found' });
  } catch (error) {
    console.error('Analytics API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Xəta baş verdi' 
    });
  }
}

