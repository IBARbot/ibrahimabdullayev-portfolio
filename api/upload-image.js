// Vercel Serverless Function - Image Upload API
// Uploads images to Cloudinary (or Imgur fallback) and returns the URL
import { applyCors, requireAdmin } from '../server/security.js';

export default async function handler(req, res) {
  // CORS
  applyCors(req, res, 'POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Yalnız admin yükləyə bilər
    if (!(await requireAdmin(req, res))) return;

    // Get image from request
    const { image } = req.body || {};
    
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ success: false, message: 'Şəkil tapılmadı' });
    }
    if (image.length > 7_000_000) {
      return res.status(413).json({ success: false, message: 'Şəkil çox böyükdür (maksimum ~5 MB)' });
    }

    // Remove data URL prefix if present (data:image/png;base64,...)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageType = image.match(/^data:image\/(png|jpe?g|webp|gif);base64,/i)?.[1]?.toLowerCase();
    if (!imageType) {
      return res.status(400).json({ success: false, message: 'Yalnız PNG, JPG, WEBP və GIF şəkilləri qəbul olunur' });
    }
    
    // Try Imgur first (easier, no configuration issues)
    const imgurClientId = process.env.IMGUR_CLIENT_ID;
    if (imgurClientId) {
      try {
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

        if (imgurResponse.ok && imgurData.success && imgurData.data?.link) {
          console.log('✅ Image uploaded to Imgur successfully');
          return res.status(200).json({
            success: true,
            url: imgurData.data.link,
            message: 'Şəkil Imgur-a uğurla yükləndi',
          });
        } else {
          console.error('❌ Imgur upload error:', imgurData);
        }
      } catch (imgurError) {
        console.error('❌ Imgur upload exception:', imgurError);
      }
    }

    // Try Cloudinary second (if Imgur not configured or failed)
    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    
    if (cloudinaryCloudName) {
      try {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;
        const cloudinaryFormData = new URLSearchParams();
        
        // Generate a unique public_id without slashes to avoid "Display name cannot contain slashes" error
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const publicId = `ibrahimabdullayev_${timestamp}_${randomId}`;
        
        // Use base64 data directly (not as data URL)
        cloudinaryFormData.append('file', `data:image/${imageType};base64,${base64Data}`);
        cloudinaryFormData.append('upload_preset', cloudinaryUploadPreset);
        cloudinaryFormData.append('public_id', publicId); // Explicitly set public_id without slashes
        
        // IMPORTANT: Don't add folder parameter here - it causes "Display name cannot contain slashes" error
        // If you need folder organization, configure it in the upload preset settings in Cloudinary dashboard

        console.log('📤 Uploading to Cloudinary...', {
          cloudName: cloudinaryCloudName,
          preset: cloudinaryUploadPreset,
          imageType: imageType,
          base64Size: base64Data.length,
          publicId: publicId,
        });

        const cloudinaryResponse = await fetch(cloudinaryUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: cloudinaryFormData.toString(),
        });

        const cloudinaryData = await cloudinaryResponse.json();

        if (cloudinaryResponse.ok && cloudinaryData.secure_url) {
          console.log('✅ Image uploaded to Cloudinary successfully');
          console.log('Cloudinary URL:', cloudinaryData.secure_url);
          return res.status(200).json({
            success: true,
            url: cloudinaryData.secure_url,
            message: 'Şəkil Cloudinary-ə uğurla yükləndi',
          });
        } else {
          console.error('❌ Cloudinary upload error:', cloudinaryData);
          // Log detailed error for debugging
          let errorMessage = 'Cloudinary upload uğursuz oldu';
          if (cloudinaryData.error) {
            console.error('Cloudinary error details:', {
              message: cloudinaryData.error.message,
              http_code: cloudinaryData.error.http_code,
            });
            
            errorMessage = cloudinaryData.error.message || errorMessage;
            
            // If error is about display name/slashes, it might be upload preset configuration issue
            if (cloudinaryData.error.message && cloudinaryData.error.message.includes('Display name')) {
              console.error('💡 TIP: Upload preset konfiqurasiyasını yoxlayın:');
              console.error('   1. Asset folder BOŞ olmalıdır');
              console.error('   2. "Prepend a path to the public ID" toggle OFF olmalıdır');
              console.error('   3. "Generated display name" - filename istifadə edilməlidir');
              errorMessage = 'Display name xətası: Upload preset-də "Asset folder" və "Prepend a path to the public ID" parametrlərini yoxlayın. Hər ikisi boş/OFF olmalıdır.';
            }
          }
          
          // Don't fallback to base64 - return error instead
          return res.status(400).json({
            success: false,
            message: errorMessage,
            error: cloudinaryData.error || cloudinaryData,
          });
        }
      } catch (cloudinaryError) {
        console.error('❌ Cloudinary upload exception:', cloudinaryError);
        console.error('Exception details:', cloudinaryError.message);
        
        // Don't fallback to base64 - return error instead
        return res.status(500).json({
          success: false,
          message: `Cloudinary upload xətası: ${cloudinaryError.message || 'Naməlum xəta'}`,
        });
      }
    }

    // Imgur already tried above, skip duplicate code

    // No cloud storage configured - return error instead of base64
    console.error('❌ No cloud storage configured (Cloudinary və ya Imgur)');
    return res.status(400).json({
      success: false,
      message: 'Şəkil yükləmə konfiqurasiya edilməyib. Zəhmət olmasa Cloudinary və ya Imgur konfiqurasiyasını yoxlayın.',
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

