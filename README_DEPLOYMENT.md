# 🚀 Deployment - Seçim 1: Ayrı Platformalar (Render.com)

## 📋 Hazırlıq Checklist

- [ ] GitHub hesabı var
- [ ] Vercel hesabı yaradılıb
- [ ] Render hesabı yaradılıb (PULSUZ!)
- [ ] Domain-lər satın alınıb (ibrahimabdullayev.com və .az)
- [ ] Gmail App Password hazırdır

---

## 🎯 Deployment Addımları

### 1️⃣ GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ibrahimabdullayev-portfolio.git
git push -u origin main
```

### 2️⃣ Render Backend (PULSUZ!)

1. [Render.com](https://render.com) → New Web Service
2. GitHub repository-ni connect edin
3. Settings:
   - Build Command: `npm install`
   - Start Command: `node backend/server.js`
4. Environment Variables əlavə edin (aşağıda)
5. Free plan seçin və deploy edin

### 3️⃣ Vercel Frontend

1. [Vercel.com](https://vercel.com) → Add New Project
2. Repository seçin
3. Environment Variable: `VITE_API_URL=https://your-render-domain.onrender.com`
4. `vercel.json`-da Render domain-inizi yazın
5. Deploy!

### 4️⃣ Domain Konfiqurasiyası

1. Vercel → Settings → Domains → Add:
   - `ibrahimabdullayev.com`
   - `ibrahimabdullayev.az`
2. DNS records əlavə edin (Vercel göstərəcək)

---

## 🔐 Environment Variables

### Render (Backend)

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-32-character-secret-key
EMAIL_USER=ibrahim.abdullayev1@gmail.com
EMAIL_PASS=gmail-app-password
CONTACT_EMAIL=ibrahim.abdullayev1@gmail.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-password
```

**⚠️ Qeyd:** `PORT=10000` (Render default, dəyişdirməyin!)

### Vercel (Frontend)

```
VITE_API_URL=https://your-render-domain.onrender.com
```

---

## 📚 Detallı Təlimatlar

- **Tam təlimat:** `DEPLOYMENT_SELECTION_1_RENDER.md` ⭐
- **Tez başlanğıc:** `QUICK_START_DEPLOYMENT.md`
- **Backend analizi:** `BACKEND_ANALYSIS.md`

---

## ⚠️ Render Free Plan Qeydləri

- **Sleep Mode:** 15 dəqiqə aktivlik yoxdursa "sleep" olur
- **İlk Request:** 30-60 saniyə çəkə bilər (wake up)
- **Həll:** UptimeRobot istifadə edin (5 dəq ping) və ya Starter plan ($7/ay)

---

## ✅ Test

1. `https://ibrahimabdullayev.com` açın
2. Forms test edin
3. Admin panel test edin (`/admin`)

---

**Suallarınız varsa:** ibrahim.abdullayev1@gmail.com

