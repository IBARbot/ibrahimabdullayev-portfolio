// Vercel Serverless Function - Admin API (Combined)
// Handles all admin routes: login, content, bookings, forgot-password, reset-password
import {
  applyCors,
  requireAdmin,
  safeEqual,
  signAdminToken,
  signResetToken,
  verifyResetToken,
  trustedSiteOrigin,
  rateLimit,
  clearRateLimit,
  clientIp,
  escapeHtml,
} from '../../server/security.js';
import { verifyAdminLogin, setAdminPassword, getPasswordChangedAt } from '../../server/adminAuth.js';
import nodemailer from 'nodemailer';
import { getContent, updateContent } from '../../server/contentStore.js';
import { logApiError } from '../../server/errorLogger.js';

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

// Sıfırlama linki etibarlıdırmı: imza/müddət + hələ istifadə olunmayıb
async function isResetTokenUsable(token) {
  try {
    const decoded = verifyResetToken(token);
    const changedAt = await getPasswordChangedAt();
    if (changedAt && (decoded.iat || 0) * 1000 < Math.floor(changedAt / 1000) * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  // CORS
  applyCors(req, res, 'GET,POST,PUT,OPTIONS');

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

  try {
    // Login route
    if (route === 'login' && req.method === 'POST') {
      const adminUsername = process.env.ADMIN_USERNAME;
      if (!adminUsername || !process.env.JWT_SECRET) {
        // Ehtiyat (default) parol yoxdur: konfiqurasiya tam deyilsə giriş bağlıdır
        console.error('Admin login disabled: ADMIN_USERNAME or JWT_SECRET is not set');
        return res.status(503).json({ success: false, message: 'Admin giriş konfiqurasiya edilməyib' });
      }

      const ipKey = `login:${clientIp(req)}`;
      const limit = rateLimit(ipKey, 5, 15 * 60 * 1000);
      if (limit.limited) {
        res.setHeader('Retry-After', String(limit.retryAfter));
        return res.status(429).json({ success: false, message: 'Çox sayda uğursuz cəhd. 15 dəqiqə sonra yenidən cəhd edin.' });
      }

      const { username, password } = req.body || {};
      let ok = false;
      try {
        ok = await verifyAdminLogin(username, password);
      } catch (error) {
        console.error('Admin login check failed:', error.message);
        return res.status(503).json({ success: false, message: 'Giriş hazırda mümkün deyil. Bir az sonra yenidən cəhd edin.' });
      }
      if (ok) {
        clearRateLimit(ipKey);
        return res.status(200).json({ success: true, token: signAdminToken(adminUsername) });
      }
      return res.status(401).json({ success: false, message: 'İstifadəçi adı və ya şifrə yanlışdır' });
    }

    // Forgot Password route (NO AUTHENTICATION REQUIRED)
    if (route === 'forgot-password' && req.method === 'POST') {
      const limit = rateLimit(`forgot:${clientIp(req)}`, 3, 60 * 60 * 1000);
      // Eyni cavab həmişə qaytarılır ki, e-poçtun admin olub-olmadığı bilinməsin
      const securityMessage = 'Əgər bu email ünvanı qeydiyyatdan keçibsə, şifrə sıfırlama linki email-ə göndəriləcək. Zəhmət olmasa email-ınızın gələnlər qutusunu və spam qovluğunu yoxlayın. Link 1 saat müddətində etibarlıdır.';
      const { email } = req.body || {};
      const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || process.env.EMAIL_USER;

      if (
        !limit.limited &&
        process.env.JWT_SECRET &&
        typeof email === 'string' &&
        adminEmail &&
        email.toLowerCase() === adminEmail.toLowerCase()
      ) {
        try {
          const resetToken = signResetToken(adminEmail);
          // Link yalnız etibarlı sayt ünvanına yönəldilir (Origin başlığına inanılmır)
          const resetLink = `${trustedSiteOrigin(req)}/admin/reset-password?token=${resetToken}`;
          const transporter = createTransporter();
          if (!transporter) {
            console.error('Email transporter is not configured (EMAIL_USER / EMAIL_PASS)');
          } else {
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: adminEmail,
              subject: 'Admin Panel - Şifrə Sıfırlama',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #0ea5e9;">Şifrə Sıfırlama</h2>
                  <p>Salam,</p>
                  <p>Admin panel üçün şifrə sıfırlama sorğusu aldıq. Şifrənizi sıfırlamaq üçün aşağıdakı linkə klikləyin:</p>
                  <p style="margin: 30px 0;">
                    <a href="${escapeHtml(resetLink)}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      Şifrəni Sıfırla
                    </a>
                  </p>
                  <p><strong>Qeyd:</strong> Bu link 1 saat müddətində etibarlıdır.</p>
                  <p>Əgər siz bu sorğunu göndərməmisinizsə, bu email-i nəzərə almayın.</p>
                </div>
              `,
            });
          }
        } catch (error) {
          console.error('Forgot password email error:', error.message);
        }
      }

      return res.status(200).json({ success: true, message: securityMessage });
    }

    // Reset linkini səhifə açılan kimi yoxlayır
    if (route === 'check-reset-token' && req.method === 'POST') {
      const { token } = req.body || {};
      const usable = typeof token === 'string' && token ? await isResetTokenUsable(token) : false;
      if (!usable) {
        return res.status(400).json({
          success: false,
          message: 'Link etibarsızdır, müddəti bitib və ya artıq istifadə olunub.'
        });
      }
      return res.status(200).json({ success: true });
    }

    // Reset Password route
    if (route === 'reset-password' && req.method === 'POST') {
      const { token, newPassword } = req.body || {};

      if (typeof token !== 'string' || typeof newPassword !== 'string' || !token || !newPassword) {
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

      if (!(await isResetTokenUsable(token))) {
        return res.status(400).json({
          success: false,
          message: 'Link etibarsızdır, müddəti bitib və ya artıq istifadə olunub. Zəhmət olmasa yeni şifrə sıfırlama linki istəyin.'
        });
      }

      // Yeni şifrə yalnız hash şəklində saxlanır (scrypt). E-poçtla göndərilmir.
      try {
        await setAdminPassword(newPassword);
      } catch (error) {
        console.error('Password reset store error:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Şifrə saxlanıla bilmədi. Google Sheets bağlantısını yoxlayın və yenidən cəhd edin.'
        });
      }

      const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
      const transporter = createTransporter();
      if (transporter && adminEmail) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: adminEmail,
            subject: 'Admin Panel - Şifrə dəyişdirildi',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0ea5e9;">Şifrə dəyişdirildi</h2>
                <p>Admin panel şifrəsi dəyişdirildi (Bakı vaxtı ilə ${escapeHtml(new Date().toLocaleString('az-AZ', { timeZone: 'Asia/Baku' }))}). Bütün köhnə sessiyalar bağlandı.</p>
                <p style="color: #d32f2f;">Bu əməliyyatı siz etməmisinizsə, dərhal Vercel-də <code>JWT_SECRET</code> dəyişənini yeniləyin və bizimlə əlaqə saxlayın.</p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error('Password reset notification email error:', emailError.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Şifrəniz uğurla dəyişdirildi. İndi yeni şifrə ilə daxil ola bilərsiniz.'
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

      // PUT üçün admin tələb olunur
      if (!(await requireAdmin(req, res))) return;

      if (req.method === 'PUT') {
        try {
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

    // Qalan marşrutlar yalnız admin üçündür
    if (!(await requireAdmin(req, res))) return;

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

