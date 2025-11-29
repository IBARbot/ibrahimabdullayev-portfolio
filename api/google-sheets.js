// Vercel Serverless Function - Google Sheets Integration
// This function appends booking data to Google Sheets

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

    if (!sheetId || !apiKey) {
      console.log('Google Sheets konfiqurasiyası yoxdur, skip edilir');
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

    // Append to Google Sheets using Google Sheets API v4
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:append?valueInputOption=RAW&key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    });

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

