// Vercel Serverless Function - Google Sheets Integration
// This function appends booking data to Google Sheets
import { appendBookingToSheets } from './utils/googleSheetsBooking.js';

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
    
    if (!process.env.GOOGLE_SHEET_ID) {
      console.log('Google Sheets ID konfiqurasiya edilməyib, skip edilir');
      return res.status(200).json({ success: true, message: 'Google Sheets konfiqurasiya edilməyib' });
    }

    // Use the shared utility function
    const responseData = await appendBookingToSheets(bookingData);
    
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
