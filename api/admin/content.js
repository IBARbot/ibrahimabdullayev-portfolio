// Vercel Serverless Function - Admin Content API
import jwt from 'jsonwebtoken';

// In-memory storage
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

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(contentData);
  }

  if (req.method === 'PUT') {
    const auth = authenticateToken(req.headers);
    if (auth.error) {
      return res.status(auth.error.status).json({ success: false, message: auth.error.message });
    }
    try {
      contentData = { ...contentData, ...req.body };
      return res.status(200).json({ success: true, message: 'Məzmun yeniləndi', content: contentData });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Xəta baş verdi' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}


