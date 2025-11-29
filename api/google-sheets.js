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

    console.log('Google Sheets API çağırışı başladı');
    console.log('Sheet ID:', sheetId ? 'Mövcuddur' : 'Yoxdur');
    console.log('Service Account Key:', serviceAccountKey ? 'Mövcuddur' : 'Yoxdur');
    console.log('API Key:', apiKey ? 'Mövcuddur' : 'Yoxdur');

    if (!sheetId) {
      console.log('Google Sheets ID konfiqurasiya edilməyib, skip edilir');
      return res.status(200).json({ success: true, message: 'Google Sheets konfiqurasiya edilməyib' });
    }

    // Prepare row data - matches your Google Sheets structure (5 columns: Tarix, Növ, Ad, Email, Telefon)
    const rowData = [
      new Date().toISOString(), // A: Tarix
      bookingData.type || '',   // B: Növ
      bookingData.name || '',   // C: Ad
      bookingData.email || '',  // D: Email
      bookingData.phone || '',  // E: Telefon
    ];

    console.log('Göndəriləcək məlumat:', rowData);

    let response;

    // Method 1: Service Account (Preferred)
    if (serviceAccountKey) {
      try {
        console.log('Service Account metodu istifadə olunur...');
        // Decode base64 service account key
        const serviceAccountJson = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
        const serviceAccount = JSON.parse(serviceAccountJson);

        console.log('Service Account email:', serviceAccount.client_email);

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

        console.log('JWT token yaradıldı, access token alınır...');

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
        console.log('Token response status:', tokenResponse.status);
        
        if (!tokenData.access_token) {
          console.error('Access token alınamadı:', JSON.stringify(tokenData));
          throw new Error('Access token alınamadı: ' + JSON.stringify(tokenData));
        }

        console.log('Access token alındı, Google Sheets-ə yazılır...');

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

        console.log('Google Sheets API response status:', response.status);
      } catch (serviceAccountError) {
        console.error('Service Account xətası:', serviceAccountError);
        console.error('Error details:', serviceAccountError.message);
        // Fallback to API Key method if Service Account fails
        if (apiKey) {
          console.log('API Key metodu ilə yenidən cəhd edilir...');
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
          console.log('API Key metodu response status:', response.status);
        } else {
          throw serviceAccountError;
        }
      }
    }
    // Method 2: API Key (Fallback)
    else if (apiKey) {
      console.log('API Key metodu istifadə olunur...');
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
      console.log('API Key metodu response status:', response.status);
    } else {
      console.log('Google Sheets konfiqurasiyası yoxdur, skip edilir');
      return res.status(200).json({ success: true, message: 'Google Sheets konfiqurasiya edilməyib' });
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Sheets API xətası - Status:', response.status);
      console.error('Google Sheets API xətası - Response:', errorData);
      // Don't fail the booking if Google Sheets fails
      return res.status(200).json({ 
        success: true, 
        message: 'Sorğu qeydə alındı, amma Google Sheets-ə yazılmadı',
        error: errorData 
      });
    }

    const responseData = await response.json();
    console.log('Google Sheets-ə uğurla yazıldı:', responseData);

    return res.status(200).json({ 
      success: true, 
      message: 'Google Sheets-ə uğurla əlavə edildi',
      data: responseData 
    });
  } catch (error) {
    console.error('Google Sheets inteqrasiyası ümumi xətası:', error);
    console.error('Error stack:', error.stack);
    // Don't fail the booking if Google Sheets fails
    return res.status(200).json({ 
      success: true, 
      message: 'Sorğu qeydə alındı, amma Google Sheets-ə yazılmadı',
      error: error.message 
    });
  }
}
