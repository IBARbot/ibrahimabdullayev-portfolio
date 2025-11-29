// Vercel Serverless Function - Projects API
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

  const projects = [
    { id: 1, title: 'Aviabilet Rezervasiya Platforması', description: 'Müştərilərə ən yaxşı qiymətlərlə aviabilet rezervasiyası xidməti.', technologies: ['Flight Booking', 'Multi-City', 'Price Optimization'], image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop', link: '#', github: '' },
    { id: 2, title: 'Otel Rezervasiya Xidməti', description: 'Dünyanın hər yerində otel rezervasiyası.', technologies: ['Hotel Booking', 'Best Rates', 'Room Selection'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', link: '#', github: '' },
    { id: 3, title: 'Transfer Xidmətləri', description: 'Hava limanı, otel və şəhər daxilində komfortlu transfer.', technologies: ['Airport Transfer', 'City Tours', 'Comfortable Vehicles'], image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop', link: '#', github: '' },
    { id: 4, title: 'Sığorta Paketləri', description: 'Səyahət, sağlamlıq və həyat sığortası üzrə paketlər.', technologies: ['Travel Insurance', 'Health Insurance', 'Life Insurance'], image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop', link: '#', github: '' },
    { id: 5, title: 'Səfirlik İşləri', description: 'Viza müraciətləri və səfirlik işləri üzrə məsləhət.', technologies: ['Visa Applications', 'Document Preparation', 'Embassy Services'], image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop', link: '#', github: '' },
    { id: 6, title: 'Səyahət Planlaşdırması', description: 'Kompleks səyahət planları və marşrut optimallaşdırması.', technologies: ['Route Planning', 'Multi-Destination', 'Budget Optimization'], image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop', link: '#', github: '' },
  ];

  return res.status(200).json(projects);
}


