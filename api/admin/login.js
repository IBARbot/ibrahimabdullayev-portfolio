// Vercel Serverless Function - Admin Login API
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
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign(
        { username: adminUsername }, 
        process.env.JWT_SECRET || 'your-secret-key-change-in-production', 
        { expiresIn: '24h' }
      );
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: 'İstifadəçi adı və ya şifrə yanlışdır' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
}


