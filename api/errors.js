// Combined API endpoint for error logging and initialization
import { logErrorToSheets, initializeErrorsSheet } from '../server/errorLogger.js';
import { applyCors, rateLimit, clientIp, requireAdmin } from '../server/security.js';

export default async function handler(req, res) {
  // CORS
  applyCors(req, res, 'POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ success: false, message: 'Bad request' });
    }
    const { action, ...errorInfo } = req.body;

    // Handle initialization request (yalnız admin)
    if (action === 'init') {
      if (!(await requireAdmin(req, res))) return;
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
    }

    // Açıq endpoint: bir IP-dən qısa müddətdə çox yazı qəbul edilmir
    const limit = rateLimit(`errors:${clientIp(req)}`, 20, 10 * 60 * 1000);
    if (limit.limited) {
      res.setHeader('Retry-After', String(limit.retryAfter));
      return res.status(429).json({ success: false, message: 'Too many requests' });
    }

    // Handle error logging request (default)
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
    console.error('Error in errors endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process error request' 
    });
  }
}





