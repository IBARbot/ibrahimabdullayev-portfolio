# Seçim 1: Ayrı Platformalar Deployment - Render.com (Pulsuz)

## 🎯 Nə edəcəyik?

- **Frontend** → Vercel.com-da deploy edəcəyik
- **Backend** → Render.com-da deploy edəcəyik (PULSUZ!)
- **Domain** → ibrahimabdullayev.com və ibrahimabdullayev.az

---

## 📋 Hazırlıq

### Lazımi şeylər:
1. ✅ GitHub hesabı
2. ✅ Vercel hesabı (pulsuz)
3. ✅ Render hesabı (pulsuz)
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

## 🔧 Addım 2: Backend Deployment (Render.com)

### 2.1. Render Hesabı

1. [Render.com](https://render.com) açın
2. "Get Started for Free" klikləyin
3. "Sign up with GitHub" seçin
4. GitHub hesabınızla giriş edin

### 2.2. New Web Service

1. Dashboard → "New +" → "Web Service"
2. "Connect GitHub" → Repository-nizi seçin: `ibrahimabdullayev-portfolio`
3. **Service Settings:**
   - **Name:** `ibrahim-backend` (və ya istədiyiniz ad)
   - **Region:** `Frankfurt` (və ya sizə yaxın)
   - **Branch:** `main`
   - **Root Directory:** `./` (boş buraxın)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node backend/server.js`

### 2.3. Environment Variables

Render Dashboard → Service → Environment → "Add Environment Variable"

Aşağıdakı variables-ı əlavə edin:

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters-long-change-this
EMAIL_USER=ibrahim.abdullayev1@gmail.com
EMAIL_PASS=your-gmail-app-password-here
CONTACT_EMAIL=ibrahim.abdullayev1@gmail.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password-change-this
```

**⚠️ Vacib:**
- `PORT=10000` - Render default port (dəyişdirməyin)
- `JWT_SECRET` - Güclü random string (minimum 32 character)
- `EMAIL_PASS` - Gmail App Password (regular password deyil!)
- `ADMIN_PASSWORD` - Güclü şifrə seçin

### 2.4. Gmail App Password Almaq

1. Google Account → [Security](https://myaccount.google.com/security)
2. "2-Step Verification" aktivləşdirin (əgər yoxdursa)
3. "App passwords" → "Generate"
4. App: "Mail", Device: "Other (Custom name)" → "ibrahim-portfolio"
5. Generated password-u kopyalayın və `EMAIL_PASS` kimi istifadə edin

### 2.5. Render Plan

1. **Free Plan** seçin (pulsuz!)
2. "Create Web Service" klikləyin
3. Render deploy etməyə başlayacaq (5-10 dəqiqə)

### 2.6. Render Domain

1. Deploy tamamlandıqdan sonra:
   - Service → Settings → "Custom Domain" bölməsi
   - Render avtomatik domain verir: `ibrahim-backend.onrender.com` (nümunə)
2. Bu domain-i qeyd edin (frontend üçün lazımdır)

**⚠️ Qeyd:** Render Free plan-da:
- 15 dəqiqə aktivlik yoxdursa "sleep" olur
- İlk request 30-60 saniyə çəkə bilər (wake up)
- Production üçün "Starter" plan tövsiyə olunur ($7/ay)

### 2.7. Test

Browser-də açın: `https://your-render-domain.onrender.com/api/health`

Cavab görməlisiniz:
```json
{"status":"ok","message":"Server is running"}
```

**Qeyd:** İlk request yavaş ola bilər (sleep-dən oyanır).

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
VITE_API_URL=https://your-render-domain.onrender.com
```

**Qeyd:** `your-render-domain.onrender.com` yerinə Render-dən aldığınız domain-i yazın.

### 3.5. Vercel.json Konfiqurasiyası

Project root-də `vercel.json` faylı yoxlayın və Render domain ilə yeniləyin:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-render-domain.onrender.com/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**⚠️ Vacib:** `your-render-domain.onrender.com` yerinə Render domain-inizi yazın!

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
curl https://your-render-domain.onrender.com/api/health

# Content API
curl https://your-render-domain.onrender.com/api/content

# Projects API
curl https://your-render-domain.onrender.com/api/projects
```

**Qeyd:** İlk request yavaş ola bilər (Render sleep-dən oyanır).

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
   - Render avtomatik backend-i restart edəcək
   - 2-3 dəqiqə gözləyin

---

## 🐛 Problem Həll Etmə

### Problem: Backend işləmir

**Yoxlayın:**
1. Render Dashboard → Service → Logs
2. Environment variables düzgündür?
3. `EMAIL_PASS` Gmail App Password-dur?
4. `PORT=10000` set edilib? (Render default)

**Həll:**
```bash
# Render Dashboard-dan:
# Service → Manual Deploy → "Deploy latest commit"
```

### Problem: Backend yavaş işləyir (ilk request)

**Səbəb:** Render Free plan-da 15 dəqiqə aktivlik yoxdursa "sleep" olur.

**Həll:**
1. **Uptime monitoring istifadə edin:**
   - [UptimeRobot](https://uptimerobot.com) (pulsuz)
   - 5 dəqiqədə bir ping göndərir (sleep olmur)
2. **Və ya Starter plan alın:** $7/ay (sleep yoxdur)

### Problem: Frontend API çağırışları işləmir

**Yoxlayın:**
1. `vercel.json`-da Render domain düzgündür?
2. Environment variable `VITE_API_URL` set edilib?
3. Browser Console-da error var?
4. CORS error var? (Render-də CORS aktivdir)

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
3. Render logs-da error var?

**Həll:**
- Yeni Gmail App Password yaradın
- Render environment variables-da yeniləyin
- Redeploy edin

---

## 📊 Monitoring

### Vercel Monitoring

- Dashboard → Analytics
- Traffic, Performance, Errors

### Render Monitoring

- Dashboard → Service → Metrics
- CPU, Memory, Requests
- Logs → Real-time logs

### Uptime Monitoring (Tövsiyə - Render Sleep üçün)

- [UptimeRobot](https://uptimerobot.com) (pulsuz)
- [Pingdom](https://www.pingdom.com)
- 5 dəqiqədə bir ping göndərir (Render sleep olmur)

**UptimeRobot Setup:**
1. [UptimeRobot.com](https://uptimerobot.com) → Sign Up
2. "Add New Monitor"
3. Monitor Type: "HTTP(s)"
4. URL: `https://your-render-domain.onrender.com/api/health`
5. Interval: 5 minutes
6. Save

---

## 💰 Xərclər

### Pulsuz Planlar:

- **Vercel:** Pulsuz (Hobby plan)
  - Unlimited deployments
  - 100GB bandwidth/ay
  - SSL daxildir

- **Render:** Pulsuz (Free plan)
  - 750 hours/ay
  - Sleep mode (15 dəqiqə aktivlik yoxdursa)
  - SSL daxildir

### Ödənişli (lazım olsa):

- **Vercel Pro:** $20/ay (daha çox bandwidth)
- **Render Starter:** $7/ay (sleep yoxdur, daha sürətli)

**Ümumi:** Başlanğıcda **PULSUZ** işləyir! 🎉

**Qeyd:** Render Free plan-da sleep mode var. Production üçün Starter plan ($7/ay) tövsiyə olunur.

---

## 📝 Checklist

Deployment tamamlandıqdan sonra:

- [ ] Backend Render-də işləyir
- [ ] Frontend Vercel-də işləyir
- [ ] Domain-lər bağlanıb
- [ ] SSL sertifikatları aktiv
- [ ] Contact form işləyir
- [ ] Booking form işləyir
- [ ] Admin panel işləyir
- [ ] Email göndərilir
- [ ] Bütün API endpoints işləyir
- [ ] Mobile responsive işləyir
- [ ] Uptime monitoring quraşdırılıb (sleep üçün)

---

## 🎉 Təbriklər!

Saytınız canlıdır:
- 🌐 https://ibrahimabdullayev.com
- 🌐 https://ibrahimabdullayev.az

---

## 📞 Dəstək

Problem yaşayırsınızsa:
- Render Support: [render.com/docs](https://render.com/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Email: ibrahim.abdullayev1@gmail.com

---

## 🔄 Render vs Railway Müqayisəsi

| Xüsusiyyət | Render (Free) | Railway (Free) |
|------------|---------------|----------------|
| **Plan** | Pulsuz | $5 credit/ay |
| **Sleep Mode** | Var (15 dəq) | Yox |
| **SSL** | Avtomatik | Avtomatik |
| **Deploy** | GitHub | GitHub |
| **Logs** | Real-time | Real-time |
| **Custom Domain** | Var | Var |

**Nəticə:** Render Free plan daha yaxşıdır (sleep mode olsa da, pulsuzdur).

---

**Son yeniləmə:** 2024
**Versiya:** 1.0.0


