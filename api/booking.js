// Vercel Serverless Function - Booking API
import nodemailer from 'nodemailer';

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

// Google Sheets API function
async function addToGoogleSheets(bookingData) {
  try {
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (!GOOGLE_SCRIPT_URL) {
      console.log('Google Script URL not configured');
      return null;
    }

    // Prepare data for Google Sheets
    const rowData = {
      timestamp: new Date().toISOString(),
      type: bookingData.type || '',
      name: bookingData.name || '',
      email: bookingData.email || '',
      phone: bookingData.phone || '',
      // Flight data
      tripType: bookingData.tripType || '',
      from: bookingData.from || '',
      to: bookingData.to || '',
      departureDate: bookingData.departureDate || '',
      returnDate: bookingData.returnDate || '',
      passengers: bookingData.passengers || '',
      class: bookingData.class || '',
      stops: bookingData.stops || '',
      // Hotel data
      destination: bookingData.destination || '',
      checkIn: bookingData.checkIn || '',
      checkOut: bookingData.checkOut || '',
      rooms: bookingData.rooms || '',
      guests: bookingData.guests || '',
      hotelType: bookingData.hotelType || '',
      // Transfer data
      transferType: bookingData.transferType || '',
      date: bookingData.date || '',
      time: bookingData.time || '',
      vehicleType: bookingData.vehicleType || '',
      // Insurance data
      insuranceType: bookingData.insuranceType || '',
      package: bookingData.package || '',
      startDate: bookingData.startDate || '',
      endDate: bookingData.endDate || '',
      coverage: bookingData.coverage || '',
      // Embassy data
      embassyCountry: bookingData.embassyCountry || '',
      visaType: bookingData.visaType || '',
      urgent: bookingData.urgent || false,
      // Common
      notes: bookingData.notes || '',
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rowData),
    });

    if (!response.ok) {
      console.error('Google Sheets API error:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Google Sheets error:', error);
    return null;
  }
}

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
    const bookingData = req.body;
    
    // Validation: Type və email/phone-dan ən azı biri mütləq olmalıdır
    if (!bookingData.type) {
      return res.status(400).json({ success: false, message: 'Xidmət növü seçilməlidir' });
    }
    
    if (!bookingData.email && !bookingData.phone) {
      return res.status(400).json({ success: false, message: 'Zəhmət olmasa email və ya telefon nömrəsindən ən azı birini daxil edin' });
    }
    
    const newBooking = { 
      id: Date.now().toString(), 
      ...bookingData, 
      status: 'new', 
      createdAt: new Date().toISOString() 
    };
    
    // Add to Google Sheets (async, don't wait)
    addToGoogleSheets(bookingData).catch(err => {
      console.error('Google Sheets error (non-blocking):', err);
    });
    
    const transporter = createTransporter();
    if (transporter) {
      const adminEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
      let emailSubject = `Yeni Rezervasiya Sorğusu - ${bookingData.type}`;
      let emailContent = `<h2>Yeni Rezervasiya Sorğusu</h2><p><strong>Ad:</strong> ${bookingData.name || 'Təyin edilməyib'}</p><p><strong>Email:</strong> ${bookingData.email || 'Təyin edilməyib'}</p><p><strong>Telefon:</strong> ${bookingData.phone || 'Təyin edilməyib'}</p><p><strong>Növ:</strong> ${bookingData.type}</p>`;
      
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
        
        emailContent += `<p><strong>Nəfər sayı:</strong> ${bookingData.passengers || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Sinif:</strong> ${bookingData.class || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Stopla:</strong> ${bookingData.stops || 'Təyin edilməyib'}</p>`;
      } else if (bookingData.type === 'hotel') {
        emailSubject = `Yeni Otel Rezervasiya Sorğusu - ${bookingData.destination || ''}`;
        emailContent += `<p><strong>Məkan:</strong> ${bookingData.destination || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Giriş:</strong> ${bookingData.checkIn || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Çıxış:</strong> ${bookingData.checkOut || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Otaq sayı:</strong> ${bookingData.rooms || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Nəfər sayı:</strong> ${bookingData.guests || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Otel növü:</strong> ${bookingData.hotelType || 'Təyin edilməyib'}</p>`;
      } else if (bookingData.type === 'transfer') {
        emailSubject = `Yeni Transfer Sorğusu`;
        emailContent += `<p><strong>Transfer növü:</strong> ${bookingData.transferType || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Haradan:</strong> ${bookingData.from || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Hara:</strong> ${bookingData.to || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Tarix:</strong> ${bookingData.date || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Vaxt:</strong> ${bookingData.time || 'Təyin edilməyib'}</p>`;
        emailContent += `<p><strong>Nəqliyyat növü:</strong> ${bookingData.vehicleType || 'Təyin edilməyib'}</p>`;
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
      }
      
      emailContent += `<p><strong>Əlavə məlumat:</strong> ${bookingData.notes || 'Yoxdur'}</p>`;
      
      try {
        await transporter.sendMail({ 
          from: process.env.EMAIL_USER, 
          to: adminEmail, 
          subject: emailSubject, 
          html: emailContent, 
          replyTo: bookingData.email || bookingData.phone 
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
    return res.status(500).json({ success: false, message: 'Sorğu göndərilərkən xəta baş verdi' });
  }
}
