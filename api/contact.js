// Vercel Serverless Function - Contact API
import nodemailer from 'nodemailer';
import { applyCors, escapeHtml, rateLimit, clientIp } from '../server/security.js';

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

  try {
    const limit = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000);
    if (limit.limited) {
      res.setHeader('Retry-After', String(limit.retryAfter));
      return res.status(429).json({ success: false, message: 'Çox sayda sorğu. Bir az sonra yenidən cəhd edin.' });
    }

    const { name, email, message, subject } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Lütfən bütün sahələri doldurun' });
    }
    if (
      [name, email, message, subject ?? ''].some((v) => typeof v !== 'string') ||
      name.length > 120 ||
      email.length > 200 ||
      message.length > 5000 ||
      String(subject ?? '').length > 200 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({ success: false, message: 'Daxil edilən məlumatlar düzgün deyil' });
    }
    
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
        subject: String(subject || `Portfolio saytından yeni mesaj: ${name}`).replace(/[\r\n]+/g, ' '),
        replyTo: email,
        html: `<h2>Yeni Əlaqə Mesajı</h2><p><strong>Ad:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Mövzu:</strong> ${escapeHtml(subject || 'Mövzu yoxdur')}</p><p><strong>Mesaj:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      });
    }
    return res.status(200).json({ success: true, message: 'Mesajınız uğurla göndərildi!' });
  } catch (error) {
    console.error('Email xətası:', error);
    return res.status(500).json({ success: false, message: 'Mesaj göndərilərkən xəta baş verdi' });
  }
}


