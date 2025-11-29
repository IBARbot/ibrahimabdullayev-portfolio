# Google Sheets İnteqrasiyası - Təlimat

## Google Sheets API Konfiqurasiyası

### Addım 1: Google Cloud Console-da API Aktivləşdirin

1. [Google Cloud Console](https://console.cloud.google.com/) daxil olun
2. Yeni layihə yaradın və ya mövcud layihəni seçin
3. "APIs & Services" → "Library" bölməsinə keçin
4. "Google Sheets API" axtarın və aktivləşdirin

### Addım 2: API Key Yaradın

1. "APIs & Services" → "Credentials" bölməsinə keçin
2. "Create Credentials" → "API Key" seçin
3. API Key-i kopyalayın və saxlayın

### Addım 3: Google Sheets Yaradın

1. [Google Sheets](https://sheets.google.com/) daxil olun
2. Yeni spreadsheet yaradın
3. Aşağıdakı başlıqları ilk sətirdə əlavə edin:
   - Tarix
   - Növ
   - Ad
   - Email
   - Telefon
   - Haradan
   - Hara
   - Gediş tarixi
   - Qayıdış tarixi
   - Nəfər sayı
   - Əlavə məlumat

### Addım 4: Spreadsheet ID-ni Tapın

1. Google Sheets-də spreadsheet-i açın
2. URL-dən ID-ni kopyalayın:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
   `SPREADSHEET_ID` hissəsini kopyalayın

### Addım 5: Spreadsheet-i Public Edin (və ya Service Account İstifadə Edin)

**Seçim 1: Public (Sadə, amma məhdud)**
1. Google Sheets-də "Share" düyməsinə basın
2. "Anyone with the link" → "Viewer" seçin
3. API Key ilə istifadə edə bilərsiniz

**Seçim 2: Service Account (Tövsiyə olunur)**
1. Google Cloud Console-da "Service Account" yaradın
2. JSON key faylı yükləyin
3. Service Account email-ini Google Sheets-də "Editor" kimi paylaşın
4. JSON key-i environment variable kimi əlavə edin

### Addım 6: Vercel-də Environment Variables Əlavə Edin

Vercel Dashboard → Settings → Environment Variables:

```
GOOGLE_SHEET_ID=your-spreadsheet-id-here
GOOGLE_SHEETS_API_KEY=your-api-key-here
```

**Qeyd:** Əgər Service Account istifadə edirsinizsə, JSON key-i base64 encode edib environment variable kimi əlavə edin.

## Test

1. Booking formunu doldurun və göndərin
2. Google Sheets-də yeni sətirin əlavə olunduğunu yoxlayın

## Problemlər?

### API Key işləmir?
- Google Sheets API aktivləşdirildiyini yoxlayın
- API Key-in düzgün olduğunu yoxlayın
- Spreadsheet-in public olduğunu yoxlayın (və ya Service Account paylaşıldığını)

### Data yazılmır?
- Vercel Logs-u yoxlayın
- Spreadsheet ID-nin düzgün olduğunu yoxlayın
- API Key-in düzgün olduğunu yoxlayın

