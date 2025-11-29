// Vercel Serverless Function - Analytics Tracking
// Tracks page views, clicks, scrolls, and other user interactions

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const eventData = req.body;
    
    // Validate required fields
    if (!eventData.type || !eventData.timestamp) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Store analytics data in memory (for Vercel serverless functions)
    // In production, you might want to use a database or external service
    const analyticsEvent = {
      id: Date.now().toString(),
      ...eventData,
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
      createdAt: new Date().toISOString(),
    };

    // Log for debugging (in production, send to analytics service)
    console.log('Analytics Event:', JSON.stringify(analyticsEvent));

    // Optional: Send to Google Analytics or other analytics service
    // You can add Google Analytics 4 (GA4) integration here
    if (process.env.GOOGLE_ANALYTICS_ID) {
      // GA4 Measurement Protocol integration can be added here
    }

    // Store in Google Sheets for analysis (same sheet, different page)
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
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Analytics tracking failed' 
    });
  }
}

