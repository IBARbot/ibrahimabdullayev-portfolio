# ✅ Deployment Checklist

## Tamamlanan Addımlar

- [x] GitHub repository yaradıldı
- [x] Kodlar GitHub-a push edildi
- [x] Vercel-də project yaradıldı
- [x] Environment Variables əlavə edildi:
  - [x] JWT_SECRET: `c95cEp8Af7CJ0mCJE2ioUUbbuQyamLvJ`
  - [x] EMAIL_USER: `ibrahim.abdullayev1@gmail.com`
  - [x] EMAIL_PASS: `iicjawivyhhpycdk` (Gmail App Password)
  - [x] CONTACT_EMAIL: `ibrahim.abdullayev1@gmail.com`
  - [x] ADMIN_USERNAME: `ibrahim.abdullayev1@gmail.com`
  - [x] ADMIN_PASSWORD: `MyAdmin2024!@#`

## Növbəti Addımlar

### 1. Deploy Et
- [ ] Vercel-də "Deploy" düyməsinə bas
- [ ] Build prosesini gözlə (2-3 dəqiqə)
- [ ] Deployment uğurlu olduğunu yoxla

### 2. Deployment-dan Sonra Test Et
- [ ] Saytı aç: `https://ibrahimabdullayev-portfolio.vercel.app`
- [ ] Contact form-u test et
- [ ] Booking form-u test et
- [ ] Admin panelə daxil ol: `/admin`
  - Username: `ibrahim.abdullayev1@gmail.com`
  - Password: `MyAdmin2024!@#`

### 3. Domain Bağla (İstəyə görə)
- [ ] Vercel → Settings → Domains → Add Domain
- [ ] `ibrahimabdullayev.com` əlavə et
- [ ] `ibrahimabdullayev.az` əlavə et
- [ ] DNS records əlavə et (Vercel göstərəcək)

## Test Üçün

### Contact Form Test:
1. Saytda Contact bölməsinə get
2. Formu doldur və göndər
3. Email-də mesajı yoxla: `ibrahim.abdullayev1@gmail.com`

### Booking Form Test:
1. "İndi Rezerv Et" düyməsinə bas
2. Formu doldur (məsələn: Flight booking)
3. Göndər
4. Email-də booking sorğusunu yoxla

### Admin Panel Test:
1. `/admin` səhifəsinə get
2. Login:
   - Username: `ibrahim.abdullayev1@gmail.com`
   - Password: `MyAdmin2024!@#`
3. Content dəyişdirməyi test et
4. Bookings siyahısını yoxla

## Problemlər?

### Email göndərilmir?
- Gmail App Password düzgündürmü yoxla
- Vercel Logs-u yoxla: Deployments → Son deployment → Logs

### Admin panelə giriş olmur?
- Username və Password düzgündürmü yoxla
- Browser Console-da error varmı yoxla (F12)

### Sayt açılmır?
- Vercel Dashboard-da deployment status-u yoxla
- Build logs-u yoxla


