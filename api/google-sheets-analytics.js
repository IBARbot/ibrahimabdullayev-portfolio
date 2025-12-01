// Vercel Serverless Function - Google Sheets Analytics Integration
// This function appends analytics data to Google Sheets (Analytics sheet)
import jwt from 'jsonwebtoken';

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
    const analyticsData = req.body;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

    if (!sheetId) {
      console.log('Google Sheets ID konfiqurasiya edilməyib, skip edilir');
      return res.status(200).json({ success: true, message: 'Google Sheets konfiqurasiya edilməyib' });
    }

    // Prepare row data for Analytics sheet
    // Structure: Tarix | Növ | Path | Element | Dəyər | Referrer | User Agent | Screen Size | IP
    const rowData = [
      analyticsData.timestamp || new Date().toISOString(), // Tarix
      analyticsData.type || '',                              // Növ (pageview, click, scroll)
      analyticsData.path || '',                             // Path
      analyticsData.element || analyticsData.depth || '',    // Element (button name) or Scroll depth
      analyticsData.value || '',                             // Additional value
      analyticsData.referrer || '',                         // Referrer
      analyticsData.userAgent ? analyticsData.userAgent.substring(0, 100) : '', // User Agent (truncated)
      analyticsData.screenWidth && analyticsData.screenHeight 
        ? `${analyticsData.screenWidth}x${analyticsData.screenHeight}` 
        : '', // Screen Size
      analyticsData.ip || '',                               // IP
    ];

    let response;

    // Method 1: Service Account (Preferred)
    if (serviceAccountKey) {
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
        if (!tokenData.access_token) {
          throw new Error('Access token alınamadı: ' + JSON.stringify(tokenData));
        }

        // Append to "Analytics" sheet (sheet name in the same spreadsheet)
        // If sheet doesn't exist, it will be created or you can create it manually
        const range = 'Analytics!A:I'; // 9 columns
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW`;
        
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenData.access_token}`,
          },
          body: JSON.stringify({
            values: [rowData],
          }),
        });
      } catch (serviceAccountError) {
        console.error('Service Account xətası:', serviceAccountError);
        if (apiKey) {
          const range = 'Analytics!A:I';
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW&key=${apiKey}`;
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              values: [rowData],
            }),
          });
        } else {
          throw serviceAccountError;
        }
      }
    }
    // Method 2: API Key (Fallback)
    else if (apiKey) {
      const range = 'Analytics!A:I';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW&key=${apiKey}`;
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData],
        }),
      });
    } else {
      console.log('Google Sheets konfiqurasiyası yoxdur, skip edilir');
      return res.status(200).json({ success: true, message: 'Google Sheets konfiqurasiya edilməyib' });
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Sheets Analytics xətası:', errorData);
      return res.status(200).json({ 
        success: true, 
        message: 'Analytics məlumatı qeydə alındı, amma Google Sheets-ə yazılmadı',
        error: errorData 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Analytics məlumatı Google Sheets-ə uğurla əlavə edildi' 
    });
  } catch (error) {
    console.error('Google Sheets Analytics inteqrasiyası xətası:', error);
    return res.status(200).json({ 
      success: true, 
      message: 'Analytics məlumatı qeydə alındı, amma Google Sheets-ə yazılmadı',
      error: error.message 
    });
  }
}





