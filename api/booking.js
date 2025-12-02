// Vercel Serverless Function - Booking API
import nodemailer from 'nodemailer';
import { sanitizeBookingData } from './utils/validation.js';
import { logApiError } from './utils/errorLogger.js';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
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
    
    // Send to Google Sheets (async, don't wait)
    if (process.env.GOOGLE_SHEET_ID && (process.env.GOOGLE_SHEETS_API_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_KEY)) {
      try {
        const sheetsUrl = `${req.headers.origin || 'https://ibrahimabdullayev-portfolio.vercel.app'}/api/google-sheets`;
        fetch(sheetsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        }).catch(err => console.error('Google Sheets error:', err));
      } catch (err) {
        console.error('Google Sheets request error:', err);
      }
    }

    const transporter = createTransporter();
    if (transporter) {
      const adminEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
      let emailSubject = `Yeni Rezervasiya Sorğusu - ${bookingData.type}`;
      let emailContent = `<h2>Yeni Rezervasiya Sorğusu</h2><p><strong>Ad:</strong> ${bookingData.name}</p><p><strong>Email:</strong> ${bookingData.email}</p><p><strong>Telefon:</strong> ${bookingData.phone}</p><p><strong>Növ:</strong> ${bookingData.type}</p>`;
      
      if (bookingData.type === 'flight') {
        emailSubject = `Yeni Aviabilet Sorğusu`;
        emailContent += `<p><strong>Səyahət növü:</strong> ${bookingData.tripType || 'Təyin edilməyib'}</p>`;
        
        if (bookingData.tripType === 'one-way' || bookingData.tripType === 'round-trip') {
          emailContent += `<p><strong>Haradan:</strong> ${bookingData.from || 'Təyin edilməyib'}</p><p><strong>Hara:</strong> ${bookingData.to || 'Təyin edilməyib'}</p>`;
          emailContent += `<p><strong>Gediş tarixi:</strong> ${bookingData.departureDate || 'Təyin edilməyib'}</p>`;
          if (bookingData.tripType === 'round-trip') {
            emailContent += `<p><strong>Qayıdış tarixi:</strong> ${bookingData.returnDate || 'Təyin edilməyib'}</p>`;
          }
        } else if (bookingData.tripType === 'multi-city' && bookingData.segments) {
          emailContent += `<p><strong>Multi-şəhər uçuşlar:</strong></p><ul>`;
          bookingData.segments.forEach((segment, index) => {
            emailContent += `<li>${index + 1}. ${segment.from || 'Təyin edilməyib'} → ${segment.to || 'Təyin edilməyib'} (${segment.date || 'Təyin edilməyib'})</li>`;
          });
          emailContent += `</ul>`;
        }
        
        // Passenger info
        if (bookingData.passengerInfo) {
          const pi = bookingData.passengerInfo;
          emailContent += `<p><strong>Sərnişin detalları:</strong></p>`;
          emailContent += `<ul>`;
          emailContent += `<li>Böyüklər (12+): ${pi.adults || 0}</li>`;
          emailContent += `<li>Uşaqlar (2-11): ${pi.children || 0}${pi.childAges && pi.childAges.length > 0 ? ` (Yaşlar: ${pi.childAges.join(', ')})` : ''}</li>`;
          emailContent += `<li>Körpələr (0-23 ay): ${pi.infants || 0}${pi.infantAges && pi.infantAges.length > 0 ? ` (Aylar: ${pi.infantAges.join(', ')})` : ''}</li>`;
          if (pi.seniors) emailContent += `<li>Yaşlılar (65+): ${pi.seniors}</li>`;
          emailContent += `<li>Ümumi: ${(pi.adults || 0) + (pi.children || 0) + (pi.infants || 0) + (pi.seniors || 0)}</li>`;
          emailContent += `</ul>`;
        } else {
          emailContent += `<p><strong>Nəfər sayı:</strong> ${bookingData.passengers || 'Təyin edilməyib'}</p>`;
        }
        emailContent += `<p><strong>Sinif:</strong> ${bookingData.class || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Stopla:</strong> ${bookingData.stops || 'Təyin edilməyib'}</p>`;
      } else if (bookingData.type === 'hotel') {
        emailSubject = `Yeni Otel Rezervasiya Sorğusu - ${bookingData.destination || ''}`;
        emailContent += `<p><strong>Məkan:</strong> ${bookingData.destination || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Giriş:</strong> ${bookingData.checkIn || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Çıxış:</strong> ${bookingData.checkOut || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Otaq sayı:</strong> ${bookingData.rooms || 'Təyin edilməyib'}</p>`;
        // Guest info
        if (bookingData.guestInfo) {
          const gi = bookingData.guestInfo;
          emailContent += `<p><strong>Qonaq detalları:</strong></p>`;
          emailContent += `<ul>`;
          emailContent += `<li>Böyüklər (18+): ${gi.adults || 0}</li>`;
          emailContent += `<li>Uşaqlar (2-17): ${gi.children || 0}${gi.childAges && gi.childAges.length > 0 ? ` (Yaşlar: ${gi.childAges.join(', ')})` : ''}</li>`;
          emailContent += `<li>Körpələr (0-23 ay): ${gi.infants || 0}${gi.infantAges && gi.infantAges.length > 0 ? ` (Aylar: ${gi.infantAges.join(', ')})` : ''}</li>`;
          if (gi.seniors) emailContent += `<li>Yaşlılar (65+): ${gi.seniors}</li>`;
          emailContent += `<li>Ümumi: ${(gi.adults || 0) + (gi.children || 0) + (gi.infants || 0) + (gi.seniors || 0)}</li>`;
          emailContent += `</ul>`;
        } else {
          emailContent += `<p><strong>Nəfər sayı:</strong> ${bookingData.guests || 'Təyin edilməyib'}</p>`;
        }
        emailContent += `<p><strong>Otel növü:</strong> ${bookingData.hotelType || 'Təyin edilməyib'}</p>`;
      } else if (bookingData.type === 'transfer') {
        emailSubject = `Yeni Transfer Sorğusu`;
        emailContent += `<p><strong>Transfer növü:</strong> ${bookingData.transferType || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Haradan:</strong> ${bookingData.from || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Hara:</strong> ${bookingData.to || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Tarix:</strong> ${bookingData.date || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Vaxt:</strong> ${bookingData.time || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Nəqliyyat növü:</strong> ${bookingData.vehicleType || 'Təyin edilməyib'}</p>`;
        // Transfer passenger info
        if (bookingData.transferPassengerInfo) {
          const tpi = bookingData.transferPassengerInfo;
          emailContent += `<p><strong>Sərnişin detalları:</strong></p>`;
          emailContent += `<ul>`;
          emailContent += `<li>Böyüklər (18+): ${tpi.adults || 0}</li>`;
          emailContent += `<li>Uşaqlar (2-17): ${tpi.children || 0}${tpi.childAges && tpi.childAges.length > 0 ? ` (Yaşlar: ${tpi.childAges.join(', ')})` : ''}</li>`;
          emailContent += `<li>Körpələr (0-23 ay): ${tpi.infants || 0}${tpi.infantAges && tpi.infantAges.length > 0 ? ` (Aylar: ${tpi.infantAges.join(', ')})` : ''}</li>`;
          if (tpi.seniors) emailContent += `<li>Yaşlılar (65+): ${tpi.seniors}</li>`;
          emailContent += `<li>Ümumi: ${(tpi.adults || 0) + (tpi.children || 0) + (tpi.infants || 0) + (tpi.seniors || 0)}</li>`;
          emailContent += `</ul>`;
        }
        emailContent += `<p><strong>Nəfər sayı:</strong> ${bookingData.passengers || 'Təyin edilməyib'}</p>`;
      } else if (bookingData.type === 'insurance') {
        emailSubject = `Yeni Sığorta Sorğusu - ${bookingData.insuranceType || ''}`;
        emailContent += `<p><strong>Sığorta növü:</strong> ${bookingData.insuranceType || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Paket:</strong> ${bookingData.package || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Başlama tarixi:</strong> ${bookingData.startDate || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Bitmə tarixi:</strong> ${bookingData.endDate || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Əhatə dairəsi:</strong> ${bookingData.coverage || 'Təyin edilməyib'}</p>`;
      } else if (bookingData.type === 'embassy') {
        emailSubject = `Yeni Səfirlik Sorğusu - ${bookingData.embassyCountry || ''}`;
        emailContent += `<p><strong>Ölkə:</strong> ${bookingData.embassyCountry || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Viza növü:</strong> ${bookingData.visaType || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Təcili:</strong> ${bookingData.urgent ? 'Bəli' : 'Xeyr'}</p>`;
        // Embassy traveler info
        if (bookingData.embassyTravelerInfo) {
          const eti = bookingData.embassyTravelerInfo;
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
      
        emailContent += `<p><strong>Əlavə məlumat:</strong> ${escapeHtml(bookingData.notes || 'Yoxdur')}</p>`;
      
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
