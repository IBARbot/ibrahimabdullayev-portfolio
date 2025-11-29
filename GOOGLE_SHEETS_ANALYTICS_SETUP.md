# Google Sheets Analytics Quraşdırması - Təlimat

## Analytics Məlumatlarının Google Sheets-də Toplanması

Saytın analitikası (traffic, bölmələrin görüntülənməsi, istifadəçi davranışı və s.) avtomatik olaraq Google Sheets-də toplanır.

## Toplanan Məlumatlar

### 1. Page Views (Səhifə Baxışları)
- Timestamp
- Page path
- Referrer (haradan gəldi)
- User Agent
- Screen resolution

### 2. Section Views (Bölmə Baxışları)
- Hər bölmənin neçə dəfə görüntüləndiyi
- Bölmə adı (home, about, skills, services, projects, contact)

### 3. Button Clicks (Düymə Klikləri)
- Hansı düyməyə klik edildi
- Düymənin yeri

### 4. Form Submissions (Form Göndərmələri)
- Form növü (booking, contact)
- Uğurlu/uyğunsuz
- Scroll depth
- Time spent

### 5. Scroll Depth (Scroll Dərinliyi)
- İstifadəçinin səhifəni nə qədər scroll etdiyi (%)

### 6. Time Spent (Vaxt Sərf Edildi)
- İstifadəçinin səhifədə nə qədər vaxt keçirdiyi (saniyə)

### 7. Exit Intent (Çıxış Niyyəti)
- İstifadəçi səhifəni tərk etmək istəyəndə

## Quraşdırma Addımları

### 1. Google Sheets Sənədi Yaradın

1. Google Sheets-də yeni sənəd yaradın
2. Sənədin adını verin (məsələn: "Website Analytics")
3. İlk sətirdə aşağıdakı başlıqları əlavə edin:

```
Timestamp | Type | Page | Section | Action | Session ID | Scroll Depth | Time Spent | Success | Location | Referrer | User Agent | Screen Width | Screen Height | Additional Data
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
      data.page || '',
      data.section || '',
      data.action || '',
      data.sessionId || '',
      data.scrollDepth || 0,
      data.timeSpent || 0,
      data.success || false,
      data.location || '',
      data.referrer || '',
      data.userAgent || '',
      data.screenWidth || 0,
      data.screenHeight || 0,
      data.additionalData || ''
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
4. Proyektə ad verin (məsələn: "Analytics Handler")

### 3. Web App Kimi Deploy Edin

1. **Deploy** → **New deployment**
2. **Select type**: "Web app" seçin
3. **Description**: "Analytics Handler v1"
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
   - **Name**: `GOOGLE_ANALYTICS_SCRIPT_URL`
   - **Value**: Google Apps Script Web App URL-ni yapışdırın
   - **Environment**: Production, Preview, Development (hamısını seçin)
3. **Save** düyməsinə basın

### 5. Redeploy Edin

1. Vercel Dashboard → Deployments
2. Son deployment üçün **Redeploy** düyməsinə basın
3. Və ya GitHub-da yeni commit push edin

## Analytics Məlumatlarının Analizi

### Google Sheets-də Pivot Table Yaradın

1. **Data** → **Pivot table**
2. **Rows**: Type, Section, Action
3. **Values**: COUNT (neçə dəfə)
4. **Filters**: Page, Timestamp

### Məlumat Nümunələri

- **Page Views**: `type = "pageview"` olan sətirlər
- **Section Views**: `type = "section_view"` olan sətirlər
- **Button Clicks**: `type = "button_click"` olan sətirlər
- **Form Submissions**: `type = "form_submit"` olan sətirlər
- **Scroll Depth**: `type = "scroll_depth"` və ya `scrollDepth` sütununda
- **Time Spent**: `type = "time_spent"` və ya `timeSpent` sütununda

## Test

1. Saytı açın və müxtəlif bölmələrə keçin
2. Düymələrə klik edin
3. Form doldurun və göndərin
4. Google Sheets-də yeni sətirlərin əlavə olunduğunu yoxlayın

## Qeydlər

- Analytics məlumatları real-time toplanır
- Hər event ayrı sətir kimi əlavə olunur
- Session ID ilə istifadəçiləri izləyə bilərsiniz
- Scroll depth və time spent məlumatları dəqiqdir
- Exit intent tracking istifadəçi səhifəni tərk etmək istəyəndə işləyir

## Problem Həlləri

### Analytics məlumatları Sheets-də görünmür
1. Google Apps Script URL-ini yoxlayın
2. Vercel Environment Variable-ı yoxlayın (`GOOGLE_ANALYTICS_SCRIPT_URL`)
3. Google Apps Script-də "View" → "Execution log" yoxlayın
4. Browser console-da xətaları yoxlayın

### Authorization xətası
1. Google Apps Script-də "Deploy" → "Manage deployments"
2. "Edit" → "Who has access" → "Anyone" seçin
3. Yenidən deploy edin

### Çox sayda event
- Analytics eventləri batch olaraq göndərilir (hər 30 saniyədə bir)
- Page unload zamanı bütün eventlər göndərilir
- Bu performansı yaxşılaşdırır

