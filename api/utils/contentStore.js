// Shared content store with Google Sheets persistence
// Content is stored in Google Sheets "Content" page, cell A1 as JSON string
import jwt from 'jsonwebtoken';

// Default content (fallback if Google Sheets is not available)
const defaultContent = {
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
  videos: [],
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
};

// In-memory cache (fallback)
let contentData = { ...defaultContent };

// Get access token for Google Sheets API
async function getAccessToken() {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) return null;

  try {
    const serviceAccountJson = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        iss: serviceAccount.client_email,
        sub: serviceAccount.client_email,
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
      },
      serviceAccount.private_key,
      { algorithm: 'RS256' }
    );

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token,
      }),
    });

    const tokenData = await tokenResponse.json();
    return tokenData.access_token || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

// Load content from Google Sheets
async function loadContentFromSheets() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    console.log('Google Sheets ID not configured, using default content');
    return null;
  }

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.log('Could not get access token, using default content');
      return null;
    }

    // Try to find the correct sheet name (Content or content)
    let sheetName = 'Content';
    const sheetNames = ['Content', 'content'];
    
    // Check which sheet exists
    for (const name of sheetNames) {
      const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${name}!A1`;
      const checkResponse = await fetch(checkUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (checkResponse.ok || checkResponse.status === 200) {
        sheetName = name;
        break;
      }
    }

    // Read from Content sheet, cell A1
    const range = `${sheetName}!A1`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Could not read from Google Sheets:', response.status, errorText);
      // If sheet doesn't exist, that's OK - we'll use default content
      if (response.status === 400) {
        console.log('Sheet might not exist yet, will use default content');
      }
      return null;
    }

    const data = await response.json();
    if (data.values && data.values[0] && data.values[0][0]) {
      const contentJson = data.values[0][0];
      try {
        const parsedContent = JSON.parse(contentJson);
        // Validate structure
        if (parsedContent && typeof parsedContent === 'object' && parsedContent.hero && parsedContent.about) {
          console.log('Content loaded from Google Sheets successfully');
          return parsedContent;
        } else {
          console.warn('Content from Google Sheets has invalid structure');
          return null;
        }
      } catch (parseError) {
        console.error('Error parsing content JSON from Google Sheets:', parseError);
        return null;
      }
    }

    // Empty cell - that's OK, use default
    console.log('Content sheet is empty, using default content');
    return null;
  } catch (error) {
    console.error('Error loading content from Google Sheets:', error);
    return null;
  }
}

// Save content to Google Sheets
async function saveContentToSheets(content) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    console.log('Google Sheets ID not configured, content not saved');
    return false;
  }

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.log('Could not get access token, content not saved');
      return false;
    }

    // Try to find the correct sheet name (Content or content)
    let sheetName = 'Content';
    const sheetNames = ['Content', 'content'];
    
    // Check which sheet exists
    for (const name of sheetNames) {
      const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${name}!A1`;
      const checkResponse = await fetch(checkUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (checkResponse.ok || checkResponse.status === 200) {
        sheetName = name;
        break;
      }
    }

    // Write to Content sheet, cell A1
    const range = `${sheetName}!A1`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=RAW`;

    const contentJson = JSON.stringify(content);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        values: [[contentJson]],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error saving to Google Sheets:', errorText);
      return false;
    }

    console.log('Content saved to Google Sheets successfully');
    return true;
  } catch (error) {
    console.error('Error saving content to Google Sheets:', error);
    return false;
  }
}

// Get content (loads from Google Sheets if available, otherwise uses cache/default)
export async function getContent() {
  // Try to load from Google Sheets
  const sheetsContent = await loadContentFromSheets();
  if (sheetsContent) {
    contentData = sheetsContent;
    return contentData;
  }

  // Fallback to in-memory cache or default
  return contentData;
}

// Update content (saves to Google Sheets and updates cache)
export async function updateContent(partial) {
  // Merge with existing content
  contentData = {
    ...contentData,
    ...partial,
  };

  // Save to Google Sheets
  await saveContentToSheets(contentData);

  return contentData;
}

// Initialize: Try to load from Google Sheets on module load
// Note: This runs once per serverless instance, so we still need to load on each request
// But it helps with caching
(async () => {
  try {
    const sheetsContent = await loadContentFromSheets();
    if (sheetsContent) {
      contentData = sheetsContent;
    }
  } catch (error) {
    // Ignore initialization errors
  }
})();
