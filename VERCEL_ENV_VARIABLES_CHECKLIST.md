# Vercel Environment Variables - Yoxlama Siyahısı

## ✅ Əlavə Edilmiş Environment Variables

### 1. GOOGLE_SERVICE_ACCOUNT_KEY ✅
- **Name**: `GOOGLE_SERVICE_ACCOUNT_KEY`
- **Value**: Base64 encode edilmiş JSON key (uzun mətn)
- **Status**: ✅ Əlavə edilib
- **Environment**: Production, Preview, Development (hamısı seçilməlidir)

### 2. GOOGLE_SHEET_ID ⚠️
- **Name**: `GOOGLE_SHEET_ID`
- **Value**: `1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA`
- **Status**: ⚠️ **ƏLAVƏ EDİLMƏLİDİR**
- **Environment**: Production, Preview, Development (hamısı seçilməlidir)

## Növbəti Addımlar

### Addım 1: GOOGLE_SHEET_ID Əlavə Edin

1. Vercel Dashboard → Settings → Environment Variables
2. **"Add New"** (Yeni Əlavə Et) düyməsinə basın
3. Şu məlumatları daxil edin:
   - **Name**: `GOOGLE_SHEET_ID`
   - **Value**: `1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA`
   - **Environment**: Production, Preview, Development (hamısını seçin)
4. **"Save"** (Saxla) düyməsinə basın

### Addım 2: Deployment Yeniləyin

1. Vercel Dashboard-da **"Deployments"** (Dağıtımlar) bölməsinə keçin
2. Son deployment-ın yanındakı **üç nöqtə (⋮)** menüsünə tıklayın
3. **"Redeploy"** (Yeniden dağıt) seçin
4. Deployment-ın tamamlanmasını gözləyin (2-3 dəqiqə)

### Addım 3: Test Edin

1. Sitenizdə booking formunu doldurun
2. Formu göndərin
3. Google Sheets-də yeni satırın əlavə olunduğunu yoxlayın
4. Vercel Logs-u yoxlayın: **Deployments** → Son deployment → **Logs**

## Yoxlama

### Environment Variables Siyahısı:
- ✅ `GOOGLE_SERVICE_ACCOUNT_KEY` - Əlavə edilib
- ⚠️ `GOOGLE_SHEET_ID` - **ƏLAVƏ EDİLMƏLİDİR**

### Digər Environment Variables (Əvvəldən var):
- ✅ `JWT_SECRET`
- ✅ `EMAIL_USER`
- ✅ `EMAIL_PASS`
- ✅ `CONTACT_EMAIL`
- ✅ `ADMIN_USERNAME`
- ✅ `ADMIN_PASSWORD`

## Qeyd

**GOOGLE_SHEET_ID** olmadan Google Sheets inteqrasiyası işləməyəcək. Bu dəyişkəni mutlaka əlavə edin!

