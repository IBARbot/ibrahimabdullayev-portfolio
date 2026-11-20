// Analytics hadisəsini Google Sheets-in "Analytics" vərəqinə yazır.
// Yalnız server daxilindən çağırılır (açıq HTTP endpoint deyil).
import jwt from 'jsonwebtoken';

const cell = (v, max) => String(v ?? '').slice(0, max);

async function getAccessToken(serviceAccountKey) {
  const serviceAccount = JSON.parse(Buffer.from(serviceAccountKey, 'base64').toString('utf-8'));
  const now = Math.floor(Date.now() / 1000);
  const assertion = jwt.sign(
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
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  const tokenData = await tokenResponse.json();
  return tokenData.access_token || null;
}

export async function appendAnalyticsRow(data) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!sheetId || (!serviceAccountKey && !apiKey)) return false;

  // Tarix | Növ | Path | Element | Dəyər | Referrer | User Agent | Screen Size | IP
  const rowData = [
    cell(data.timestamp || new Date().toISOString(), 40),
    cell(data.type, 30),
    cell(data.path, 300),
    cell(data.element || data.depth, 200),
    cell(data.value, 200),
    cell(data.referrer, 300),
    cell(data.userAgent, 100),
    data.screenWidth && data.screenHeight ? cell(`${data.screenWidth}x${data.screenHeight}`, 20) : '',
    cell(data.ip, 60),
  ];

  const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Analytics!A:I:append?valueInputOption=RAW`;
  const body = JSON.stringify({ values: [rowData] });

  let response = null;
  if (serviceAccountKey) {
    try {
      const token = await getAccessToken(serviceAccountKey);
      if (token) {
        response = await fetch(base, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body,
        });
      }
    } catch (error) {
      console.error('Analytics service account error:', error.message);
    }
  }
  if (!response && apiKey) {
    response = await fetch(`${base}&key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  }
  if (!response || !response.ok) {
    console.error('Analytics Sheets write failed:', response ? await response.text() : 'no response');
    return false;
  }
  return true;
}
