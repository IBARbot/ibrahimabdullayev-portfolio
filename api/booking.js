// Vercel Serverless Function - Booking API
import nodemailer from 'nodemailer';
import { applyCors, rateLimit, clientIp } from '../server/security.js';
import { sanitizeBookingData } from '../server/validation.js';
import { logApiError } from '../server/errorLogger.js';

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// E-poçt HTML-i üçün bütün sətirləri escape edir (rəqəmlər olduğu kimi qalır)
function deepEscape(value, depth = 0) {
  if (depth > 5) return '';
  if (typeof value === 'string') return escapeHtml(value);
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.slice(0, 20).map((v) => deepEscape(v, depth + 1));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepEscape(v, depth + 1);
    return out;
  }
  return value;
}

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
  applyCors(req, res, 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const limit = rateLimit(`booking:${clientIp(req)}`, 8, 10 * 60 * 1000);
  if (limit.limited) {
    res.setHeader('Retry-After', String(limit.retryAfter));
    return res.status(429).json({ success: false, message: 'Çox sayda sorğu. Bir az sonra yenidən cəhd edin.' });
  }

  try {
    let bookingData = req.body;
    
    // Validation: Email və ya telefon-dan ən azı biri mütləq olmalıdır
    if (!bookingData.type || (!bookingData.email && !bookingData.phone)) {
      await logApiError('/api/booking', new Error('Missing required fields: type, email or phone'), req);
      return res.status(400).json({ success: false, message: 'Zəhmət olmasa email və ya telefon nömrəsindən ən azı birini daxil edin.' });
    }
    
    // Sanitize and validate booking data
    try {
      bookingData = sanitizeBookingData(bookingData);
    } catch (validationError) {
      await logApiError('/api/booking', validationError, req);
      return res.status(400).json({ 
        success: false, 
        message: validationError.message || 'Validation error' 
      });
    }
    
    const newBooking = { 
      id: Date.now().toString(), 
      ...bookingData, 
      status: 'new', 
      createdAt: new Date().toISOString() 
    };
    
    // Send to Google Sheets directly
    if (process.env.GOOGLE_SHEET_ID && (process.env.GOOGLE_SHEETS_API_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY)) {
      try {
        // Import and call Google Sheets function directly
        const { appendBookingToSheets } = await import('../server/googleSheetsBooking.js');
        await appendBookingToSheets(bookingData);
        console.log('Booking data successfully sent to Google Sheets');
      } catch (err) {
        console.error('Google Sheets error:', err);
        console.error('Error stack:', err.stack);
        // Log error but don't fail the booking
        await logApiError('/api/booking', new Error(`Google Sheets error: ${err.message}`), req).catch(() => {});
      }
    }

    const transporter = createTransporter();
    if (transporter) {
      const safe = deepEscape(bookingData);
      const adminEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
      let emailSubject = `Yeni Rezervasiya Sorğusu - ${bookingData.type}`;
      let emailContent = `<h2>Yeni Rezervasiya Sorğusu</h2><p><strong>Ad:</strong> ${safe.name}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Telefon:</strong> ${safe.phone}</p><p><strong>Növ:</strong> ${safe.type}</p>`;
      
      if (bookingData.type === 'flight') {
        emailSubject = `Yeni Aviabilet Sorğusu`;
        emailContent += `<p><strong>Səyahət növü:</strong> ${safe.tripType || 'Təyin edilməyib'}</p>`;
        
        if (bookingData.tripType === 'one-way' || bookingData.tripType === 'round-trip') {
          emailContent += `<p><strong>Haradan:</strong> ${safe.from || 'Təyin edilməyib'}</p><p><strong>Hara:</strong> ${safe.to || 'Təyin edilməyib'}</p>`;
          emailContent += `<p><strong>Gediş tarixi:</strong> ${safe.departureDate || 'Təyin edilməyib'}</p>`;
          if (bookingData.tripType === 'round-trip') {
            emailContent += `<p><strong>Qayıdış tarixi:</strong> ${safe.returnDate || 'Təyin edilməyib'}</p>`;
          }
        } else if (bookingData.tripType === 'multi-city' && safe.segments) {
          emailContent += `<p><strong>Multi-şəhər uçuşlar:</strong></p><ul>`;
          safe.segments.forEach((segment, index) => {
            emailContent += `<li>${index + 1}. ${segment.from || 'Təyin edilməyib'} → ${segment.to || 'Təyin edilməyib'} (${segment.date || 'Təyin edilməyib'})</li>`;
          });
          emailContent += `</ul>`;
        }
        
        // Passenger info
        if (safe.passengerInfo) {
          const pi = safe.passengerInfo;
          emailContent += `<p><strong>Sərnişin detalları:</strong></p>`;
          emailContent += `<ul>`;
          emailContent += `<li>Böyüklər (12+): ${pi.adults || 0}</li>`;
          emailContent += `<li>Uşaqlar (2-11): ${pi.children || 0}${pi.childAges && pi.childAges.length > 0 ? ` (Yaşlar: ${pi.childAges.join(', ')})` : ''}</li>`;
          emailContent += `<li>Körpələr (0-23 ay): ${pi.infants || 0}${pi.infantAges && pi.infantAges.length > 0 ? ` (Aylar: ${pi.infantAges.join(', ')})` : ''}</li>`;
          if (pi.seniors) emailContent += `<li>Yaşlılar (65+): ${pi.seniors}</li>`;
          emailContent += `<li>Ümumi: ${(pi.adults || 0) + (pi.children || 0) + (pi.infants || 0) + (pi.seniors || 0)}</li>`;
          emailContent += `</ul>`;
        } else {
          emailContent += `<p><strong>Nəfər sayı:</strong> ${safe.passengers || 'Təyin edilməyib'}</p>`;
        }
        emailContent += `<p><strong>Sinif:</strong> ${safe.class || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Stopla:</strong> ${safe.stops || 'Təyin edilməyib'}</p>`;
      } else if (bookingData.type === 'hotel') {
        emailSubject = `Yeni Otel Rezervasiya Sorğusu - ${safe.destination || ''}`;
        emailContent += `<p><strong>Məkan:</strong> ${safe.destination || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Giriş:</strong> ${safe.checkIn || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Çıxış:</strong> ${safe.checkOut || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Otaq sayı:</strong> ${safe.rooms || 'Təyin edilməyib'}</p>`;
        // Guest info
        if (safe.guestInfo) {
          const gi = safe.guestInfo;
          emailContent += `<p><strong>Qonaq detalları:</strong></p>`;
          emailContent += `<ul>`;
          emailContent += `<li>Böyüklər (18+): ${gi.adults || 0}</li>`;
          emailContent += `<li>Uşaqlar (2-17): ${gi.children || 0}${gi.childAges && gi.childAges.length > 0 ? ` (Yaşlar: ${gi.childAges.join(', ')})` : ''}</li>`;
          emailContent += `<li>Körpələr (0-23 ay): ${gi.infants || 0}${gi.infantAges && gi.infantAges.length > 0 ? ` (Aylar: ${gi.infantAges.join(', ')})` : ''}</li>`;
          if (gi.seniors) emailContent += `<li>Yaşlılar (65+): ${gi.seniors}</li>`;
          emailContent += `<li>Ümumi: ${(gi.adults || 0) + (gi.children || 0) + (gi.infants || 0) + (gi.seniors || 0)}</li>`;
          emailContent += `</ul>`;
        } else {
          emailContent += `<p><strong>Nəfər sayı:</strong> ${safe.guests || 'Təyin edilməyib'}</p>`;
        }
        emailContent += `<p><strong>Otel növü:</strong> ${safe.hotelType || 'Təyin edilməyib'}</p>`;
      } else if (bookingData.type === 'transfer') {
        emailSubject = `Yeni Transfer Sorğusu`;
        emailContent += `<p><strong>Transfer növü:</strong> ${safe.transferType || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Haradan:</strong> ${safe.from || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Hara:</strong> ${safe.to || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Tarix:</strong> ${safe.date || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Vaxt:</strong> ${safe.time || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Nəqliyyat növü:</strong> ${safe.vehicleType || 'Təyin edilməyib'}</p>`;
        // Transfer passenger info
        if (safe.transferPassengerInfo) {
          const tpi = safe.transferPassengerInfo;
          emailContent += `<p><strong>Sərnişin detalları:</strong></p>`;
          emailContent += `<ul>`;
          emailContent += `<li>Böyüklər (18+): ${tpi.adults || 0}</li>`;
          emailContent += `<li>Uşaqlar (2-17): ${tpi.children || 0}${tpi.childAges && tpi.childAges.length > 0 ? ` (Yaşlar: ${tpi.childAges.join(', ')})` : ''}</li>`;
          emailContent += `<li>Körpələr (0-23 ay): ${tpi.infants || 0}${tpi.infantAges && tpi.infantAges.length > 0 ? ` (Aylar: ${tpi.infantAges.join(', ')})` : ''}</li>`;
          if (tpi.seniors) emailContent += `<li>Yaşlılar (65+): ${tpi.seniors}</li>`;
          emailContent += `<li>Ümumi: ${(tpi.adults || 0) + (tpi.children || 0) + (tpi.infants || 0) + (tpi.seniors || 0)}</li>`;
          emailContent += `</ul>`;
        }
        emailContent += `<p><strong>Nəfər sayı:</strong> ${safe.passengers || 'Təyin edilməyib'}</p>`;
      } else if (bookingData.type === 'insurance') {
        emailSubject = `Yeni Sığorta Sorğusu - ${safe.insuranceType || ''}`;
        emailContent += `<p><strong>Sığorta növü:</strong> ${safe.insuranceType || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Paket:</strong> ${safe.package || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Başlama tarixi:</strong> ${safe.startDate || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Bitmə tarixi:</strong> ${safe.endDate || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Əhatə dairəsi:</strong> ${safe.coverage || 'Təyin edilməyib'}</p>`;
      } else if (bookingData.type === 'embassy') {
        emailSubject = `Yeni Səfirlik Sorğusu - ${safe.embassyCountry || ''}`;
        emailContent += `<p><strong>Ölkə:</strong> ${safe.embassyCountry || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Viza növü:</strong> ${safe.visaType || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Təcili:</strong> ${safe.urgent ? 'Bəli' : 'Xeyr'}</p>`;
        // Embassy traveler info
        if (safe.embassyTravelerInfo) {
          const eti = safe.embassyTravelerInfo;
          emailContent += `<p><strong>Səyahətçi detalları:</strong></p>`;
          emailContent += `<ul>`;
          emailContent += `<li>Böyüklər (18+): ${eti.adults || 0}</li>`;
          emailContent += `<li>Uşaqlar (2-17): ${eti.children || 0}${eti.childAges && eti.childAges.length > 0 ? ` (Yaşlar: ${eti.childAges.join(', ')})` : ''}</li>`;
          emailContent += `<li>Körpələr (0-23 ay): ${eti.infants || 0}${eti.infantAges && eti.infantAges.length > 0 ? ` (Aylar: ${eti.infantAges.join(', ')})` : ''}</li>`;
          if (eti.seniors) emailContent += `<li>Yaşlılar (65+): ${eti.seniors}</li>`;
          emailContent += `<li>Ümumi: ${(eti.adults || 0) + (eti.children || 0) + (eti.infants || 0) + (eti.seniors || 0)}</li>`;
          emailContent += `</ul>`;
        }
      }
      
        emailContent += `<p><strong>Əlavə məlumat:</strong> ${safe.notes || 'Yoxdur'}</p>`;
      
      try {
        await transporter.sendMail({ 
          from: process.env.EMAIL_USER, 
          to: adminEmail, 
          subject: emailSubject, 
          html: emailContent, 
          replyTo: bookingData.email 
        });
      } catch (emailError) {
        console.error('Email xətası:', emailError);
      }
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Sorğunuz uğurla göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.', 
      bookingId: newBooking.id 
    });
  } catch (error) {
    console.error('Booking xətası:', error);
    // Log error to Google Sheets
    await logApiError('/api/booking', error, req).catch(err => 
      console.error('Failed to log error to Google Sheets:', err)
    );
    return res.status(500).json({ success: false, message: 'Sorğu göndərilərkən xəta baş verdi' });
  }
}
