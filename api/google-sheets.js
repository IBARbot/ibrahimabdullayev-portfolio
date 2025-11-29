// Vercel Serverless Function - Google Sheets Integration
// This function appends booking data to Google Sheets
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const bookingData = req.body;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    console.log('Google Sheets API çağırışı başladı');
    console.log('Sheet ID:', sheetId ? 'Mövcuddur' : 'Yoxdur');
    console.log('Service Account Key:', serviceAccountKey ? 'Mövcuddur' : 'Yoxdur');
    console.log('API Key:', apiKey ? 'Mövcuddur' : 'Yoxdur');

    if (!sheetId) {
      console.log('Google Sheets ID konfiqurasiya edilməyib, skip edilir');
      return res.status(200).json({ success: true, message: 'Google Sheets konfiqurasiya edilməyib' });
    }

    // Prepare row data - All possible fields from booking form
    // Structure: Common fields first, then type-specific fields
    const rowData = [
      // Common fields (1-5)
      new Date().toISOString(),                    // 1. Tarix
      bookingData.type || '',                      // 2. Növ
      bookingData.name || '',                      // 3. Ad
      bookingData.email || '',                     // 4. Email
      bookingData.phone || '',                    // 5. Telefon
      
      // Flight fields (6-14)
      bookingData.tripType || '',                  // 6. Flight - Səyahət növü
      bookingData.from || '',                      // 7. Haradan (Flight/Transfer)
      bookingData.to || '',                        // 8. Hara (Flight/Transfer)
      bookingData.departureDate || '',             // 9. Flight - Gediş tarixi
      bookingData.returnDate || '',                // 10. Flight - Qayıdış tarixi
      bookingData.segments ? JSON.stringify(bookingData.segments) : '', // 11. Flight - Multi-city segments (JSON)
      bookingData.passengers || '',                // 12. Flight - Nəfər sayı
      bookingData.class || '',                     // 13. Flight - Sinif
      bookingData.stops || '',                     // 14. Flight - Stopla
      
      // Hotel fields (15-20)
      bookingData.destination || '',               // 15. Hotel - Məkan
      bookingData.checkIn || '',                   // 16. Hotel - Giriş tarixi
      bookingData.checkOut || '',                  // 17. Hotel - Çıxış tarixi
      bookingData.rooms || '',                     // 18. Hotel - Otaq sayı
      bookingData.guests || '',                    // 19. Hotel - Nəfər sayı
      bookingData.hotelType || '',                 // 20. Hotel - Otel növü
      
      // Transfer fields (21-26)
      bookingData.transferType || '',              // 21. Transfer - Transfer növü
      bookingData.date || '',                      // 22. Transfer - Tarix
      bookingData.time || '',                      // 23. Transfer - Vaxt
      bookingData.vehicleType || '',               // 24. Transfer - Nəqliyyat növü
      // Note: Transfer passengers uses same field as Flight passengers (column 12)
      
      // Insurance fields (27-31)
      bookingData.insuranceType || '',             // 25. Insurance - Sığorta növü
      bookingData.package || '',                   // 26. Insurance - Paket
      bookingData.startDate || '',                 // 27. Insurance - Başlama tarixi
      bookingData.endDate || '',                   // 28. Insurance - Bitmə tarixi
      bookingData.coverage || '',                  // 29. Insurance - Əhatə dairəsi
      
      // Embassy fields (30-32)
      bookingData.embassyCountry || '',            // 30. Embassy - Ölkə
      bookingData.visaType || '',                  // 31. Embassy - Viza növü
      bookingData.urgent ? 'Bəli' : 'Xeyr',       // 32. Embassy - Təcili
      
      // Common notes (33)
      bookingData.notes || '',                     // 33. Əlavə məlumat
    ];

    console.log('Göndəriləcək məlumat:', rowData);

    let response;

    // Method 1: Service Account (Preferred)
    if (serviceAccountKey) {
      try {
        console.log('Service Account metodu istifadə olunur...');
        // Decode base64 service account key
        const serviceAccountJson = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
        const serviceAccount = JSON.parse(serviceAccountJson);

        console.log('Service Account email:', serviceAccount.client_email);

        // Get access token using Service Account
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

        console.log('JWT token yaradıldı, access token alınır...');

        // Exchange JWT for access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: token,
          }),
        });

        const tokenData = await tokenResponse.json();
        console.log('Token response status:', tokenResponse.status);
        
        if (!tokenData.access_token) {
          console.error('Access token alınamadı:', JSON.stringify(tokenData));
          throw new Error('Access token alınamadı: ' + JSON.stringify(tokenData));
        }

        console.log('Access token alındı, Google Sheets-ə yazılır...');
        console.log('Row data length:', rowData.length);
        console.log('Row data:', JSON.stringify(rowData));

        // Append to Google Sheets using access token
        // Range format: Sheet1!A:AG or A:AG (for default sheet)
        // Using A:AG for 33 columns (A to AG)
        const range = 'A:AG'; // 33 columns
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW`;
        
        console.log('Google Sheets API URL:', url);
        
        const requestBody = {
          values: [rowData],
        };
        
        console.log('Request body:', JSON.stringify(requestBody));
        
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenData.access_token}`,
          },
          body: JSON.stringify(requestBody),
        });

        console.log('Google Sheets API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Google Sheets API error response:', errorText);
        } else {
          const successData = await response.json();
          console.log('Google Sheets API success response:', JSON.stringify(successData));
        }
      } catch (serviceAccountError) {
        console.error('Service Account xətası:', serviceAccountError);
        console.error('Error details:', serviceAccountError.message);
        // Fallback to API Key method if Service Account fails
        if (apiKey) {
          console.log('API Key metodu ilə yenidən cəhd edilir...');
          const range = 'A:AG';
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW&key=${apiKey}`;
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              values: [rowData],
            }),
          });
          console.log('API Key metodu response status:', response.status);
          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Key metodu error response:', errorText);
          }
        } else {
          throw serviceAccountError;
        }
      }
    }
    // Method 2: API Key (Fallback)
    else if (apiKey) {
      console.log('API Key metodu istifadə olunur...');
      const range = 'A:AG';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW&key=${apiKey}`;
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData],
        }),
      });
      console.log('API Key metodu response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Key metodu error response:', errorText);
      }
    } else {
      console.log('Google Sheets konfiqurasiyası yoxdur, skip edilir');
      return res.status(200).json({ success: true, message: 'Google Sheets konfiqurasiya edilməyib' });
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Sheets API xətası - Status:', response.status);
      console.error('Google Sheets API xətası - Response:', errorData);
      // Don't fail the booking if Google Sheets fails
      return res.status(200).json({ 
        success: true, 
        message: 'Sorğu qeydə alındı, amma Google Sheets-ə yazılmadı',
        error: errorData 
      });
    }

    const responseData = await response.json();
    console.log('Google Sheets-ə uğurla yazıldı:', responseData);

    return res.status(200).json({ 
      success: true, 
      message: 'Google Sheets-ə uğurla əlavə edildi',
      data: responseData 
    });
  } catch (error) {
    console.error('Google Sheets inteqrasiyası ümumi xətası:', error);
    console.error('Error stack:', error.stack);
    // Don't fail the booking if Google Sheets fails
    return res.status(200).json({ 
      success: true, 
      message: 'Sorğu qeydə alındı, amma Google Sheets-ə yazılmadı',
      error: error.message 
    });
  }
}
