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
      const sheetId = process.env.GOOGLE_SHEET_ID;
      const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

      // Initialize stats structure
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

      // Read analytics data from Google Sheets
      if (sheetId && (serviceAccountKey || apiKey)) {
        try {
          let accessToken = null;

          // Get access token using Service Account
          if (serviceAccountKey) {
            try {
              const jwt = (await import('jsonwebtoken')).default;
              const serviceAccountJson = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
              const serviceAccount = JSON.parse(serviceAccountJson);

              const now = Math.floor(Date.now() / 1000);
              const token = jwt.sign(
                {
                  iss: serviceAccount.client_email,
                  sub: serviceAccount.client_email,
                  aud: 'https://oauth2.googleapis.com/token',
                  exp: now + 3600,
                  iat: now,
                  scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
                },
                serviceAccount.private_key,
                { algorithm: 'RS256' }
              );

              const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                  grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                  assertion: token,
                }),
              });

              const tokenData = await tokenResponse.json();
              if (tokenData.access_token) {
                accessToken = tokenData.access_token;
              }
            } catch (serviceAccountError) {
              console.error('Service Account token error:', serviceAccountError);
            }
          }

          // Read Analytics sheet data
          const range = 'Analytics!A:I';
          let url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;
          if (accessToken) {
            url += `?access_token=${accessToken}`;
          } else if (apiKey) {
            url += `?key=${apiKey}`;
          } else {
            throw new Error('No authentication method available');
          }

          const sheetsResponse = await fetch(url);
          const sheetsData = await sheetsResponse.json();

          if (sheetsData.values && sheetsData.values.length > 1) {
            // Skip header row (index 0)
            const rows = sheetsData.values.slice(1);
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            const uniqueIPs = new Set();
            const uniquePaths = new Set();

            rows.forEach((row) => {
              if (!row || row.length < 2) return;

              const timestamp = row[0] ? new Date(row[0]) : null;
              const eventType = row[1] || '';
              const path = row[2] || '';
              const element = row[3] || '';
              const value = row[4] || '';
              const ip = row[8] || '';

              if (timestamp && !isNaN(timestamp.getTime())) {
                // Page Views
                if (eventType === 'pageview') {
                  stats.pageViews.total++;
                  uniquePaths.add(path);
                  
                  if (timestamp >= today) stats.pageViews.today++;
                  if (timestamp >= weekAgo) stats.pageViews.thisWeek++;
                  if (timestamp >= monthAgo) stats.pageViews.thisMonth++;

                  if (path) {
                    stats.pageViews.byPath[path] = (stats.pageViews.byPath[path] || 0) + 1;
                  }
                }

                // Clicks
                if (eventType === 'click') {
                  stats.clicks.total++;
                  if (element) {
                    stats.clicks.byElement[element] = (stats.clicks.byElement[element] || 0) + 1;
                  }
                }

                // Scrolls
                if (eventType === 'scroll' && value) {
                  const depth = parseInt(value);
                  if (!isNaN(depth)) {
                    if (depth >= 25) stats.scrolls.byDepth[25]++;
                    if (depth >= 50) stats.scrolls.byDepth[50]++;
                    if (depth >= 75) stats.scrolls.byDepth[75]++;
                    if (depth >= 100) stats.scrolls.byDepth[100]++;
                  }
                }

                // Unique users (by IP)
                if (ip && ip !== 'unknown') {
                  uniqueIPs.add(ip);
                }
              }
            });

            // Calculate top elements
            stats.clicks.topElements = Object.entries(stats.clicks.byElement)
              .map(([element, count]) => ({ element, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 10);

            // Set unique users
            stats.users.unique = uniqueIPs.size;
            stats.users.new = uniqueIPs.size; // Simplified - in production, track returning users

            // Calculate average scroll depth
            const scrollCounts = Object.values(stats.scrolls.byDepth);
            const totalScrolls = scrollCounts.reduce((a, b) => a + b, 0);
            if (totalScrolls > 0) {
              stats.scrolls.averageDepth = Math.round(
                (stats.scrolls.byDepth[25] * 25 +
                 stats.scrolls.byDepth[50] * 50 +
                 stats.scrolls.byDepth[75] * 75 +
                 stats.scrolls.byDepth[100] * 100) / totalScrolls
              );
            }
          }
        } catch (sheetsError) {
          console.error('Google Sheets read error:', sheetsError);
          // Return empty stats if Sheets read fails
        }
      }

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

