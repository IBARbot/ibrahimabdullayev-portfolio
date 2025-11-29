// Vercel Serverless Function - Content API
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const contentData = {
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

  return res.status(200).json(contentData);
}


