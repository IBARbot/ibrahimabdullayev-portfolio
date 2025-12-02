// API endpoint for logging frontend errors to Google Sheets
import { logErrorToSheets } from './utils/errorLogger.js';

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
    const errorInfo = req.body;
    
    // Add request metadata
    errorInfo.userAgent = req.headers['user-agent'] || '';
    errorInfo.url = req.headers['referer'] || req.url || '';
    
    // Log to Google Sheets
    const logged = await logErrorToSheets({
      ...errorInfo,
      type: errorInfo.type || 'FRONTEND_ERROR',
    });

    return res.status(200).json({ 
      success: logged,
      message: logged ? 'Error logged successfully' : 'Failed to log error'
    });
  } catch (error) {
    console.error('Error in error-logger endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to log error' 
    });
  }
}

