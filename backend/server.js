import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory or root
try {
  dotenv.config({ path: join(__dirname, '.env') });
} catch (e) {
  // If .env doesn't exist in backend, try root
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// Data storage directory
const DATA_DIR = join(__dirname, 'data');
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const CONTENT_FILE = join(DATA_DIR, 'content.json');
const BOOKINGS_FILE = join(DATA_DIR, 'bookings.json');

// Initialize data files
const initDataFiles = () => {
  if (!existsSync(CONTENT_FILE)) {
    const defaultContent = {
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
    writeFileSync(CONTENT_FILE, JSON.stringify(defaultContent, null, 2));
  }
  
  if (!existsSync(BOOKINGS_FILE)) {
    writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2));
  }
};

initDataFiles();

// Helper functions
const readContent = () => {
  try {
    const data = readFileSync(CONTENT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
};

const writeContent = (content) => {
  writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
};

const readBookings = () => {
  try {
    const data = readFileSync(BOOKINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const writeBookings = (bookings) => {
  writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // For image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token tələb olunur' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token etibarsızdır' });
    }
    req.user = user;
    next();
  });
};

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Lütfən bütün sahələri doldurun' 
      });
    }

    // Email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not configured. Saving to console:');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Subject:', subject || 'No subject');
      console.log('Message:', message);
      
      return res.json({ 
        success: true, 
        message: 'Mesajınız qeydə alındı (email konfiqurasiyası yoxdur)' 
      });
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: subject || `Portfolio saytından yeni mesaj: ${name}`,
      html: `
        <h2>Yeni Əlaqə Mesajı</h2>
        <p><strong>Ad:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mövzu:</strong> ${subject || 'Mövzu yoxdur'}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Mesajınız uğurla göndərildi!' 
    });
  } catch (error) {
    console.error('Email göndərmə xətası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Mesaj göndərilərkən xəta baş verdi' 
    });
  }
});

// Projects endpoint (can be extended to use a database)
app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: 'Aviabilet Rezervasiya Platforması',
      description: 'Müştərilərə ən yaxşı qiymətlərlə aviabilet rezervasiyası xidməti. Multi-city, complex itineraries və optimal routing ilə.',
      technologies: ['Flight Booking', 'Multi-City', 'Price Optimization', '24/7 Support'],
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
      link: '#',
      github: '',
    },
    {
      id: 2,
      title: 'Otel Rezervasiya Xidməti',
      description: 'Dünyanın hər yerində otel rezervasiyası. Ən yaxşı otellər, rəqabətli qiymətlər və fərdi xidmət.',
      technologies: ['Hotel Booking', 'Best Rates', 'Room Selection', 'Flexible Dates'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      link: '#',
      github: '',
    },
    {
      id: 3,
      title: 'Transfer Xidmətləri',
      description: 'Hava limanı, otel və şəhər daxilində komfortlu və təhlükəsiz transfer xidmətləri.',
      technologies: ['Airport Transfer', 'City Tours', 'Comfortable Vehicles', 'Professional Drivers'],
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
      link: '#',
      github: '',
    },
    {
      id: 4,
      title: 'Sığorta Paketləri',
      description: 'Səyahət, sağlamlıq və həyat sığortası üzrə fərdi paketlər və məsləhət xidməti.',
      technologies: ['Travel Insurance', 'Health Insurance', 'Life Insurance', 'Custom Packages'],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      link: '#',
      github: '',
    },
    {
      id: 5,
      title: 'Səfirlik İşləri',
      description: 'Viza müraciətləri, sənəd hazırlığı və səfirlik işləri üzrə peşəkar məsləhət və xidmət.',
      technologies: ['Visa Applications', 'Document Preparation', 'Embassy Services', 'Urgent Processing'],
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
      link: '#',
      github: '',
    },
    {
      id: 6,
      title: 'Səyahət Planlaşdırması',
      description: 'Kompleks səyahət planları, multi-destination marşrutlar və büdcə optimallaşdırması.',
      technologies: ['Route Planning', 'Multi-Destination', 'Budget Optimization', 'Custom Itineraries'],
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
      link: '#',
      github: '',
    },
  ];

  res.json(projects);
});

// Skills endpoint
app.get('/api/skills', (req, res) => {
  const skills = [
    // Tourism Services
    { name: 'Aviabilet Rezervasiyası', level: 95, category: 'Xidmətlər' },
    { name: 'Otel Booking', level: 90, category: 'Xidmətlər' },
    { name: 'Transfer Xidmətləri', level: 88, category: 'Xidmətlər' },
    { name: 'Sığorta Məsləhəti', level: 85, category: 'Xidmətlər' },
    { name: 'Səfirlik İşləri', level: 90, category: 'Xidmətlər' },
    { name: 'Səyahət Planlaşdırması', level: 92, category: 'Xidmətlər' },
    // Expertise Areas
    { name: 'Hava Yolu Sistemləri', level: 95, category: 'Bilik Sahələri' },
    { name: 'Tarif Optimallaşdırması', level: 93, category: 'Bilik Sahələri' },
    { name: 'Multi-City Rezervasiya', level: 90, category: 'Bilik Sahələri' },
    { name: 'Viza Prosedurları', level: 88, category: 'Bilik Sahələri' },
    { name: 'Səyahət Sənədləri', level: 90, category: 'Bilik Sahələri' },
    // Customer Service
    { name: 'Müştəri Xidməti', level: 95, category: 'Bacarıqlar' },
    { name: 'Fərdi Yanaşma', level: 93, category: 'Bacarıqlar' },
    { name: 'Problem Həll Etmə', level: 90, category: 'Bacarıqlar' },
    { name: 'Kommunikasiya', level: 95, category: 'Bacarıqlar' },
    { name: 'Vaxt İdarəetməsi', level: 88, category: 'Bacarıqlar' },
  ];

  res.json(skills);
});

// ========== ADMIN ROUTES ==========

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign(
        { username: adminUsername },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '24h' }
      );
      
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'İstifadəçi adı və ya şifrə yanlışdır' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
});

// Get content (public)
app.get('/api/content', (req, res) => {
  const content = readContent();
  res.json(content);
});

// Update content (admin only)
app.put('/api/admin/content', authenticateToken, (req, res) => {
  try {
    const newContent = req.body;
    const currentContent = readContent();
    const updatedContent = { ...currentContent, ...newContent };
    writeContent(updatedContent);
    res.json({ success: true, message: 'Məzmun yeniləndi', content: updatedContent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
});

// Upload image (admin only) - simple base64 storage
app.post('/api/admin/upload-image', authenticateToken, (req, res) => {
  try {
    const { image, name } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Şəkil tələb olunur' });
    }
    
    // Store as base64 data URL
    const imageUrl = image; // In production, save to file system or cloud storage
    res.json({ success: true, url: imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
});

// ========== BOOKING ROUTES ==========

// Submit booking request
app.post('/api/booking', async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Validation
    if (!bookingData.type || !bookingData.name || !bookingData.email || !bookingData.phone) {
      return res.status(400).json({
        success: false,
        message: 'Lütfən bütün tələb olunan sahələri doldurun'
      });
    }

    const bookings = readBookings();
    const newBooking = {
      id: Date.now().toString(),
      ...bookingData,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    writeBookings(bookings);

    // Send email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter();
        const adminEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
        
        let emailSubject = '';
        let emailContent = '';
        
        switch (bookingData.type) {
          case 'flight':
            emailSubject = `Yeni Aviabilet Sorğusu - ${bookingData.from || ''} → ${bookingData.to || ''}`;
            emailContent = `
              <h2>Yeni Aviabilet Sorğusu</h2>
              <p><strong>Ad:</strong> ${bookingData.name}</p>
              <p><strong>Email:</strong> ${bookingData.email}</p>
              <p><strong>Telefon:</strong> ${bookingData.phone}</p>
              <p><strong>Haradan:</strong> ${bookingData.from || 'Təyin edilməyib'}</p>
              <p><strong>Hara:</strong> ${bookingData.to || 'Təyin edilməyib'}</p>
              <p><strong>Tarix:</strong> ${bookingData.date || 'Təyin edilməyib'}</p>
              <p><strong>Nəfər sayı:</strong> ${bookingData.passengers || 'Təyin edilməyib'}</p>
              <p><strong>Əlavə məlumat:</strong> ${bookingData.notes || 'Yoxdur'}</p>
            `;
            break;
          case 'hotel':
            emailSubject = `Yeni Otel Rezervasiya Sorğusu - ${bookingData.destination || ''}`;
            emailContent = `
              <h2>Yeni Otel Rezervasiya Sorğusu</h2>
              <p><strong>Ad:</strong> ${bookingData.name}</p>
              <p><strong>Email:</strong> ${bookingData.email}</p>
              <p><strong>Telefon:</strong> ${bookingData.phone}</p>
              <p><strong>Məkan:</strong> ${bookingData.destination || 'Təyin edilməyib'}</p>
              <p><strong>Giriş:</strong> ${bookingData.checkIn || 'Təyin edilməyib'}</p>
              <p><strong>Çıxış:</strong> ${bookingData.checkOut || 'Təyin edilməyib'}</p>
              <p><strong>Otaq sayı:</strong> ${bookingData.rooms || 'Təyin edilməyib'}</p>
              <p><strong>Nəfər sayı:</strong> ${bookingData.guests || 'Təyin edilməyib'}</p>
              <p><strong>Əlavə məlumat:</strong> ${bookingData.notes || 'Yoxdur'}</p>
            `;
            break;
          case 'transfer':
            emailSubject = `Yeni Transfer Sorğusu`;
            emailContent = `
              <h2>Yeni Transfer Sorğusu</h2>
              <p><strong>Ad:</strong> ${bookingData.name}</p>
              <p><strong>Email:</strong> ${bookingData.email}</p>
              <p><strong>Telefon:</strong> ${bookingData.phone}</p>
              <p><strong>Haradan:</strong> ${bookingData.from || 'Təyin edilməyib'}</p>
              <p><strong>Hara:</strong> ${bookingData.to || 'Təyin edilməyib'}</p>
              <p><strong>Tarix:</strong> ${bookingData.date || 'Təyin edilməyib'}</p>
              <p><strong>Vaxt:</strong> ${bookingData.time || 'Təyin edilməyib'}</p>
              <p><strong>Nəfər sayı:</strong> ${bookingData.passengers || 'Təyin edilməyib'}</p>
              <p><strong>Əlavə məlumat:</strong> ${bookingData.notes || 'Yoxdur'}</p>
            `;
            break;
          case 'insurance':
            emailSubject = `Yeni Sığorta Sorğusu - ${bookingData.insuranceType || ''}`;
            emailContent = `
              <h2>Yeni Sığorta Sorğusu</h2>
              <p><strong>Ad:</strong> ${bookingData.name}</p>
              <p><strong>Email:</strong> ${bookingData.email}</p>
              <p><strong>Telefon:</strong> ${bookingData.phone}</p>
              <p><strong>Sığorta növü:</strong> ${bookingData.insuranceType || 'Təyin edilməyib'}</p>
              <p><strong>Paket:</strong> ${bookingData.package || 'Təyin edilməyib'}</p>
              <p><strong>Başlama tarixi:</strong> ${bookingData.startDate || 'Təyin edilməyib'}</p>
              <p><strong>Bitmə tarixi:</strong> ${bookingData.endDate || 'Təyin edilməyib'}</p>
              <p><strong>Əlavə məlumat:</strong> ${bookingData.notes || 'Yoxdur'}</p>
            `;
            break;
          case 'embassy':
            emailSubject = `Yeni Səfirlik Sorğusu - ${bookingData.embassyCountry || ''}`;
            emailContent = `
              <h2>Yeni Səfirlik Sorğusu</h2>
              <p><strong>Ad:</strong> ${bookingData.name}</p>
              <p><strong>Email:</strong> ${bookingData.email}</p>
              <p><strong>Telefon:</strong> ${bookingData.phone}</p>
              <p><strong>Ölkə:</strong> ${bookingData.embassyCountry || 'Təyin edilməyib'}</p>
              <p><strong>Viza növü:</strong> ${bookingData.visaType || 'Təyin edilməyib'}</p>
              <p><strong>Təcili:</strong> ${bookingData.urgent ? 'Bəli' : 'Xeyr'}</p>
              <p><strong>Əlavə məlumat:</strong> ${bookingData.notes || 'Yoxdur'}</p>
            `;
            break;
        }

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: adminEmail,
          subject: emailSubject,
          html: emailContent,
          replyTo: bookingData.email
        });
      } catch (emailError) {
        console.error('Email göndərmə xətası:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({
      success: true,
      message: 'Sorğunuz uğurla göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.',
      bookingId: newBooking.id
    });
  } catch (error) {
    console.error('Booking xətası:', error);
    res.status(500).json({
      success: false,
      message: 'Sorğu göndərilərkən xəta baş verdi'
    });
  }
});

// Get bookings (admin only)
app.get('/api/admin/bookings', authenticateToken, (req, res) => {
  try {
    const bookings = readBookings();
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
});

// Update booking status (admin only)
app.put('/api/admin/bookings/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const bookings = readBookings();
    const bookingIndex = bookings.findIndex(b => b.id === id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Sorğu tapılmadı' });
    }
    
    bookings[bookingIndex].status = status;
    bookings[bookingIndex].updatedAt = new Date().toISOString();
    writeBookings(bookings);
    
    res.json({ success: true, booking: bookings[bookingIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xəta baş verdi' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  if (existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // SPA routing - serve index.html for all non-API routes
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(join(distPath, 'index.html'));
      }
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Production mode: Static files served from dist/`);
  }
});

