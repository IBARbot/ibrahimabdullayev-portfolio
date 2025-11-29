# Email Göndərmə Problemləri - Troubleshooting

## Problem

"Şifrəmi unutdum" funksiyası işləyir, amma email gəlmir.

## Yoxlama Addımları

### 1. Vercel Environment Variables Yoxlayın

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Bu dəyişənlərin olduğunu yoxlayın:
   - `EMAIL_USER` = `ibrahim.abdullayev1@gmail.com`
   - `EMAIL_PASS` = Gmail App Password (16 simvol)
   - `ADMIN_EMAIL` = `ibrahim.abdullayev1@gmail.com` (istəyə bağlı)
   - `CONTACT_EMAIL` = `ibrahim.abdullayev1@gmail.com` (istəyə bağlı)

### 2. Gmail App Password Yoxlayın

1. **Google Account** → **Security** → **2-Step Verification** (aktiv olmalıdır)
2. **App Passwords** → Yeni App Password yaradın
3. **App:** Mail
4. **Device:** Vercel
5. 16 simvollu şifrəni kopyalayın
6. Vercel-də `EMAIL_PASS` dəyərinə yapışdırın

### 3. Vercel Logs Yoxlayın

1. **Vercel Dashboard** → **Deployments** → **Son deployment** → **Logs**
2. **Functions** → `/api/admin/forgot-password` → **Logs**
3. Axtarın:
   - `Password reset requested for:`
   - `EMAIL_USER: Mövcuddur`
   - `EMAIL_PASS: Mövcuddur`
   - `Email transporter yaradıldı`
   - `Email uğurla göndərildi`

**Xəta varsa:**
- `Email transporter yaradıla bilmədi` - EMAIL_USER və ya EMAIL_PASS yoxdur
- `Forgot password email error:` - Email göndərmə xətası

### 4. Gmail Spam Qovluğu

1. Gmail → **Spam** qovluğunu yoxlayın
2. **All Mail** qovluğunu yoxlayın
3. **Search:** `Admin Panel - Şifrə Sıfırlama`

### 5. Email Göndərmə Testi

1. **Contact form**-dan test mesajı göndərin
2. Email gəlirsə → Email konfiqurasiyası düzgündür
3. Email gəlmirsə → EMAIL_USER və EMAIL_PASS problemlidir

## Ümumi Xətalar

### Xəta: "Email transporter yaradıla bilmədi"
**Səbəb:** `EMAIL_USER` və ya `EMAIL_PASS` environment variable yoxdur
**Həll:** Vercel-də environment variable-ları yoxlayın və yeniləyin

### Xəta: "Invalid login" və ya "Authentication failed"
**Səbəb:** Gmail App Password səhvdir və ya müddəti bitib
**Həll:** Yeni Gmail App Password yaradın

### Xəta: Email gəlmir, amma log-da "Email uğurla göndərildi" yazır
**Səbəb:** Email spam qovluğundadır və ya Gmail filtri bloklayır
**Həll:** 
- Spam qovluğunu yoxlayın
- Gmail Settings → Filters → Bloklanmış email-ləri yoxlayın

## Test

1. Admin Panel → "Şifrəmi unutdum"
2. Email: `ibrahim.abdullayev1@gmail.com`
3. "Göndər" düyməsinə basın
4. Vercel Logs-ı yoxlayın
5. Email-ı yoxlayın (gələnlər, spam, all mail)


