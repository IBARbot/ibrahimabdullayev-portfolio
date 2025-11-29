// Vercel Serverless Function - Forgot Password API
// Sends password reset email to admin

import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

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
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';

    // Check if email matches admin email
    if (!email || email.toLowerCase() !== adminEmail?.toLowerCase()) {
      // Don't reveal if email exists or not (security best practice)
      return res.status(200).json({ 
        success: true, 
        message: 'Əgər bu email ünvanı qeydiyyatdan keçibsə, şifrə sıfırlama linki göndəriləcək.' 
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { 
        email: adminEmail,
        type: 'password-reset',
        timestamp: Date.now()
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '1h' }
    );

    // Create reset link
    const resetLink = `${req.headers.origin || 'https://ibrahimabdullayev.com'}/admin/reset-password?token=${resetToken}`;

    // Send email
    const transporter = createTransporter();
    if (transporter) {
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
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Əgər bu email ünvanı qeydiyyatdan keçibsə, şifrə sıfırlama linki göndəriləcək.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.' 
    });
  }
}

