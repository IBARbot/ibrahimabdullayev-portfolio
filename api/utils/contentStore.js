// Shared in-memory content store for public site + admin panel
// Note: This is in-memory per serverless instance. For long‑term persistence,
// content should eventually be stored in a database or Google Sheets.

export let contentData = {
  hero: {
    title: 'Salam, mən İbrahim Abdullayev',
    subtitle: 'Aviabilet və Rezervasiya Sistemləri üzrə Mütəxəssis',
    description:
      'Aviabilet rezervasiyası, otel booking, transfer xidmətləri, sığorta və səfirlik işləri üzrə peşəkar məsləhətçi. GDS, NDC və Direct Sell UI üzrə mentor kimi illər boyu təcrübəmlə səyahətçilərə ən uyğun və təhlükəsiz həlləri təqdim edirəm.',
    image: 'https://i.imgur.com/64oQNiZ.jpeg',
  },
  about: {
    title: 'Haqqımda',
    content:
      'Turizm və aviasiya sahəsində çoxillik təcrübəyə malik mütəxəssis kimi əsas fokusum aviabilet satışları, tariflərin düzgün hesablanması və müştərilərə ən optimal marşrutların təklif edilməsidir.\n\nGDS sistemləri (Amadeus, Galileo və s.), NDC interfeysləri və aviaşirkətlərin birbaşa satış platformaları ilə intensiv işləyərək həm sərnişin, həm də yük daşımalarında (Air Cargo) effektiv və sürətli həllər təqdim edirəm.\n\nMəqsədim – hər bir müştərinin büdcə, rahatlıq və təhlükəsizlik meyarlarına uyğun olaraq, şəffaf və peşəkar xidmət göstərməkdir.',
  },
  contact: {
    email: 'ibrahim.abdullayev1@gmail.com',
    phone: '+994 55 597 39 23',
    address: 'Baku, Rashid Behbudov str, Azerbaijan',
    linkedin: 'https://linkedin.com/in/ibrahim-abdullayev-7bb887152',
    instagram: 'https://instagram.com/ibrahim_abdullar',
    whatsapp: 'https://wa.me/994555973923',
  },
  // Personal portfolio items (can be edited from admin panel)
  portfolio: [
    {
      id: 'portfolio-1',
      title: 'Aviabilet və Tarif Hesablanması üzrə Ekspert',
      description:
        'Kompleks marşrutlar, multi-city və xüsusi tarif qaydalarına uyğun aviabilet satışları. Məlumatların dəqiq daxil edilməsi və beynəlxalq qaydalara uyğun tarif hesablanması vasitəsilə müştərilər üçün əlavə xərclərin qarşısının alınması.',
      technologies: ['IATA Fare Rules', 'Tarif Hesablanması', 'Complex Itineraries'],
      image:
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
      link: '#booking',
      github: '',
    },
    {
      id: 'portfolio-2',
      title: 'GDS / NDC / Direct Sell UI üzrə Mentor',
      description:
        'GDS (Global Distribution Systems), NDC API-lər və aviaşirkətlərin birbaşa satış interfeysləri ilə işləmək üzrə təlim və mentorluq. Komandaların daha sürətli və az xətalı işləməsi üçün praktiki təlim proqramları.',
      technologies: ['GDS', 'NDC', 'Direct Sell UI'],
      image:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      link: '#about',
      github: '',
    },
    {
      id: 'portfolio-3',
      title: 'Aviation & Air Cargo Consulting',
      description:
        'Yük daşımaları üzrə marşrut planlaması, rate check, space confirmation və cargo booking proseslərinin optimallaşdırılması. Müxtəlif aviaşirkətlərlə əməkdaşlıq edərək şirkətlər üçün daha əlverişli şərtlərin əldə olunması.',
      technologies: ['Air Cargo', 'Rate Check', 'Space Confirmation'],
      image:
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
      link: '#contact',
      github: '',
    },
  ],
  // Certificates with images – paths point to /public, can be changed from admin panel
  certificates: [
    {
      id: 'cert-dgr-7-3',
      title: 'IATA Dangerous Goods Training Guidance 7.3',
      subtitle: 'Transport of Dangerous Goods by Air - Initial',
      provider: 'IATA Training & Assessment Center',
      date: '2025-10-24',
      image: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=1200&h=800&fit=cover',
    },
    {
      id: 'cert-fares-ticketing',
      title: 'Global Distribution Systems Fares and Ticketing - GALILEO',
      subtitle: 'IATA Course – Fares and Ticketing',
      provider: 'International Air Transport Association (IATA)',
      date: '2022-03-01',
      image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?w=1200&h=800&fit=cover',
    },
  ],
  // Video / media links – can be embedded on the site
  videos: [],
  // Dynamic social links (footer/icons). Icons will be mapped on frontend.
  socialLinks: [
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/ibrahim-abdullayev-7bb887152',
      icon: 'linkedin',
    },
    {
      id: 'instagram',
      platform: 'Instagram',
      label: 'Instagram',
      url: 'https://instagram.com/ibrahim_abdullar',
      icon: 'instagram',
    },
    {
      id: 'whatsapp',
      platform: 'WhatsApp',
      label: 'WhatsApp',
      url: 'https://wa.me/994555973923',
      icon: 'whatsapp',
    },
    {
      id: 'email',
      platform: 'Email',
      label: 'Email',
      url: 'mailto:ibrahim.abdullayev1@gmail.com',
      icon: 'mail',
    },
  ],
}

export function getContent() {
  return contentData
}

export function updateContent(partial) {
  contentData = {
    ...contentData,
    ...partial,
  }
  return contentData
}



