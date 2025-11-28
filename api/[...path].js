// Vercel Serverless Functions - Dynamic API Routes
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

// In-memory storage (Vercel-də file write işləmir)
let contentData = {
  hero: {
    title: 'Salam, mən İbrahim Abdullayev',
    subtitle: 'Turizm Sahəsində Aparıcı Mütəxəssis',
    description: 'Aviabilet rezervasiyası, otel booking, transfer xidmətləri, sığorta və səfirlik işləri üzrə peşəkar məsləhətçi. İllər boyu təcrübəmlə səyahətçilərə ən yaxşı həlləri təqdim edirəm.',
    image: 'https://i.imgur.com/64oQNiZ.jpeg'
  },
  about: {
    title: 'Haqqımda',
    content: 'Mən turizm sahəsində aparıcı mütəxəssisəm və səyahətçilərə ən yaxşı xidməti təqdim etmək üçün çalışıram.\n\nİllər boyu hava yolu sistemləri, otel rezervasiyaları, transfer xidmətləri, sığorta və səfirlik işləri üzrə təcrübə toplamışam. Hər müştəriyə fərdi yanaşaraq onun ehtiyaclarına ən uyğun həlli təqdim edirəm.\n\nMəqsədim səyahəti daha əlçatan etmək və hər müştəriyə keyfiyyətli xidmət göstərməkdir. Ağıllı səyahət ağıllı planlaşdırma ilə başlayır.'
  },
  contact: {
    email: 'ibrahim.abdullayev1@gmail.com',
    phone: '+994 55 597 39 23',
    address: 'Baku, Rashid Behbudov str, Azerbaijan',
    linkedin: 'https://linkedin.com/in/ibrahim-abdullayev-7bb887152',
    instagram: 'https://instagram.com/ibrahim_abdullar',
    whatsapp: 'https://wa.me/994555973923'
  }
};

let bookingsData = [];

// Auth middleware
const authenticateToken = (headers) => {
  const authHeader = headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return { error: { status: 401, message: 'Token tələb olunur' } };
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    return { user };
  } catch (err) {
    return { error: { status: 403, message: 'Token etibarsızdır' } };
  }
};

// Email transporter
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
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, query, body, headers } = req;
  
  // Vercel-də [...path] formatında query.path array olur
  // Məsələn: /api/contact → query.path = ['contact']
  // Məsələn: /api/admin/bookings → query.path = ['admin', 'bookings']
  const pathArray = query.path || [];
  const path = Array.isArray(pathArray) ? pathArray.join('/') : pathArray;

  // Routes
  if (path === 'health' && method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'Server is running' });
  }

  if (path === 'content' && method === 'GET') {
    return res.status(200).json(contentData);
  }

  if (path === 'projects' && method === 'GET') {
    return res.status(200).json([
      { id: 1, title: 'Aviabilet Rezervasiya Platforması', description: 'Müştərilərə ən yaxşı qiymətlərlə aviabilet rezervasiyası xidməti.', technologies: ['Flight Booking', 'Multi-City', 'Price Optimization'], image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop', link: '#', github: '' },
      { id: 2, title: 'Otel Rezervasiya Xidməti', description: 'Dünyanın hər yerində otel rezervasiyası.', technologies: ['Hotel Booking', 'Best Rates', 'Room Selection'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', link: '#', github: '' },
      { id: 3, title: 'Transfer Xidmətləri', description: 'Hava limanı, otel və şəhər daxilində komfortlu transfer.', technologies: ['Airport Transfer', 'City Tours', 'Comfortable Vehicles'], image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop', link: '#', github: '' },
      { id: 4, title: 'Sığorta Paketləri', description: 'Səyahət, sağlamlıq və həyat sığortası üzrə paketlər.', technologies: ['Travel Insurance', 'Health Insurance', 'Life Insurance'], image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop', link: '#', github: '' },
      { id: 5, title: 'Səfirlik İşləri', description: 'Viza müraciətləri və səfirlik işləri üzrə məsləhət.', technologies: ['Visa Applications', 'Document Preparation', 'Embassy Services'], image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop', link: '#', github: '' },
      { id: 6, title: 'Səyahət Planlaşdırması', description: 'Kompleks səyahət planları və marşrut optimallaşdırması.', technologies: ['Route Planning', 'Multi-Destination', 'Budget Optimization'], image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop', link: '#', github: '' },
    ]);
  }

  if (path === 'skills' && method === 'GET') {
    return res.status(200).json([
      { name: 'Aviabilet Rezervasiyası', level: 95, category: 'Xidmətlər' },
      { name: 'Otel Booking', level: 90, category: 'Xidmətlər' },
      { name: 'Transfer Xidmətləri', level: 88, category: 'Xidmətlər' },
      { name: 'Sığorta Məsləhəti', level: 85, category: 'Xidmətlər' },
      { name: 'Səfirlik İşləri', level: 90, category: 'Xidmətlər' },
      { name: 'Səyahət Planlaşdırması', level: 92, category: 'Xidmətlər' },
      { name: 'Hava Yolu Sistemləri', level: 95, category: 'Bilik Sahələri' },
      { name: 'Tarif Optimallaşdırması', level: 93, category: 'Bilik Sahələri' },
      { name: 'Multi-City Rezervasiya', level: 90, category: 'Bilik Sahələri' },
      { name: 'Viza Prosedurları', level: 88, category: 'Bilik Sahələri' },
      { name: 'Səyahət Sənədləri', level: 90, category: 'Bilik Sahələri' },
      { name: 'Müştəri Xidməti', level: 95, category: 'Bacarıqlar' },
      { name: 'Fərdi Yanaşma', level: 93, category: 'Bacarıqlar' },
      { name: 'Problem Həll Etmə', level: 90, category: 'Bacarıqlar' },
      { name: 'Kommunikasiya', level: 95, category: 'Bacarıqlar' },
      { name: 'Vaxt İdarəetməsi', level: 88, category: 'Bacarıqlar' },
    ]);
  }

  if (path === 'contact' && method === 'POST') {
    try {
      const { name, email, message, subject } = body;
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

  if (path === 'booking' && method === 'POST') {
    try {
      const bookingData = body;
      if (!bookingData.type || !bookingData.name || !bookingData.email || !bookingData.phone) {
        return res.status(400).json({ success: false, message: 'Lütfən bütün tələb olunan sahələri doldurun' });
      }
      const newBooking = { id: Date.now().toString(), ...bookingData, status: 'new', createdAt: new Date().toISOString() };
      bookingsData.push(newBooking);
      
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
          await transporter.sendMail({ from: process.env.EMAIL_USER, to: adminEmail, subject: emailSubject, html: emailContent, replyTo: bookingData.email });
        } catch (emailError) {
          console.error('Email xətası:', emailError);
        }
      }
      return res.status(200).json({ success: true, message: 'Sorğunuz uğurla göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.', bookingId: newBooking.id });
    } catch (error) {
      console.error('Booking xətası:', error);
      return res.status(500).json({ success: false, message: 'Sorğu göndərilərkən xəta baş verdi' });
    }
  }

  if (path === 'admin/login' && method === 'POST') {
    try {
      const { username, password } = body;
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      if (username === adminUsername && password === adminPassword) {
        const token = jwt.sign({ username: adminUsername }, process.env.JWT_SECRET || 'your-secret-key-change-in-production', { expiresIn: '24h' });
        return res.status(200).json({ success: true, token });
      } else {
        return res.status(401).json({ success: false, message: 'İstifadəçi adı və ya şifrə yanlışdır' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Xəta baş verdi' });
    }
  }

  if (path === 'admin/content' && method === 'PUT') {
    const auth = authenticateToken(headers);
    if (auth.error) {
      return res.status(auth.error.status).json({ success: false, message: auth.error.message });
    }
    try {
      contentData = { ...contentData, ...body };
      return res.status(200).json({ success: true, message: 'Məzmun yeniləndi', content: contentData });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Xəta baş verdi' });
    }
  }

  if (path === 'admin/bookings' && method === 'GET') {
    const auth = authenticateToken(headers);
    if (auth.error) {
      return res.status(auth.error.status).json({ success: false, message: auth.error.message });
    }
    try {
      return res.status(200).json({ success: true, bookings: bookingsData });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Xəta baş verdi' });
    }
  }

  if (path.startsWith('admin/bookings/') && method === 'PUT') {
    const auth = authenticateToken(headers);
    if (auth.error) {
      return res.status(auth.error.status).json({ success: false, message: auth.error.message });
    }
    try {
      const id = path.split('/')[2];
      const { status } = body;
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

  // Əgər endpoint tapılmadısa
  return res.status(404).json({ success: false, message: 'Endpoint tapılmadı', path: path, method: method });
}
