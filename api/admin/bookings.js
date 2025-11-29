// Vercel Serverless Function - Admin Bookings API
import jwt from 'jsonwebtoken';

// In-memory storage
let bookingsData = [];

const authenticateToken = (headers) => {
  const authHeader = headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return { error: { status: 401, message: 'Token tələb olunur' } };
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    return { user };
  } catch (err) {
    return { error: { status: 403, message: 'Token etibarsızdır' } };
  }
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const auth = authenticateToken(req.headers);
  if (auth.error) {
    return res.status(auth.error.status).json({ success: false, message: auth.error.message });
  }

  if (req.method === 'GET') {
    try {
      return res.status(200).json({ success: true, bookings: bookingsData });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Xəta baş verdi' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, status } = req.body;
      const bookingIndex = bookingsData.findIndex(b => b.id === id);
      if (bookingIndex === -1) {
        return res.status(404).json({ success: false, message: 'Sorğu tapılmadı' });
      }
      bookingsData[bookingIndex].status = status;
      bookingsData[bookingIndex].updatedAt = new Date().toISOString();
      return res.status(200).json({ success: true, booking: bookingsData[bookingIndex] });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Xəta baş verdi' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}


