// Vercel Serverless Function - Google Sheets Integration
// This function appends booking data to Google Sheets
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
    const bookingData = req.body;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!sheetId) {
      console.log('Google Sheets ID konfiqurasiya edilməyib, skip edilir');
      return res.status(200).json({ success: true, message: 'Google Sheets konfiqurasiya edilməyib' });
    }

    // Prepare row data
    const rowData = [
      new Date().toISOString(),
      bookingData.type || '',
      bookingData.name || '',
      bookingData.email || '',
      bookingData.phone || '',
      bookingData.from || '',
      bookingData.to || '',
      bookingData.departureDate || '',
      bookingData.returnDate || '',
      bookingData.passengers || '',
      bookingData.notes || '',
    ];

    let response;

    // Method 1: Service Account (Preferred)
    if (serviceAccountKey) {
      try {
        // Decode base64 service account key
        const serviceAccountJson = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
        const serviceAccount = JSON.parse(serviceAccountJson);

        // Get access token using Service Account
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

        // Exchange JWT for access token
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

        // Append to Google Sheets using access token
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:append?valueInputOption=RAW`;
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
        // Fallback to API Key method if Service Account fails
        if (apiKey) {
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:append?valueInputOption=RAW&key=${apiKey}`;
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
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:append?valueInputOption=RAW&key=${apiKey}`;
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
      console.error('Google Sheets xətası:', errorData);
      // Don't fail the booking if Google Sheets fails
      return res.status(200).json({ success: true, message: 'Sorğu qeydə alındı, amma Google Sheets-ə yazılmadı' });
    }

    return res.status(200).json({ success: true, message: 'Google Sheets-ə uğurla əlavə edildi' });
  } catch (error) {
    console.error('Google Sheets inteqrasiyası xətası:', error);
    // Don't fail the booking if Google Sheets fails
    return res.status(200).json({ success: true, message: 'Sorğu qeydə alındı, amma Google Sheets-ə yazılmadı' });
  }
}
