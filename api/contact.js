// Vercel Serverless Function - Contact API
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
    const { name, email, message, subject } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Lütfən bütün sahələri doldurun' });
    }
    
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
        subject: subject || `Portfolio saytından yeni mesaj: ${name}`,
        html: `<h2>Yeni Əlaqə Mesajı</h2><p><strong>Ad:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mövzu:</strong> ${subject || 'Mövzu yoxdur'}</p><p><strong>Mesaj:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
      });
    }
    return res.status(200).json({ success: true, message: 'Mesajınız uğurla göndərildi!' });
  } catch (error) {
    console.error('Email xətası:', error);
    return res.status(500).json({ success: false, message: 'Mesaj göndərilərkən xəta baş verdi' });
  }
}


