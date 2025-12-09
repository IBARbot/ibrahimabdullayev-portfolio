// Vercel Blob Storage - Simple Image Upload
// Uploads images to Vercel Blob Storage and returns the URL
import jwt from 'jsonwebtoken';
import { put } from '@vercel/blob';

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
    const token = authHeader?.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ success: false, message: 'İcazə verilmədi - Token tapılmadı' });
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    try {
      jwt.verify(token, jwtSecret);
    } catch (jwtError) {
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
    const imageType = image.match(/data:image\/(\w+);base64/)?.[1] || 'png';
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Check if BLOB_READ_WRITE_TOKEN is configured
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is not configured');
      return res.status(400).json({
        success: false,
        message: 'Vercel Blob Storage konfiqurasiya edilməyib. Zəhmət olmasa Vercel Dashboard-da Blob Storage yaradın və BLOB_READ_WRITE_TOKEN environment variable əlavə edin.',
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const filename = `ibrahimabdullayev/${timestamp}_${randomId}.${imageType}`;

    console.log('📤 Uploading to Vercel Blob Storage...', {
      filename,
      imageType,
      size: buffer.length,
    });

    // Upload to Vercel Blob Storage
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: `image/${imageType}`,
      token: blobToken,
    });

    console.log('✅ Image uploaded to Vercel Blob Storage successfully');
    console.log('Blob URL:', blob.url);

    return res.status(200).json({
      success: true,
      url: blob.url,
      message: 'Şəkil Vercel Blob Storage-ə uğurla yükləndi',
    });
  } catch (error) {
    console.error('❌ Vercel Blob Storage upload error:', error);
    return res.status(500).json({
      success: false,
      message: `Şəkil yüklənərkən xəta baş verdi: ${error.message || 'Naməlum xəta'}`,
    });
  }
}

