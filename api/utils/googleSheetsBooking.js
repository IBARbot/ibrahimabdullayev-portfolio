// Utility function to append booking data to Google Sheets
// Can be used both from API endpoint and directly from booking.js
import jwt from 'jsonwebtoken';

// Helper function to get access token for Google Sheets API
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

// Helper function to find the correct sheet name for bookings
async function findBookingSheetName(sheetId, accessToken) {
  // Try common sheet names
  const possibleNames = ['Bookings', 'bookings', 'Booking', 'booking', 'Sheet1', 'Sheet 1'];
  
  for (const name of possibleNames) {
    try {
      const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${name}!A1`;
      const checkResponse = await fetch(checkUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (checkResponse.ok || checkResponse.status === 200) {
        console.log(`Found booking sheet: ${name}`);
        return name;
      }
    } catch (error) {
      // Continue to next name
    }
  }
  
  // If no specific sheet found, try to get the first sheet from spreadsheet metadata
  try {
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
    const metadataResponse = await fetch(metadataUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (metadataResponse.ok) {
      const metadata = await metadataResponse.json();
      if (metadata.sheets && metadata.sheets.length > 0) {
        const firstSheetName = metadata.sheets[0].properties.title;
        console.log(`Using first sheet: ${firstSheetName}`);
        return firstSheetName;
      }
    }
  } catch (error) {
    console.error('Error getting sheet metadata:', error);
  }
  
  // Default to Sheet1
  console.log('Using default sheet: Sheet1');
  return 'Sheet1';
}

export async function appendBookingToSheets(bookingData) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  console.log('Google Sheets API çağırışı başladı');
  console.log('Sheet ID:', sheetId ? 'Mövcuddur' : 'Yoxdur');
  console.log('Service Account Key:', serviceAccountKey ? 'Mövcuddur' : 'Yoxdur');
  console.log('API Key:', apiKey ? 'Mövcuddur' : 'Yoxdur');

  if (!sheetId) {
    console.log('Google Sheets ID konfiqurasiya edilməyib, skip edilir');
    throw new Error('Google Sheets ID not configured');
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
    bookingData.passengers || '',                // 12. Flight - Nəfər sayı (legacy)
    bookingData.passengerInfo ? JSON.stringify(bookingData.passengerInfo) : '', // 13. Flight - Passenger Info (JSON)
    bookingData.class || '',                     // 14. Flight - Sinif
    bookingData.stops || '',                     // 15. Flight - Stopla
    
    // Hotel fields (16-21)
    bookingData.destination || '',               // 16. Hotel - Məkan
    bookingData.checkIn || '',                   // 17. Hotel - Giriş tarixi
    bookingData.checkOut || '',                  // 18. Hotel - Çıxış tarixi
    bookingData.rooms || '',                     // 19. Hotel - Otaq sayı
    bookingData.guests || '',                    // 20. Hotel - Nəfər sayı (legacy)
    bookingData.guestInfo ? JSON.stringify(bookingData.guestInfo) : '', // 21. Hotel - Guest Info (JSON)
    bookingData.hotelType || '',                 // 22. Hotel - Otel növü
    
    // Transfer fields (23-28)
    bookingData.transferType || '',              // 23. Transfer - Transfer növü
    bookingData.date || '',                      // 24. Transfer - Tarix
    bookingData.time || '',                      // 25. Transfer - Vaxt
    bookingData.vehicleType || '',               // 26. Transfer - Nəqliyyat növü
    bookingData.transferPassengerInfo ? JSON.stringify(bookingData.transferPassengerInfo) : '', // 27. Transfer - Passenger Info (JSON)
    
    // Insurance fields (28-33)
    bookingData.insuranceType || '',             // 28. Insurance - Sığorta növü
    bookingData.package || '',                   // 29. Insurance - Paket
    bookingData.startDate || '',                 // 30. Insurance - Başlama tarixi
    bookingData.endDate || '',                 // 31. Insurance - Bitmə tarixi
    bookingData.coverage || '',                  // 32. Insurance - Əhatə dairəsi
    bookingData.insuranceTravelerInfo ? JSON.stringify(bookingData.insuranceTravelerInfo) : '', // 33. Insurance - Traveler Info (JSON)
    
    // Embassy fields (34-37)
    bookingData.embassyCountry || '',            // 34. Embassy - Ölkə
    bookingData.visaType || '',                  // 35. Embassy - Viza növü
    bookingData.urgent ? 'Bəli' : 'Xeyr',       // 36. Embassy - Təcili
    bookingData.embassyTravelerInfo ? JSON.stringify(bookingData.embassyTravelerInfo) : '', // 37. Embassy - Traveler Info (JSON)
    
    // Common notes (38)
    bookingData.notes || '',                     // 38. Əlavə məlumat
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

      // Find the correct sheet name for bookings
      const sheetName = await findBookingSheetName(sheetId, tokenData.access_token);
      
      // Append to Google Sheets using access token
      // Range format: SheetName!A:AL or A:AL (for default sheet)
      // Using A:AL for 38 columns (A to AL)
      const range = `${sheetName}!A:AL`; // 38 columns
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
        throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`);
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
        // For API Key method, try to find sheet name using API Key
        let sheetName = 'Sheet1';
        try {
          const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
          const metadataResponse = await fetch(metadataUrl);
          if (metadataResponse.ok) {
            const metadata = await metadataResponse.json();
            if (metadata.sheets && metadata.sheets.length > 0) {
              // Try to find Bookings sheet first
              const bookingsSheet = metadata.sheets.find(s => 
                ['Bookings', 'bookings', 'Booking', 'booking'].includes(s.properties.title)
              );
              sheetName = bookingsSheet ? bookingsSheet.properties.title : metadata.sheets[0].properties.title;
              console.log(`Using sheet: ${sheetName}`);
            }
          }
        } catch (error) {
          console.log('Could not determine sheet name, using Sheet1');
        }
        const range = `${sheetName}!A:AL`;
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
          throw new Error(`API Key method error: ${response.status} - ${errorText}`);
        }
      } else {
        throw serviceAccountError;
      }
    }
  }
  // Method 2: API Key (Fallback)
  else if (apiKey) {
    console.log('API Key metodu istifadə olunur...');
    // Try to find sheet name using API Key
    let sheetName = 'Sheet1';
    try {
      const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
      const metadataResponse = await fetch(metadataUrl);
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        if (metadata.sheets && metadata.sheets.length > 0) {
          // Try to find Bookings sheet first
          const bookingsSheet = metadata.sheets.find(s => 
            ['Bookings', 'bookings', 'Booking', 'booking'].includes(s.properties.title)
          );
          sheetName = bookingsSheet ? bookingsSheet.properties.title : metadata.sheets[0].properties.title;
          console.log(`Using sheet: ${sheetName}`);
        }
      }
    } catch (error) {
      console.log('Could not determine sheet name, using Sheet1');
    }
    const range = `${sheetName}!A:AL`; // 38 columns
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
      throw new Error(`API Key method error: ${response.status} - ${errorText}`);
    }
  } else {
    console.log('Google Sheets konfiqurasiyası yoxdur, skip edilir');
    throw new Error('Google Sheets configuration not found');
  }

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Google Sheets API xətası - Status:', response.status);
    console.error('Google Sheets API xətası - Response:', errorData);
    throw new Error(`Google Sheets API error: ${response.status} - ${errorData}`);
  }

  const responseData = await response.json();
  console.log('Google Sheets-ə uğurla yazıldı:', responseData);

  return responseData;
}


