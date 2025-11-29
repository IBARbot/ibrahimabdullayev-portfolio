// Vercel Serverless Function - Analytics API
async function addToGoogleSheets(eventData) {
  try {
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_ANALYTICS_SCRIPT_URL;
    if (!GOOGLE_SCRIPT_URL) {
      console.log('Google Analytics Script URL not configured');
      return null;
    }

    const rowData = {
      timestamp: eventData.timestamp || new Date().toISOString(),
      type: eventData.type || '',
      page: eventData.page || '',
      section: eventData.section || '',
      action: eventData.action || '',
      sessionId: eventData.data?.sessionId || '',
      scrollDepth: eventData.data?.scrollDepth || 0,
      timeSpent: eventData.data?.timeSpent || 0,
      success: eventData.data?.success || false,
      location: eventData.data?.location || '',
      referrer: eventData.referrer || '',
      userAgent: eventData.userAgent || '',
      screenWidth: eventData.screenWidth || 0,
      screenHeight: eventData.screenHeight || 0,
      // Additional data as JSON string
      additionalData: JSON.stringify(eventData.data || {}),
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rowData),
    });

    if (!response.ok) {
      console.error('Google Sheets API error:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Google Sheets error:', error);
    return null;
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const eventData = req.body;

    // Add to Google Sheets (async, don't wait)
    addToGoogleSheets(eventData).catch(err => {
      console.error('Google Sheets error (non-blocking):', err);
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Analytics event recorded' 
    });
  } catch (error) {
    console.error('Analytics xətası:', error);
    return res.status(500).json({ success: false, message: 'Analytics event record edilərkən xəta baş verdi' });
  }
}

