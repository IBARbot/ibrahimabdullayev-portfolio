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
    if (!bookingData.type || !bookingData.name || !bookingData.email || !bookingData.phone) {
      return res.status(400).json({ success: false, message: 'Lütfən bütün tələb olunan sahələri doldurun' });
    }
    
    const newBooking = { 
      id: Date.now().toString(), 
      ...bookingData, 
      status: 'new', 
      createdAt: new Date().toISOString() 
    };
    
    const transporter = createTransporter();
    if (transporter) {
      const adminEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
      let emailSubject = `Yeni Rezervasiya Sorğusu - ${bookingData.type}`;
      let emailContent = `<h2>Yeni Rezervasiya Sorğusu</h2><p><strong>Ad:</strong> ${bookingData.name}</p><p><strong>Email:</strong> ${bookingData.email}</p><p><strong>Telefon:</strong> ${bookingData.phone}</p><p><strong>Növ:</strong> ${bookingData.type}</p>`;
      
      if (bookingData.type === 'flight') {
        emailSubject = `Yeni Aviabilet Sorğusu - ${bookingData.from || ''} → ${bookingData.to || ''}`;
        emailContent += `<p><strong>Haradan:</strong> ${bookingData.from || 'Təyin edilməyib'}</p><p><strong>Hara:</strong> ${bookingData.to || 'Təyin edilməyib'}</p><p><strong>Tarix:</strong> ${bookingData.date || 'Təyin edilməyib'}</p><p><strong>Nəfər sayı:</strong> ${bookingData.passengers || 'Təyin edilməyib'}</p>`;
      } else if (bookingData.type === 'hotel') {
        emailSubject = `Yeni Otel Rezervasiya Sorğusu - ${bookingData.destination || ''}`;
        emailContent += `<p><strong>Məkan:</strong> ${bookingData.destination || 'Təyin edilməyib'}</p><p><strong>Giriş:</strong> ${bookingData.checkIn || 'Təyin edilməyib'}</p><p><strong>Çıxış:</strong> ${bookingData.checkOut || 'Təyin edilməyib'}</p>`;
      }
      
      emailContent += `<p><strong>Əlavə məlumat:</strong> ${bookingData.notes || 'Yoxdur'}</p>`;
      
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
    return res.status(500).json({ success: false, message: 'Sorğu göndərilərkən xəta baş verdi' });
  }
}

