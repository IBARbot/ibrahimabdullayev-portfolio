// Vercel Serverless Function - Admin API (Combined)
// Handles all admin routes: login, content, bookings, forgot-password, reset-password
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { getContent, updateContent } from '../utils/contentStore.js';
import { logApiError } from '../utils/errorLogger.js';

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle Vercel path parsing
  let route = '';
  if (req.query.path) {
    const path = req.query.path;
    const pathArray = Array.isArray(path) ? path : [path];
    route = pathArray.filter(Boolean).join('/');
  } else if (req.url) {
    // Fallback: parse from URL
    const urlPath = req.url.split('?')[0];
    const match = urlPath.match(/\/api\/admin\/(.+)$/);
    if (match) {
      route = match[1];
    }
  }

  console.log('=== ADMIN API REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Query:', JSON.stringify(req.query));
  console.log('Route:', route);
  console.log('Route === "forgot-password":', route === 'forgot-password');

  try {
    // Login route
    if (route === 'login' && req.method === 'POST') {
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
    }

    // Forgot Password route (NO AUTHENTICATION REQUIRED)
    if (route === 'forgot-password' && req.method === 'POST') {
      console.log('✅ FORGOT PASSWORD ROUTE MATCHED');
      const { email } = req.body;
      const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || process.env.EMAIL_USER;

      // Security: Always return the same message regardless of email validity
      // This prevents email enumeration attacks
      const securityMessage = 'Əgər bu email ünvanı qeydiyyatdan keçibsə, şifrə sıfırlama linki email-ə göndəriləcək. Zəhmət olmasa email-ınızın gələnlər qutusunu və spam qovluğunu yoxlayın. Link 1 saat müddətində etibarlıdır.';

      // Only send email if email matches admin email
      console.log('=== FORGOT PASSWORD REQUEST ===');
      console.log('Requested email:', email);
      console.log('Admin email from env:', adminEmail);
      console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
      console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
      
      if (email && adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) {
        console.log('Email matches admin email, proceeding with reset...');
        try {

          const resetToken = jwt.sign(
            { 
              email: adminEmail,
              type: 'password-reset',
              timestamp: Date.now()
            },
            process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            { expiresIn: '1h' }
          );

          const resetLink = `${req.headers.origin || 'https://ibrahimabdullayev.com'}/admin/reset-password?token=${resetToken}`;
          console.log('Reset link generated:', resetLink);

          const transporter = createTransporter();
          if (!transporter) {
            console.error('❌ Email transporter yaradıla bilmədi! EMAIL_USER və ya EMAIL_PASS yoxdur.');
            console.error('EMAIL_USER:', process.env.EMAIL_USER || 'YOXDUR');
            console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? 'MÖVCUDDUR (uzunluq: ' + process.env.EMAIL_PASS.length + ')' : 'YOXDUR');
          } else {
            console.log('✅ Email transporter yaradıldı');
            console.log('📧 Email göndərilir:', adminEmail);
            try {
              const emailResult = await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: adminEmail,
                subject: 'Admin Panel - Şifrə Sıfırlama',
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #0ea5e9;">Şifrə Sıfırlama</h2>
                  <p>Salam,</p>
                  <p>Admin panel üçün şifrə sıfırlama sorğusu aldıq. Şifrənizi sıfırlamaq üçün aşağıdakı linkə klikləyin:</p>
                  <p style="margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      Şifrəni Sıfırla
                    </a>
                  </p>
                  <p>Və ya bu linki brauzerinizə kopyalayın:</p>
                  <p style="word-break: break-all; color: #666;">${resetLink}</p>
                  <p><strong>Qeyd:</strong> Bu link 1 saat müddətində etibarlıdır.</p>
                  <p>Əgər siz bu sorğunu göndərməmisinizsə, bu email-i nəzərə almayın.</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                  <p style="color: #666; font-size: 12px;">Bu avtomatik email-dir, cavab göndərməyin.</p>
                </div>
              `,
              });
              console.log('✅ Email uğurla göndərildi!');
              console.log('Message ID:', emailResult.messageId);
              console.log('Response:', emailResult.response);
            } catch (emailError) {
              console.error('❌ Email göndərmə xətası:', emailError);
              console.error('Error code:', emailError.code);
              console.error('Error command:', emailError.command);
              console.error('Error response:', emailError.response);
              throw emailError; // Re-throw to be caught by outer catch
            }
          }
        } catch (error) {
          console.error('Forgot password email error:', error);
          console.error('Error details:', error.message);
          console.error('Error stack:', error.stack);
          // Still return success message for security
        }
      } else {
        console.log('Email uyğun gəlmir və ya adminEmail yoxdur');
        console.log('Requested email:', email);
        console.log('Admin email:', adminEmail);
      }

      // Always return the same message (security best practice)
      return res.status(200).json({ 
        success: true, 
        message: securityMessage
      });
    }

    // Reset Password route
    if (route === 'reset-password' && req.method === 'POST') {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ 
          success: false, 
          message: 'Token və yeni şifrə tələb olunur' 
        });
      }

      // Şifrə validasiyası - güclü şifrə tələbləri
      const passwordErrors = [];
      if (newPassword.length < 8) {
        passwordErrors.push('ən azı 8 simvol');
      }
      if (!/[A-Z]/.test(newPassword)) {
        passwordErrors.push('ən azı bir böyük hərf');
      }
      if (!/[a-z]/.test(newPassword)) {
        passwordErrors.push('ən azı bir kiçik hərf');
      }
      if (!/[0-9]/.test(newPassword)) {
        passwordErrors.push('ən azı bir rəqəm');
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
        passwordErrors.push('ən azı bir xüsusi simvol (!@#$%^&* və s.)');
      }

      if (passwordErrors.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Şifrə tələbləri: ${passwordErrors.join(', ')}` 
        });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
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

      console.log('Password reset requested for:', decoded.email);
      console.log('New password validated successfully');

      // Şifrə sıfırlandıqdan sonra bildiriş email göndər
      const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
      const transporter = createTransporter();
      
      if (transporter && adminEmail) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: adminEmail,
            subject: 'Admin Panel - Şifrə Sıfırlandı',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0ea5e9;">Şifrə Sıfırlandı</h2>
                <p>Salam,</p>
                <p>Admin panel şifrəniz uğurla sıfırlandı.</p>
                <p><strong>Yeni şifrə təyin edildi:</strong> ${new Date().toLocaleString('az-AZ')}</p>
                <p><strong>Vacib:</strong> Yeni şifrəni Vercel Dashboard-da tətbiq etmək üçün:</p>
                <ol style="line-height: 1.8;">
                  <li>Vercel Dashboard → Settings → Environment Variables</li>
                  <li><code>ADMIN_PASSWORD</code> dəyişənini tapın</li>
                  <li>Dəyəri yeniləyin: <code>${newPassword}</code></li>
                  <li>Deployment-i yeniləyin (Redeploy)</li>
                </ol>
                <p style="color: #d32f2f; font-weight: bold;">Qeyd: Şifrəni təhlükəsiz saxlayın və heç kimlə paylaşmayın.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">Bu avtomatik email-dir, cavab göndərməyin.</p>
              </div>
            `,
          });
          console.log('Password reset notification email sent');
        } catch (emailError) {
          console.error('Password reset notification email error:', emailError);
        }
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Şifrə uğurla sıfırlandı! Bildiriş email göndərildi. Zəhmət olmasa Vercel Dashboard-da ADMIN_PASSWORD environment variable-ını yeniləyin və saytı yenidən deploy edin.' 
      });
    }

    // Content route
    if (route === 'content') {
      // Public GET: frontend (About, Projects, Footer, Hero) oxuya bilsin
      if (req.method === 'GET') {
        try {
          const current = await getContent();
          // Validate content structure
          if (current && typeof current === 'object' && current.hero && current.about) {
            return res.status(200).json(current);
          } else {
            console.warn('Content structure invalid, using default');
            // Return default content directly
            const defaultContent = {
              hero: {
                title: 'Salam, mən İbrahim Abdullayev',
                subtitle: 'Aviabilet və Rezervasiya Sistemləri üzrə Mütəxəssis',
                description: 'Aviabilet rezervasiyası, otel booking, transfer xidmətləri, sığorta və səfirlik işləri üzrə peşəkar məsləhətçi. GDS, NDC və Direct Sell UI üzrə mentor kimi illər boyu təcrübəmlə səyahətçilərə ən uyğun və təhlükəsiz həlləri təqdim edirəm.',
                image: '/profile.jpg',
              },
              about: {
                title: 'Haqqımda',
                content: 'Turizm və aviasiya sahəsində çoxillik təcrübəyə malik mütəxəssis kimi əsas fokusum aviabilet satışları, tariflərin düzgün hesablanması və müştərilərə ən optimal marşrutların təklif edilməsidir.\n\nGDS sistemləri (Amadeus, Galileo və s.), NDC interfeysləri və aviaşirkətlərin birbaşa satış platformaları ilə intensiv işləyərək həm sərnişin, həm də yük daşımalarında (Air Cargo) effektiv və sürətli həllər təqdim edirəm.\n\nMəqsədim – hər bir müştərinin büdcə, rahatlıq və təhlükəsizlik meyarlarına uyğun olaraq, şəffaf və peşəkar xidmət göstərməkdir.',
              },
              contact: {
                email: 'ibrahim.abdullayev1@gmail.com',
                phone: '+994 55 597 39 23',
                address: 'Baku, Rashid Behbudov str, Azerbaijan',
                linkedin: 'https://linkedin.com/in/ibrahim-abdullayev-7bb887152',
                instagram: 'https://instagram.com/ibrahim_abdullar',
                whatsapp: 'https://wa.me/994555973923',
              },
              portfolio: [],
              certificates: [],
              videos: [],
              socialLinks: [],
            };
            return res.status(200).json(defaultContent);
          }
        } catch (error) {
          console.error('Error loading content:', error);
          // Return default content structure on error
          const defaultContent = {
            hero: {
              title: 'Salam, mən İbrahim Abdullayev',
              subtitle: 'Aviabilet və Rezervasiya Sistemləri üzrə Mütəxəssis',
              description: 'Aviabilet rezervasiyası, otel booking, transfer xidmətləri, sığorta və səfirlik işləri üzrə peşəkar məsləhətçi. GDS, NDC və Direct Sell UI üzrə mentor kimi illər boyu təcrübəmlə səyahətçilərə ən uyğun və təhlükəsiz həlləri təqdim edirəm.',
              image: '/profile.jpg',
            },
            about: {
              title: 'Haqqımda',
              content: 'Turizm və aviasiya sahəsində çoxillik təcrübəyə malik mütəxəssis kimi əsas fokusum aviabilet satışları, tariflərin düzgün hesablanması və müştərilərə ən optimal marşrutların təklif edilməsidir.\n\nGDS sistemləri (Amadeus, Galileo və s.), NDC interfeysləri və aviaşirkətlərin birbaşa satış platformaları ilə intensiv işləyərək həm sərnişin, həm də yük daşımalarında (Air Cargo) effektiv və sürətli həllər təqdim edirəm.\n\nMəqsədim – hər bir müştərinin büdcə, rahatlıq və təhlükəsizlik meyarlarına uyğun olaraq, şəffaf və peşəkar xidmət göstərməkdir.',
            },
            contact: {
              email: 'ibrahim.abdullayev1@gmail.com',
              phone: '+994 55 597 39 23',
              address: 'Baku, Rashid Behbudov str, Azerbaijan',
              linkedin: 'https://linkedin.com/in/ibrahim-abdullayev-7bb887152',
              instagram: 'https://instagram.com/ibrahim_abdullar',
              whatsapp: 'https://wa.me/994555973923',
            },
            portfolio: [],
            certificates: [],
            videos: [],
            socialLinks: [],
          };
          return res.status(200).json(defaultContent);
        }
      }

      // PUT üçün authentication tələb olunur
      console.log('⚠️ Content PUT - checking authentication...');
      const authHeader = req.headers.authorization;
      console.log('Auth header exists:', !!authHeader);
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('❌ Unauthorized - No auth header or invalid format');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      if (req.method === 'PUT') {
        try {
          console.log('Content update request received');
          console.log('Content size:', JSON.stringify(req.body || {}).length, 'characters');
          
          const updated = await updateContent(req.body || {});
          return res
            .status(200)
            .json({ success: true, message: 'Məzmun yeniləndi', content: updated });
        } catch (error) {
          console.error('Content update error:', error);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          
          await logApiError('/api/admin/content', error, req).catch(err => 
            console.error('Failed to log error:', err)
          );
          
          // Return more specific error message
          const errorMessage = error.message || 'Xəta baş verdi';
          return res.status(500).json({ 
            success: false, 
            message: errorMessage 
          });
        }
      }

      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Check authentication for other protected routes (bookings, etc.)
    console.log('⚠️ Route not matched as public route, checking authentication...');
    console.log('Route:', route);
    console.log('Method:', req.method);
    const authHeader = req.headers.authorization;
    console.log('Auth header exists:', !!authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ Unauthorized - No auth header or invalid format');
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Bookings route
    if (route === 'bookings') {
      // In-memory storage
      let bookingsData = [];

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

    return res.status(404).json({ success: false, message: 'Route not found' });
  } catch (error) {
    console.error('Admin API error:', error);
    // Log error to Google Sheets
    await logApiError('/api/admin', error, req).catch(err => 
      console.error('Failed to log error to Google Sheets:', err)
    );
    return res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
}

