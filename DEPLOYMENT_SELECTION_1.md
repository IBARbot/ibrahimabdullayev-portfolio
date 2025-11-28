# Seçim 1: Ayrı Platformalar Deployment - Addım-Addım Təlimat

## 🎯 Nə edəcəyik?

- **Frontend** → Vercel.com-da deploy edəcəyik
- **Backend** → Railway.app-də deploy edəcəyik
- **Domain** → ibrahimabdullayev.com və ibrahimabdullayev.az

---

## 📋 Hazırlıq

### Lazımi şeylər:
1. ✅ GitHub hesabı
2. ✅ Vercel hesabı (pulsuz)
3. ✅ Railway hesabı (pulsuz)
4. ✅ Domain (ibrahimabdullayev.com və .az)
5. ✅ Gmail App Password (email üçün)

---

## 🚀 Addım 1: GitHub Repository

### 1.1. Project-i GitHub-a yükləyin

```bash
# Terminal-də project qovluğunda
cd "C:\Users\Ibrahim ETA\Downloads\ibrahim abdullayev com"

# Git initialize (əgər yoxdursa)
git init

# Bütün faylları əlavə edin
git add .

# Commit edin
git commit -m "Initial commit - Tourism portfolio website"

# GitHub-da yeni repository yaradın (github.com-da)
# Sonra remote əlavə edin:
git remote add origin https://github.com/YOUR_USERNAME/ibrahimabdullayev-portfolio.git

# Push edin
git branch -M main
git push -u origin main
```

**Qeyd:** `YOUR_USERNAME` yerinə GitHub username-inizi yazın.

---

## 🔧 Addım 2: Backend Deployment (Railway)

### 2.1. Railway Hesabı

1. [Railway.app](https://railway.app) açın
2. "Start a New Project" klikləyin
3. "Login with GitHub" seçin
4. GitHub hesabınızla giriş edin

### 2.2. Project Deploy

1. "New Project" → "Deploy from GitHub repo"
2. Repository-nizi seçin: `ibrahimabdullayev-portfolio`
3. Railway avtomatik detect edəcək:
   - **Root Directory:** `/` (boş buraxın)
   - **Start Command:** `node backend/server.js`

### 2.3. Environment Variables

Railway Dashboard → Project → Variables → "New Variable"

Aşağıdakı variables-ı əlavə edin:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters-long-change-this
EMAIL_USER=ibrahim.abdullayev1@gmail.com
EMAIL_PASS=your-gmail-app-password-here
CONTACT_EMAIL=ibrahim.abdullayev1@gmail.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password-change-this
```

**⚠️ Vacib:**
- `JWT_SECRET` - Güclü random string (minimum 32 character)
- `EMAIL_PASS` - Gmail App Password (regular password deyil!)
- `ADMIN_PASSWORD` - Güclü şifrə seçin

### 2.4. Gmail App Password Almaq

1. Google Account → [Security](https://myaccount.google.com/security)
2. "2-Step Verification" aktivləşdirin (əgər yoxdursa)
3. "App passwords" → "Generate"
4. App: "Mail", Device: "Other (Custom name)" → "ibrahim-portfolio"
5. Generated password-u kopyalayın və `EMAIL_PASS` kimi istifadə edin

### 2.5. Railway Domain

1. Railway Dashboard → Project → Settings → "Generate Domain"
2. Domain alın: `ibrahim-backend.railway.app` (nümunə)
3. Bu domain-i qeyd edin (frontend üçün lazımdır)

### 2.6. Test

Browser-də açın: `https://your-railway-domain.railway.app/api/health`

Cavab görməlisiniz:
```json
{"status":"ok","message":"Server is running"}
```

---

## 🎨 Addım 3: Frontend Deployment (Vercel)

### 3.1. Vercel Hesabı

1. [Vercel.com](https://vercel.com) açın
2. "Sign Up" → "Continue with GitHub"
3. GitHub hesabınızla giriş edin

### 3.2. Project Deploy

1. Dashboard → "Add New..." → "Project"
2. GitHub repository-nizi seçin: `ibrahimabdullayev-portfolio`
3. **Import Project** klikləyin

### 3.3. Build Settings

Vercel avtomatik detect edəcək, amma yoxlayın:

- **Framework Preset:** `Vite`
- **Root Directory:** `./` (boş buraxın)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3.4. Environment Variables

Vercel Dashboard → Project → Settings → Environment Variables

**Production** üçün əlavə edin:

```
VITE_API_URL=https://your-railway-domain.railway.app
```

**Qeyd:** `your-railway-domain.railway.app` yerinə Railway-dən aldığınız domain-i yazın.

### 3.5. Vercel.json Konfiqurasiyası

Project root-də `vercel.json` faylı yoxlayın (artıq var):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-railway-domain.railway.app/api/$1"
    }
  ]
}
```

**⚠️ Vacib:** `your-railway-domain.railway.app` yerinə Railway domain-inizi yazın!

### 3.6. Deploy

1. "Deploy" klikləyin
2. 2-3 dəqiqə gözləyin
3. Deployment tamamlandıqda Vercel domain alın: `ibrahimabdullayev-portfolio.vercel.app`

### 3.7. Test

Browser-də açın: `https://your-vercel-domain.vercel.app`

Sayt açılmalıdır!

---

## 🌐 Addım 4: Domain Konfiqurasiyası

### 4.1. Vercel-də Custom Domain

#### ibrahimabdullayev.com üçün:

1. Vercel Dashboard → Project → Settings → Domains
2. "Add Domain" klikləyin
3. `ibrahimabdullayev.com` yazın
4. "Add" klikləyin
5. Vercel DNS records göstərəcək

#### ibrahimabdullayev.az üçün:

1. Eyni addımları təkrarlayın
2. `ibrahimabdullayev.az` əlavə edin

### 4.2. Domain Registrar-də DNS Records

Domain-inizi satın aldığınız yerdə (GoDaddy, Namecheap, və s.):

#### ibrahimabdullayev.com üçün:

**CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Qeyd:** Vercel Dashboard-da dəqiq IP və CNAME göstəriləcək, onları istifadə edin.

#### ibrahimabdullayev.az üçün:

Eyni records-ı təkrarlayın.

### 4.3. SSL Sertifikatı

Vercel avtomatik SSL sertifikatı verir (Let's Encrypt).
24 saat ərzində aktiv olacaq.

---

## ✅ Addım 5: Test və Yoxlama

### 5.1. Frontend Test

1. `https://ibrahimabdullayev.com` açın
2. Bütün səhifələrin yükləndiyini yoxlayın
3. Navigation işləyir?
4. Forms işləyir?

### 5.2. Backend API Test

Browser-də və ya Terminal-də:

```bash
# Health check
curl https://your-railway-domain.railway.app/api/health

# Content API
curl https://your-railway-domain.railway.app/api/content

# Projects API
curl https://your-railway-domain.railway.app/api/projects
```

### 5.3. Contact Form Test

1. Contact formunu doldurun
2. Göndərin
3. Email-in gəldiyini yoxlayın

### 5.4. Booking Form Test

1. Booking formunu doldurun
2. Göndərin
3. Admin panel-də göründüyünü yoxlayın

### 5.5. Admin Panel Test

1. `https://ibrahimabdullayev.com/admin` açın
2. Login olun
3. Content və bookings-i yoxlayın

---

## 🔄 Addım 6: Code Update Prosesi

### Yeni dəyişikliklər üçün:

1. **Local-də dəyişiklik edin:**
   ```bash
   # Faylları redaktə edin
   # Test edin
   ```

2. **Git commit və push:**
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```

3. **Avtomatik Deploy:**
   - Vercel avtomatik frontend-i rebuild edəcək
   - Railway avtomatik backend-i restart edəcək
   - 2-3 dəqiqə gözləyin

---

## 🐛 Problem Həll Etmə

### Problem: Backend işləmir

**Yoxlayın:**
1. Railway Dashboard → Deployments → Logs
2. Environment variables düzgündür?
3. `EMAIL_PASS` Gmail App Password-dur?

**Həll:**
```bash
# Railway Dashboard-dan:
# Settings → Redeploy
```

### Problem: Frontend API çağırışları işləmir

**Yoxlayın:**
1. `vercel.json`-da Railway domain düzgündür?
2. Environment variable `VITE_API_URL` set edilib?
3. Browser Console-da error var?

**Həll:**
```bash
# Vercel Dashboard-dan:
# Settings → Environment Variables → yeniləyin
# Redeploy edin
```

### Problem: Domain işləmir

**Yoxlayın:**
1. DNS records düzgündür?
2. 24-48 saat gözləyin (DNS propagation)
3. [whatsmydns.net](https://www.whatsmydns.net) ilə yoxlayın

**Həll:**
- DNS records-ı yenidən yoxlayın
- Domain registrar support-a müraciət edin

### Problem: Email göndərilmir

**Yoxlayın:**
1. `EMAIL_PASS` Gmail App Password-dur? (regular password deyil!)
2. 2-Step Verification aktivdir?
3. Railway logs-da error var?

**Həll:**
- Yeni Gmail App Password yaradın
- Railway environment variables-da yeniləyin
- Redeploy edin

---

## 📊 Monitoring

### Vercel Monitoring

- Dashboard → Analytics
- Traffic, Performance, Errors

### Railway Monitoring

- Dashboard → Metrics
- CPU, Memory, Network

### Uptime Monitoring (Tövsiyə)

- [UptimeRobot](https://uptimerobot.com) (pulsuz)
- [Pingdom](https://www.pingdom.com)
- 5 dəqiqədə bir yoxlayır

---

## 💰 Xərclər

### Pulsuz Planlar:

- **Vercel:** Pulsuz (Hobby plan)
  - Unlimited deployments
  - 100GB bandwidth/ay
  - SSL daxildir

- **Railway:** $5 credit/ay (pulsuz)
  - 500 hours/ay
  - $5 credit

### Ödənişli (lazım olsa):

- **Vercel Pro:** $20/ay (daha çox bandwidth)
- **Railway:** $5-10/ay (daha çox resources)

**Ümumi:** Başlanğıcda **PULSUZ** işləyir! 🎉

---

## 📝 Checklist

Deployment tamamlandıqdan sonra:

- [ ] Backend Railway-də işləyir
- [ ] Frontend Vercel-də işləyir
- [ ] Domain-lər bağlanıb
- [ ] SSL sertifikatları aktiv
- [ ] Contact form işləyir
- [ ] Booking form işləyir
- [ ] Admin panel işləyir
- [ ] Email göndərilir
- [ ] Bütün API endpoints işləyir
- [ ] Mobile responsive işləyir

---

## 🎉 Təbriklər!

Saytınız canlıdır:
- 🌐 https://ibrahimabdullayev.com
- 🌐 https://ibrahimabdullayev.az

---

## 📞 Dəstək

Problem yaşayırsınızsa:
- Railway Support: [railway.app/support](https://railway.app/support)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Email: ibrahim.abdullayev1@gmail.com

---

**Son yeniləmə:** 2024
**Versiya:** 1.0.0

