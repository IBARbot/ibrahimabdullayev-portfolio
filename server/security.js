// Ortaq təhlükəsizlik köməkçiləri: JWT, CORS, rate limit, təhlükəsiz müqayisə
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getPasswordChangedAt } from './adminAuth.js';

const SITE_ORIGINS = [
  'https://www.ibrahimabdullayev.com',
  'https://ibrahimabdullayev.com',
  'https://www.ibrahimabdullayev.az',
  'https://ibrahimabdullayev.az',
];
const DEFAULT_ORIGIN = SITE_ORIGINS[0];

export function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (SITE_ORIGINS.includes(origin)) return true;
  // Yerli inkişaf
  return /^http:\/\/localhost:\d+$/.test(origin);
}

// Yalnız öz saytımızın ünvanlarına icazə verir; digər saytlar brauzerdən API-yə qoşula bilmir
export function applyCors(req, res, methods) {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// E-poçtdakı linklər üçün etibarlı sayt ünvanı (istifadəçi başlığına inanılmır)
export function trustedSiteOrigin(req) {
  const origin = req.headers.origin;
  return isAllowedOrigin(origin) ? origin : DEFAULT_ORIGIN;
}

// JWT açarı olmadan işləmir (ehtiyat dəyər yoxdur)
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('JWT_SECRET is not configured or too short');
  }
  return secret;
}

export function signAdminToken(username) {
  return jwt.sign({ username, role: 'admin' }, getJwtSecret(), {
    algorithm: 'HS256',
    expiresIn: '8h',
  });
}

export function signResetToken(email) {
  return jwt.sign({ email, type: 'password-reset' }, getJwtSecret(), {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
}

export function verifyResetToken(token) {
  const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
  if (decoded.type !== 'password-reset') throw new Error('wrong token type');
  return decoded;
}

// Admin tokenini yoxlayır. Şifrə sıfırlama tokeni admin giriş tokeni kimi qəbul edilmir.
// Etibarlıdırsa decoded qaytarır, əks halda null.
export function verifyAdminToken(token) {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
    if (decoded.role !== 'admin' || decoded.type) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function getBearerToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

// Req-dən admini yoxlayır; uğursuzdursa 401 göndərir və null qaytarır.
// Şifrə dəyişdirildikdən əvvəl verilmiş tokenlər qəbul olunmur.
export async function requireAdmin(req, res) {
  let decoded = null;
  try {
    const token = getBearerToken(req);
    decoded = token ? verifyAdminToken(token) : null;
    if (decoded) {
      const changedAt = await getPasswordChangedAt();
      if (changedAt && (decoded.iat || 0) * 1000 < Math.floor(changedAt / 1000) * 1000) {
        decoded = null;
      }
    }
  } catch (e) {
    res.status(503).json({ success: false, message: 'Server konfiqurasiyası tamamlanmayıb' });
    return null;
  }
  if (!decoded) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return null;
  }
  return decoded;
}

// Vaxt hücumlarından qorunan müqayisə
export function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a ?? '')).digest();
  const hb = crypto.createHash('sha256').update(String(b ?? '')).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

// Sadə yaddaş-əsaslı limit (hər serverless nüsxəsi üçün; kobud hücumları yavaşladır)
const buckets = new Map();
export function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { limited: false };
  }
  entry.count += 1;
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
  }
  return { limited: entry.count > max, retryAfter: Math.ceil((entry.reset - now) / 1000) };
}

export function clearRateLimit(key) {
  buckets.delete(key);
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
