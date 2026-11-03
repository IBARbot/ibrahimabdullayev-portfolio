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
    image: '/profile.jpg',
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
export async function getAccessToken() {
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
    
    if (!tokenData.access_token) {
      console.error('❌ No access token in response:', tokenData);
      if (tokenData.error) {
        console.error('Token error:', tokenData.error, tokenData.error_description);
      }
      return null;
    }
    
    return tokenData.access_token;
  } catch (error) {
    console.error('❌ Error getting access token:', error.message);
    console.error('Error details:', error);
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
    console.error('❌ Google Sheets ID not configured');
    throw new Error('GOOGLE_SHEET_ID environment variable tapılmadı');
  }

  try {
    console.log('🔑 Getting access token...');
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error('❌ Could not get access token');
      throw new Error('Google Sheets API üçün access token alına bilmədi. GOOGLE_SERVICE_ACCOUNT_KEY yoxlanılmalıdır.');
    }
    console.log('✅ Access token received');

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
    const jsonSize = contentJson.length;
    console.log(`📊 Content JSON size: ${jsonSize} characters (${Math.round(jsonSize / 1000)}KB)`);
    
    // Check for base64 images in content (they make content too large)
    const base64ImagePattern = /data:image\/[^;]+;base64,[A-Za-z0-9+/=]{100,}/g;
    const base64Matches = contentJson.match(base64ImagePattern);
    if (base64Matches && base64Matches.length > 0) {
      console.warn(`⚠️ Found ${base64Matches.length} base64 image(s) in content. Total size: ${jsonSize} characters`);
      const base64TotalSize = base64Matches.reduce((sum, match) => sum + match.length, 0);
      console.warn(`⚠️ Base64 images total size: ${Math.round(base64TotalSize / 1000)}KB`);
      
      if (jsonSize > 50000) {
        throw new Error(`Content çox böyükdür (${Math.round(jsonSize / 1000)}KB). Şəkilləri Cloudinary-ə yükləyin və URL formatında saxlayın. Base64 şəkillər Google Sheets-də saxlanıla bilməz.`);
      }
    }
    
    // Google Sheets cell limit is 50,000 characters
    if (jsonSize > 50000) {
      console.error(`❌ Content too large: ${jsonSize} characters (limit: 50,000)`);
      throw new Error(`Content çox böyükdür (${Math.round(jsonSize / 1000)}KB). Şəkilləri URL formatında saxladığınızdan əmin olun.`);
    }

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
      console.error('❌ Error saving to Google Sheets:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        sheetId: sheetId,
        sheetName: sheetName,
      });
      
      // Try to parse error for better message
      let errorMessage = `Google Sheets-ə yazıla bilmədi (HTTP ${response.status})`;
      let errorDetails = '';
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) {
          if (errorData.error.message) {
            errorMessage = `Google Sheets xətası: ${errorData.error.message}`;
            errorDetails = errorData.error.message;
          }
          if (errorData.error.status === 'PERMISSION_DENIED') {
            errorMessage = 'Google Sheets-ə icazə verilmədi. Service Account-un "Editor" icazəsi olduğunu yoxlayın.';
            errorDetails = 'PERMISSION_DENIED - Service Account icazələri yoxlanılmalıdır';
          } else if (errorData.error.status === 'NOT_FOUND') {
            errorMessage = `Google Sheets səhifəsi tapılmadı. "${sheetName}" səhifəsinin mövcud olduğunu yoxlayın.`;
            errorDetails = `NOT_FOUND - "${sheetName}" səhifəsi tapılmadı`;
          } else if (errorData.error.status === 'INVALID_ARGUMENT') {
            errorMessage = 'Google Sheets-də xəta: Yalnış arqument. Content strukturunu yoxlayın.';
            errorDetails = 'INVALID_ARGUMENT - Content struktur problemi';
          } else if (errorData.error.status === 'RESOURCE_EXHAUSTED') {
            errorMessage = 'Google Sheets API limiti aşıldı. Bir az gözləyin və yenidən cəhd edin.';
            errorDetails = 'RESOURCE_EXHAUSTED - API limiti';
          }
        }
      } catch {
        // If parsing fails, use raw error text
        if (errorText) {
          errorMessage = `Google Sheets xətası: ${errorText.substring(0, 200)}`;
          errorDetails = errorText.substring(0, 500);
        }
      }
      
      // Log detailed error for debugging
      console.error('❌ Detailed error:', {
        message: errorMessage,
        details: errorDetails,
        status: response.status,
        jsonSize: jsonSize,
      });
      
      throw new Error(errorMessage);
    }

    const responseData = await response.json().catch(() => ({}));
    console.log('Content saved to Google Sheets successfully', {
      updatedCells: responseData.updatedCells || 'unknown',
      jsonSize: jsonSize,
    });
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

// Deep merge helper function
function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      // Special handling for critical arrays: certificates, portfolio, videos
      // If source has empty array and target has non-empty array, preserve target
      const criticalArrays = ['certificates', 'portfolio', 'videos', 'socialLinks'];
      
      if (criticalArrays.includes(key)) {
        // For critical arrays: only replace if source array has items
        // If source is empty array and target has items, preserve target
        if (Array.isArray(source[key]) && Array.isArray(target[key])) {
          if (source[key].length > 0) {
            // Source has items, use source
            output[key] = source[key];
          } else if (target[key].length > 0) {
            // Source is empty but target has items, preserve target
            output[key] = target[key];
          } else {
            // Both empty, use source
            output[key] = source[key];
          }
        } else if (Array.isArray(source[key])) {
          // Source is array but target is not, use source only if it has items
          if (source[key].length > 0) {
            output[key] = source[key];
          }
          // Otherwise, keep target (don't replace with empty array)
        } else {
          // Source is not array, use source
          output[key] = source[key];
        }
      }
      // If both are arrays (non-critical), replace only if source has items
      else if (Array.isArray(source[key])) {
        // Only replace if source array has items, otherwise preserve target
        if (source[key].length > 0) {
          output[key] = source[key];
        }
        // If source is empty array, keep target (don't replace)
      }
      // If both are objects (but not arrays), deep merge
      else if (isObject(source[key]) && isObject(target[key]) && !Array.isArray(target[key])) {
        output[key] = deepMerge(target[key], source[key]);
      }
      // Otherwise, replace (but skip undefined values)
      else if (source[key] !== undefined) {
        output[key] = source[key];
      }
    });
  }
  
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Clean content for Google Sheets - remove base64 images to reduce size
// IMPORTANT: Only remove base64, keep URLs (Cloudinary, Imgur, etc.)
function cleanContentForSheets(content) {
  const cleaned = JSON.parse(JSON.stringify(content)); // Deep clone
  
  // Remove base64 images from hero (keep URLs)
  if (cleaned.hero && cleaned.hero.image) {
    if (cleaned.hero.image.startsWith('data:image')) {
      // Base64 detected - remove it (URL should be uploaded to Cloudinary first)
      console.warn('⚠️ Hero image is base64, removing for Google Sheets');
      cleaned.hero.image = '';
    } else {
      // URL detected - keep it
      console.log('✅ Hero image is URL, keeping:', cleaned.hero.image.substring(0, 50));
    }
  }
  
  // Remove base64 images from certificates (keep URLs)
  if (cleaned.certificates && Array.isArray(cleaned.certificates)) {
    cleaned.certificates = cleaned.certificates.map((cert, idx) => {
      if (cert.image) {
        if (cert.image.startsWith('data:image')) {
          // Base64 detected - remove it
          console.warn(`⚠️ Certificate ${idx} image is base64, removing for Google Sheets`);
          return { ...cert, image: '' };
        } else {
          // URL detected - keep it
          console.log(`✅ Certificate ${idx} image is URL, keeping:`, cert.image.substring(0, 50));
          return cert;
        }
      }
      return cert;
    });
  }
  
  // Remove base64 images from portfolio (keep URLs)
  if (cleaned.portfolio && Array.isArray(cleaned.portfolio)) {
    cleaned.portfolio = cleaned.portfolio.map((item, idx) => {
      if (item.image) {
        if (item.image.startsWith('data:image')) {
          // Base64 detected - remove it
          console.warn(`⚠️ Portfolio ${idx} image is base64, removing for Google Sheets`);
          return { ...item, image: '' };
        } else {
          // URL detected - keep it
          console.log(`✅ Portfolio ${idx} image is URL, keeping:`, item.image.substring(0, 50));
          return item;
        }
      }
      return item;
    });
  }
  
  return cleaned;
}

// Smart merge for certificates - preserves images by ID and keeps all certificates
function mergeCertificates(latestCerts, partialCerts) {
  // If partial has no certificates, return latest (preserve all existing)
  if (!partialCerts || !Array.isArray(partialCerts) || partialCerts.length === 0) {
    return latestCerts || [];
  }
  
  // If latest has no certificates, return partial
  if (!latestCerts || !Array.isArray(latestCerts) || latestCerts.length === 0) {
    return partialCerts;
  }
  
  // Create a map of latest certificates by ID for quick lookup
  const latestMap = new Map();
  latestCerts.forEach(cert => {
    if (cert.id) {
      latestMap.set(cert.id, cert);
    }
  });
  
  // Create a map of partial certificates by ID
  const partialMap = new Map();
  partialCerts.forEach(cert => {
    if (cert.id) {
      partialMap.set(cert.id, cert);
    }
  });
  
  // Start with latest certificates (preserve all existing)
  const mergedMap = new Map();
  latestCerts.forEach(cert => {
    if (cert.id) {
      mergedMap.set(cert.id, { ...cert }); // Copy latest cert
    }
  });
  
  // Update with partial certificates (merge images intelligently)
  partialCerts.forEach(partialCert => {
    if (partialCert.id) {
      const existingCert = mergedMap.get(partialCert.id);
      if (existingCert) {
        // Certificate exists in latest, merge it
        const mergedCert = {
          ...partialCert, // Use partial data (title, subtitle, etc.)
          // Preserve image from latest if partial doesn't have one
          image: (partialCert.image && partialCert.image.trim() !== '') 
            ? partialCert.image 
            : (existingCert.image && existingCert.image.trim() !== '') 
              ? existingCert.image 
              : partialCert.image || existingCert.image || '',
        };
        mergedMap.set(partialCert.id, mergedCert);
      } else {
        // New certificate, add it
        mergedMap.set(partialCert.id, { ...partialCert });
      }
    } else {
      // Certificate without ID, add it (might be a new one)
      mergedMap.set(`temp-${Date.now()}-${Math.random()}`, { ...partialCert });
    }
  });
  
  // Convert map back to array
  const merged = Array.from(mergedMap.values());
  
  // Preserve order: partial certificates first (in their order), then latest certificates not in partial
  const partialIds = new Set(partialCerts.map(c => c.id).filter(Boolean));
  const orderedMerged = [];
  
  // Add partial certificates first (in their order)
  partialCerts.forEach(partialCert => {
    if (partialCert.id) {
      const mergedCert = mergedMap.get(partialCert.id);
      if (mergedCert) {
        orderedMerged.push(mergedCert);
      }
    }
  });
  
  // Add latest certificates that are not in partial (preserve existing ones)
  latestCerts.forEach(latestCert => {
    if (latestCert.id && !partialIds.has(latestCert.id)) {
      orderedMerged.push(latestCert);
    }
  });
  
  return orderedMerged.length > 0 ? orderedMerged : merged;
}

// Smart merge for portfolio - preserves images by ID and keeps all items
function mergePortfolio(latestPortfolio, partialPortfolio) {
  // If partial has no portfolio items, return latest (preserve all existing)
  if (!partialPortfolio || !Array.isArray(partialPortfolio) || partialPortfolio.length === 0) {
    return latestPortfolio || [];
  }
  
  // If latest has no portfolio items, return partial
  if (!latestPortfolio || !Array.isArray(latestPortfolio) || latestPortfolio.length === 0) {
    return partialPortfolio;
  }
  
  // Create a map of latest portfolio items by ID
  const latestMap = new Map();
  latestPortfolio.forEach(item => {
    if (item.id) {
      latestMap.set(item.id, item);
    }
  });
  
  // Create a map of partial portfolio items by ID
  const partialMap = new Map();
  partialPortfolio.forEach(item => {
    if (item.id) {
      partialMap.set(item.id, item);
    }
  });
  
  // Start with latest portfolio items (preserve all existing)
  const mergedMap = new Map();
  latestPortfolio.forEach(item => {
    if (item.id) {
      mergedMap.set(item.id, { ...item }); // Copy latest item
    }
  });
  
  // Update with partial portfolio items (merge images intelligently)
  partialPortfolio.forEach(partialItem => {
    if (partialItem.id) {
      const existingItem = mergedMap.get(partialItem.id);
      if (existingItem) {
        // Item exists in latest, merge it
        const mergedItem = {
          ...partialItem, // Use partial data (title, description, etc.)
          // Preserve image from latest if partial doesn't have one
          image: (partialItem.image && partialItem.image.trim() !== '') 
            ? partialItem.image 
            : (existingItem.image && existingItem.image.trim() !== '') 
              ? existingItem.image 
              : partialItem.image || existingItem.image || '',
        };
        mergedMap.set(partialItem.id, mergedItem);
      } else {
        // New item, add it
        mergedMap.set(partialItem.id, { ...partialItem });
      }
    } else {
      // Item without ID, add it (might be a new one)
      mergedMap.set(`temp-${Date.now()}-${Math.random()}`, { ...partialItem });
    }
  });
  
  // Convert map back to array
  const merged = Array.from(mergedMap.values());
  
  // Preserve order: partial items first (in their order), then latest items not in partial
  const partialIds = new Set(partialPortfolio.map(i => i.id).filter(Boolean));
  const orderedMerged = [];
  
  // Add partial items first (in their order)
  partialPortfolio.forEach(partialItem => {
    if (partialItem.id) {
      const mergedItem = mergedMap.get(partialItem.id);
      if (mergedItem) {
        orderedMerged.push(mergedItem);
      }
    }
  });
  
  // Add latest items that are not in partial (preserve existing ones)
  latestPortfolio.forEach(latestItem => {
    if (latestItem.id && !partialIds.has(latestItem.id)) {
      orderedMerged.push(latestItem);
    }
  });
  
  return orderedMerged.length > 0 ? orderedMerged : merged;
}

// Update content (saves to Google Sheets and updates cache)
export async function updateContent(partial) {
  // First, ensure we have the latest content from Google Sheets
  const latestContent = await getContent();
  
  console.log('=== UPDATE CONTENT DEBUG ===');
  console.log('Partial certificates length:', partial.certificates?.length || 0);
  console.log('LatestContent certificates length:', latestContent.certificates?.length || 0);
  
  // Start with latest content as base
  contentData = { ...latestContent };
  
  // Merge non-critical fields first (using deep merge)
  // Special handling for hero image - preserve if partial doesn't have one
  const nonCriticalFields = Object.keys(partial).filter(
    key => !['certificates', 'portfolio', 'videos', 'socialLinks'].includes(key)
  );
  
  nonCriticalFields.forEach(key => {
    if (typeof partial[key] === 'object' && !Array.isArray(partial[key]) && partial[key] !== null) {
      // Special handling for hero - preserve image if partial doesn't have one
      if (key === 'hero' && latestContent.hero) {
        const mergedHero = deepMerge(latestContent.hero || {}, partial.hero);
        // Preserve image from latest if partial doesn't have one
        if (!partial.hero.image || partial.hero.image.trim() === '') {
          if (latestContent.hero.image && latestContent.hero.image.trim() !== '') {
            mergedHero.image = latestContent.hero.image;
          }
        }
        contentData[key] = mergedHero;
      } else {
        contentData[key] = deepMerge(latestContent[key] || {}, partial[key]);
      }
    } else {
      contentData[key] = partial[key];
    }
  });
  
  // Smart merge for critical arrays
  // Certificates: merge by ID, preserve images
  if (partial.certificates !== undefined) {
    contentData.certificates = mergeCertificates(latestContent.certificates, partial.certificates);
    console.log(`Merged certificates: ${contentData.certificates.length} items`);
    // Log image status
    contentData.certificates.forEach((cert, idx) => {
      const hasImage = cert.image && cert.image.trim() !== '';
      console.log(`  Certificate ${idx} (${cert.id || 'no-id'}): ${hasImage ? 'HAS IMAGE' : 'NO IMAGE'}`);
    });
  } else {
    // Not in partial, preserve latest
    contentData.certificates = latestContent.certificates || [];
  }
  
  // Portfolio: merge by ID, preserve images
  if (partial.portfolio !== undefined) {
    contentData.portfolio = mergePortfolio(latestContent.portfolio, partial.portfolio);
    console.log(`Merged portfolio: ${contentData.portfolio.length} items`);
  } else {
    contentData.portfolio = latestContent.portfolio || [];
  }
  
  // Videos: simple array merge (replace if provided)
  if (partial.videos !== undefined) {
    if (Array.isArray(partial.videos) && partial.videos.length > 0) {
      contentData.videos = partial.videos;
    } else if (latestContent.videos && latestContent.videos.length > 0) {
      contentData.videos = latestContent.videos;
    } else {
      contentData.videos = partial.videos || [];
    }
  } else {
    contentData.videos = latestContent.videos || [];
  }
  
  // Social Links: simple array merge
  if (partial.socialLinks !== undefined) {
    if (Array.isArray(partial.socialLinks) && partial.socialLinks.length > 0) {
      contentData.socialLinks = partial.socialLinks;
    } else if (latestContent.socialLinks && latestContent.socialLinks.length > 0) {
      contentData.socialLinks = latestContent.socialLinks;
    } else {
      contentData.socialLinks = partial.socialLinks || [];
    }
  } else {
    contentData.socialLinks = latestContent.socialLinks || [];
  }

  console.log('Final contentData certificates length:', contentData.certificates?.length || 0);
  console.log('=== END UPDATE CONTENT DEBUG ===');

  // Clean content before saving - remove base64 images to reduce size
  const cleanedContent = cleanContentForSheets(contentData);
  const originalSize = JSON.stringify(contentData).length;
  const cleanedSize = JSON.stringify(cleanedContent).length;
  console.log(`🧹 Cleaned content: ${originalSize} → ${cleanedSize} characters (saved ${originalSize - cleanedSize} chars)`);

  // Save to Google Sheets
  try {
    console.log('💾 Attempting to save content to Google Sheets...');
    console.log('📊 Content summary:', {
      certificates: contentData.certificates?.length || 0,
      portfolio: contentData.portfolio?.length || 0,
      hasHeroImage: !!contentData.hero?.image,
      heroImageType: contentData.hero?.image?.substring(0, 50) || 'none',
      originalSize: originalSize,
      cleanedSize: cleanedSize,
    });
    
    const saved = await saveContentToSheets(cleanedContent);
    if (!saved) {
      console.error('❌ Failed to save content to Google Sheets (returned false)');
      throw new Error('Google Sheets-ə yazıla bilmədi: Xəta baş verdi');
    } else {
      console.log('✅ Content successfully saved to Google Sheets');
    }
  } catch (saveError) {
    console.error('❌ Error saving content to Google Sheets:', saveError);
    console.error('Error message:', saveError.message);
    console.error('Error stack:', saveError.stack);
    
    // Re-throw with more context, but preserve original message if it's already detailed
    if (saveError.message && saveError.message.includes('Google Sheets')) {
      throw saveError; // Already has detailed message
    } else {
      throw new Error(`Google Sheets-ə yazıla bilmədi: ${saveError.message || 'Naməlum xəta'}`);
    }
  }

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
