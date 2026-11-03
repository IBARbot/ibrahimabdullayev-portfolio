// Admin şifrəsinin saxlanması və yoxlanması.
// Şifrə yalnız scrypt hash şəklində, Google Sheets-in "Content" səhifəsinin B1 xanasında saxlanır
// (A1 xanası saytın ictimai məzmunudur, B1 heç yerdə ictimai oxunmur).
// İlk quraşdırmada (B1 boşdur) ADMIN_PASSWORD environment dəyişəni qəbul olunur;
// şifrə ilk dəfə sıfırlandıqdan sonra yalnız saxlanmış hash keçərlidir.
import crypto from 'crypto';
import { getAccessToken } from './contentStore.js';

const CELL = 'B1';
const CACHE_MS = 30 * 1000;
let cache = null; // { value, at }

function timingSafeStringEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a ?? '')).digest();
  const hb = crypto.createHash('sha256').update(String(b ?? '')).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function scrypt(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
}

async function sheetUrl(sheetId, accessToken) {
  for (const name of ['Content', 'content']) {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${name}!A1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (res.ok) return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${name}!${CELL}`;
  }
  throw new Error('Content sheet not found');
}

// Saxlanmış hesab məlumatı: { salt, hash, changedAt } və ya null (hələ təyin olunmayıb)
async function readCredential() {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) return null;

  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error('Could not get Google access token');
  const url = await sheetUrl(sheetId, accessToken);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Credential read failed: ${res.status}`);
  const data = await res.json();
  const raw = data.values?.[0]?.[0];
  let value = null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.salt && parsed.hash) value = parsed;
    } catch {
      value = null;
    }
  }
  cache = { value, at: Date.now() };
  return value;
}

export async function verifyAdminLogin(username, password) {
  const adminUsername = process.env.ADMIN_USERNAME;
  if (!adminUsername) throw new Error('ADMIN_USERNAME is not configured');
  const userOk = timingSafeStringEqual(username, adminUsername);

  const stored = await readCredential();
  let passOk;
  if (stored) {
    const key = await scrypt(String(password ?? ''), Buffer.from(stored.salt, 'base64'));
    passOk = crypto.timingSafeEqual(key, Buffer.from(stored.hash, 'base64'));
  } else {
    if (!process.env.ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD is not configured');
    passOk = timingSafeStringEqual(password, process.env.ADMIN_PASSWORD);
  }
  return userOk && passOk;
}

// Şifrə dəyişdirilmə vaxtı (ms). Bundan əvvəl verilmiş tokenlər keçərsizdir.
export async function getPasswordChangedAt() {
  const stored = await readCredential();
  return stored?.changedAt || 0;
}

export async function setAdminPassword(newPassword) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    throw new Error('Google Sheets is not configured');
  }
  const salt = crypto.randomBytes(16);
  const key = await scrypt(newPassword, salt);
  const record = {
    v: 1,
    salt: salt.toString('base64'),
    hash: key.toString('base64'),
    changedAt: Date.now(),
  };

  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error('Could not get Google access token');
  const url = await sheetUrl(sheetId, accessToken);
  const res = await fetch(`${url}?valueInputOption=RAW`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ values: [[JSON.stringify(record)]] }),
  });
  if (!res.ok) throw new Error(`Credential write failed: ${res.status}`);
  cache = { value: record, at: Date.now() };
}
