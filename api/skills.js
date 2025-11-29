// Vercel Serverless Function - Skills API
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

  const skills = [
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
  ];

  return res.status(200).json(skills);
}


