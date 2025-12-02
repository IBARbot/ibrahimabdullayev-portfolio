// Error Logger - Saves errors to Google Sheets "Errors" page
import jwt from 'jsonwebtoken';

// Get access token for Google Sheets API
async function getAccessToken() {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) return null;

  try {
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
        scope: 'https://www.googleapis.com/auth/spreadsheets',
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
    return tokenData.access_token || null;
  } catch (error) {
    console.error('Error getting access token for error logger:', error);
    return null;
  }
}

/**
 * Log error to Google Sheets "Errors" page
 * @param {Object} errorInfo - Error information object
 * @param {string} errorInfo.type - Error type (e.g., 'API_ERROR', 'VALIDATION_ERROR', 'FRONTEND_ERROR')
 * @param {string} errorInfo.endpoint - API endpoint or page where error occurred
 * @param {string} errorInfo.message - Error message
 * @param {string} errorInfo.stack - Error stack trace (optional)
 * @param {Object} errorInfo.data - Additional data (request body, user info, etc.)
 * @param {string} errorInfo.userAgent - User agent string
 * @param {string} errorInfo.url - URL where error occurred
 */
export async function logErrorToSheets(errorInfo) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    console.error('Google Sheets ID not configured, error not logged:', errorInfo);
    return false;
  }

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error('Could not get access token, error not logged:', errorInfo);
      return false;
    }

    // Prepare error row data
    const rowData = [
      new Date().toISOString(), // Timestamp
      errorInfo.type || 'UNKNOWN_ERROR', // Error type
      errorInfo.endpoint || 'N/A', // Endpoint/Page
      errorInfo.message || 'No message', // Error message
      errorInfo.stack || '', // Stack trace
      errorInfo.data ? JSON.stringify(errorInfo.data) : '', // Additional data
      errorInfo.userAgent || '', // User agent
      errorInfo.url || '', // URL
      errorInfo.statusCode || '', // HTTP status code
      errorInfo.method || '', // HTTP method
    ];

    // Append to "Errors" sheet
    const range = 'Errors!A:J';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error saving to Google Sheets:', errorText);
      return false;
    }

    console.log('Error logged to Google Sheets successfully');
    return true;
  } catch (error) {
    console.error('Error logging to Google Sheets:', error);
    return false;
  }
}

/**
 * Helper function to log API errors
 */
export async function logApiError(endpoint, error, req = null) {
  const errorInfo = {
    type: 'API_ERROR',
    endpoint: endpoint,
    message: error.message || String(error),
    stack: error.stack || '',
    data: req ? {
      method: req.method,
      body: req.body,
      query: req.query,
      headers: {
        'user-agent': req.headers['user-agent'],
        'referer': req.headers['referer'],
      },
    } : null,
    userAgent: req?.headers['user-agent'] || '',
    url: req?.url || '',
    statusCode: error.statusCode || 500,
    method: req?.method || '',
  };

  return await logErrorToSheets(errorInfo);
}

/**
 * Helper function to log frontend errors
 */
export async function logFrontendError(error, context = {}) {
  const errorInfo = {
    type: 'FRONTEND_ERROR',
    endpoint: context.page || 'UNKNOWN',
    message: error.message || String(error),
    stack: error.stack || '',
    data: {
      ...context,
      errorName: error.name,
    },
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  // Call API endpoint to log error
  try {
    await fetch('/api/error-logger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorInfo),
    });
  } catch (fetchError) {
    console.error('Failed to log frontend error:', fetchError);
  }
}

