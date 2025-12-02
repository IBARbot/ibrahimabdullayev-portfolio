// API endpoint to initialize Errors sheet headers
import { initializeErrorsSheet } from './utils/errorLogger.js';

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
    const initialized = await initializeErrorsSheet();
    
    if (initialized) {
      return res.status(200).json({ 
        success: true,
        message: 'Errors sheet headers initialized successfully'
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to initialize Errors sheet headers. Please check Google Sheets configuration.' 
      });
    }
  } catch (error) {
    console.error('Error in init-errors-sheet endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to initialize Errors sheet headers' 
    });
  }
}


