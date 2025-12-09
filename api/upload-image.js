// Vercel Serverless Function - Image Upload API
// Uploads images to Imgur and returns the URL
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
    // Check authentication
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    const token = authHeader?.replace('Bearer ', '').trim();
    if (!token) {
      console.error('No token provided');
      return res.status(401).json({ success: false, message: 'İcazə verilmədi - Token tapılmadı' });
    }

    console.log('Token received:', token.substring(0, 20) + '...');

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    try {
      const decoded = jwt.verify(token, jwtSecret);
      console.log('Token verified successfully, username:', decoded.username);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      console.error('JWT error name:', jwtError.name);
      return res.status(401).json({ 
        success: false, 
        message: 'İcazə verilmədi - Token etibarsızdır' 
      });
    }

    // Get image from request
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ success: false, message: 'Şəkil tapılmadı' });
    }

    // Remove data URL prefix if present (data:image/png;base64,...)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    
    // Upload to Imgur
    const imgurClientId = process.env.IMGUR_CLIENT_ID;
    
    if (!imgurClientId) {
      // Fallback: Return base64 as data URL (for development)
      console.warn('IMGUR_CLIENT_ID not configured, returning base64 data URL');
      return res.status(200).json({
        success: true,
        url: image, // Return as-is (base64 data URL)
        message: 'Şəkil base64 formatında qaytarıldı (Imgur konfiqurasiya edilməyib)',
      });
    }

    // Upload to Imgur using form-urlencoded
    const formData = new URLSearchParams();
    formData.append('image', base64Data);
    formData.append('type', 'base64');

    const imgurResponse = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${imgurClientId}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const imgurData = await imgurResponse.json();

    if (!imgurResponse.ok || !imgurData.success) {
      console.error('Imgur upload error:', imgurData);
      // Fallback: Return base64 as data URL
      return res.status(200).json({
        success: true,
        url: image,
        message: 'Şəkil base64 formatında qaytarıldı (Imgur xətası)',
      });
    }

    return res.status(200).json({
      success: true,
      url: imgurData.data.link,
      message: 'Şəkil uğurla yükləndi',
    });
  } catch (error) {
    console.error('Image upload error:', error);
    
    // Fallback: Try to return base64 if available
    if (req.body.image) {
      return res.status(200).json({
        success: true,
        url: req.body.image,
        message: 'Şəkil base64 formatında qaytarıldı (xəta baş verdi)',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Şəkil yüklənərkən xəta baş verdi',
    });
  }
}

