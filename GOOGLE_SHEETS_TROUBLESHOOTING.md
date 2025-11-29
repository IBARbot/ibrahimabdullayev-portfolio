# Google Sheets Probleminin Həlli - Təlimat

## Problem
Email gəlir, amma Google Sheets-də məlumat yazılmır.

## Yoxlama Addımları

### 1. Google Sheets Strukturu Yoxlama

Google Sheets-də ilk sətirdə (A1-dən başlayaraq) aşağıdakı başlıqlar olmalıdır:

| A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 | I1 | J1 | K1 |
|---|---|---|---|---|---|---|---|---|---|---|
| Tarix | Növ | Ad | Email | Telefon | Haradan | Hara | Gediş tarixi | Qayıdış tarixi | Nəfər sayı | Əlavə məlumat |

**Qeyd:** Başlıqların dəqiq olması vacib deyil, amma məlumatlar A sütunundan başlayaraq yazılacaq.

### 2. Vercel Environment Variables Yoxlama

Vercel Dashboard → Settings → Environment Variables bölməsində:

**Mütləq olmalıdır:**
- ✅ `GOOGLE_SHEET_ID` = `1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA`
- ✅ `GOOGLE_SERVICE_ACCOUNT_KEY` = (Base64 encode edilmiş JSON)

**İsteğe bağlı (fallback üçün):**
- `GOOGLE_SHEETS_API_KEY` = `AIzaSyBT47CJJvh9lidce-smaTWvpOrZ82ReAXI`

### 3. Vercel Logs Yoxlama

1. Vercel Dashboard → **Deployments** (Dağıtımlar)
2. Son deployment-ı açın
3. **"Logs"** (Günlüklər) sekmesine keçin
4. Aşağıdakı xətaları axtarın:
   - `Google Sheets xətası`
   - `Service Account xətası`
   - `Access token alınamadı`
   - `Google Sheets konfiqurasiya edilməyib`

### 4. Service Account Paylaşımı Yoxlama

1. Google Sheets-i açın
2. **"Paylaş"** (Share) düyməsinə basın
3. Service Account email-inin siyahıda olduğunu yoxlayın:
   - `ibrahim-portfolio-sheets@banded-arcana-479707-b2.iam.gserviceaccount.com`
4. İcazənin **"Düzenleyici"** (Editor) olduğunu yoxlayın

### 5. Google Sheets API Aktivləşdirilməsi

1. [Google Cloud Console](https://console.cloud.google.com/) → Projenizi seçin
2. **"APIs & Services"** → **"Enabled APIs & services"**
3. **"Google Sheets API"** aktivləşdirildiyini yoxlayın
4. Əgər yoxdursa, **"Enable"** düyməsinə basın

### 6. Kod Test

Booking form göndərdikdən sonra:

1. Vercel Logs-da axtarın:
   ```
   Google Sheets-ə uğurla əlavə edildi
   ```
   və ya
   ```
   Google Sheets xətası
   ```

2. Əgər xəta varsa, xəta mesajını kopyalayın

## Ümumi Problemlər və Həlləri

### Problem 1: "Access token alınamadı"
**Səbəb:** Service Account key düzgün decode olunmur və ya JWT yanlışdır
**Həll:**
- Base64 encode edilmiş JSON key-in düzgün olduğunu yoxlayın
- Vercel Logs-da xəta mesajını yoxlayın

### Problem 2: "403 Forbidden"
**Səbəb:** Service Account Google Sheets-də paylaşılmayıb və ya icazə yoxdur
**Həll:**
- Service Account email-ini Google Sheets-də paylaşın
- "Düzenleyici" (Editor) icazəsi verin

### Problem 3: "404 Not Found"
**Səbəb:** Spreadsheet ID yanlışdır
**Həll:**
- `GOOGLE_SHEET_ID` environment variable-ının düzgün olduğunu yoxlayın
- Spreadsheet ID: `1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA`

### Problem 4: "Google Sheets konfiqurasiya edilməyib"
**Səbəb:** Environment variables yoxdur
**Həll:**
- `GOOGLE_SHEET_ID` və `GOOGLE_SERVICE_ACCOUNT_KEY` əlavə edin
- Deployment-i yeniləyin

## Test Addımları

1. **Environment Variables Yoxlama:**
   - Vercel Dashboard → Settings → Environment Variables
   - `GOOGLE_SHEET_ID` və `GOOGLE_SERVICE_ACCOUNT_KEY` olduğunu yoxlayın

2. **Deployment Yeniləmə:**
   - Vercel Dashboard → Deployments → Son deployment → Redeploy

3. **Booking Form Test:**
   - Sitenizdə booking formunu doldurun
   - Formu göndərin

4. **Logs Yoxlama:**
   - Vercel Dashboard → Deployments → Son deployment → Logs
   - Xəta mesajlarını yoxlayın

5. **Google Sheets Yoxlama:**
   - Google Sheets-i açın
   - Yeni satırın əlavə olunduğunu yoxlayın

## Debug Məlumatları

Vercel Logs-da axtarılmalı məlumatlar:
- `Google Sheets ID konfiqurasiya edilməyib` - GOOGLE_SHEET_ID yoxdur
- `Service Account xətası` - Service Account problemi
- `Access token alınamadı` - JWT/OAuth problemi
- `Google Sheets xətası` - API çağırışı problemi

## Əlavə Yardım

Əgər problem davam edərsə:
1. Vercel Logs-da xəta mesajını kopyalayın
2. Google Sheets-də Service Account paylaşımını yoxlayın
3. Environment Variables-ın düzgün olduğunu təsdiq edin

