# Google Sheets İnteqrasiyası - Təlimat

## Google Sheets-də Sorğuların Toplanması

Rezervasiya sorğuları indi Google Sheets-də avtomatik olaraq toplanır.

## Quraşdırma Addımları

### 1. Google Sheets Sənədi Yaradın

1. Google Sheets-də yeni sənəd yaradın
2. Sənədin adını verin (məsələn: "Rezervasiya Sorğuları")
3. İlk sətirdə aşağıdakı başlıqları əlavə edin:

```
Timestamp | Type | Name | Email | Phone | Trip Type | From | To | Departure Date | Return Date | Passengers | Class | Stops | Destination | Check In | Check Out | Rooms | Guests | Hotel Type | Transfer Type | Date | Time | Vehicle Type | Insurance Type | Package | Start Date | End Date | Coverage | Embassy Country | Visa Type | Urgent | Notes
```

### 2. Google Apps Script Yaradın

1. Google Sheets sənədində: **Extensions** → **Apps Script**
2. Aşağıdakı kodu yapışdırın:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add row to sheet
    const row = [
      data.timestamp || new Date().toISOString(),
      data.type || '',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.tripType || '',
      data.from || '',
      data.to || '',
      data.departureDate || '',
      data.returnDate || '',
      data.passengers || '',
      data.class || '',
      data.stops || '',
      data.destination || '',
      data.checkIn || '',
      data.checkOut || '',
      data.rooms || '',
      data.guests || '',
      data.hotelType || '',
      data.transferType || '',
      data.date || '',
      data.time || '',
      data.vehicleType || '',
      data.insuranceType || '',
      data.package || '',
      data.startDate || '',
      data.endDate || '',
      data.coverage || '',
      data.embassyCountry || '',
      data.visaType || '',
      data.urgent || false,
      data.notes || ''
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **File** → **Save** (Ctrl+S)
4. Proyektə ad verin (məsələn: "Booking Form Handler")

### 3. Web App Kimi Deploy Edin

1. **Deploy** → **New deployment**
2. **Select type**: "Web app" seçin
3. **Description**: "Booking Form Handler v1"
4. **Execute as**: "Me" seçin
5. **Who has access**: "Anyone" seçin
6. **Deploy** düyməsinə basın
7. **Authorize access** düyməsinə basın və Google hesabınızı seçin
8. **Advanced** → **Go to [Project Name] (unsafe)**
9. **Allow** düyməsinə basın
10. **Copy** Web App URL-ni (məsələn: `https://script.google.com/macros/s/...`)

### 4. Vercel Environment Variable Əlavə Edin

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Yeni variable əlavə edin:
   - **Name**: `GOOGLE_SCRIPT_URL`
   - **Value**: Google Apps Script Web App URL-ni yapışdırın
   - **Environment**: Production, Preview, Development (hamısını seçin)
3. **Save** düyməsinə basın

### 5. Redeploy Edin

1. Vercel Dashboard → Deployments
2. Son deployment üçün **Redeploy** düyməsinə basın
3. Və ya GitHub-da yeni commit push edin

## Test

1. Saytda rezervasiya formunu doldurun
2. Submit edin
3. Google Sheets-də yeni sətirin əlavə olunduğunu yoxlayın

## Qeydlər

- Google Apps Script URL-i həssas məlumatdır, onu public yerlərdə paylaşmayın
- Sheets sənədinə yalnız siz və ya icazə verilən istifadəçilər baxa bilər
- Hər sorğu yeni sətir kimi əlavə olunur
- Timestamp avtomatik olaraq əlavə olunur

## Problem Həlləri

### Sorğular Sheets-də görünmür
1. Google Apps Script URL-ini yoxlayın
2. Vercel Environment Variable-ı yoxlayın
3. Google Apps Script-də "View" → "Execution log" yoxlayın
4. Browser console-da xətaları yoxlayın

### Authorization xətası
1. Google Apps Script-də "Deploy" → "Manage deployments"
2. "Edit" → "Who has access" → "Anyone" seçin
3. Yenidən deploy edin

