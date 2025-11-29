// Vercel Serverless Function - Reset Password API
// Resets admin password using token from email

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
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token və yeni şifrə tələb olunur' 
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Şifrə ən azı 8 simvol olmalıdır' 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      
      // Check if token is for password reset
      if (decoded.type !== 'password-reset') {
        return res.status(400).json({ 
          success: false, 
          message: 'Etibarsız token' 
        });
      }
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token müddəti bitib və ya etibarsızdır. Zəhmət olmasa yeni şifrə sıfırlama linki istəyin.' 
      });
    }

    // Update password in environment variable
    // Note: In Vercel, you need to manually update the ADMIN_PASSWORD environment variable
    // This API will return success, but you need to update it in Vercel dashboard
    
    // For now, we'll just return success and log the new password
    // In production, you might want to use a database or Vercel API to update env vars
    console.log('Password reset requested for:', decoded.email);
    console.log('New password (to be set in Vercel):', newPassword);

    return res.status(200).json({ 
      success: true, 
      message: 'Şifrə uğurla sıfırlandı! Zəhmət olmasa Vercel Dashboard-da ADMIN_PASSWORD environment variable-ını yeniləyin və saytı yenidən deploy edin.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Xəta baş verdi' 
    });
  }
}

