# 🚀 Vercel Deployment - Qısa Təlimat

## ⚡ 3 Addımda Deploy

### 1️⃣ GitHub-a Yükləyin

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ibrahimabdullayev-portfolio.git
git push -u origin main
```

### 2️⃣ Vercel-də Deploy

1. [Vercel.com](https://vercel.com) → "Add New Project"
2. GitHub repository-ni seçin
3. **Environment Variables əlavə edin:**
   ```
   JWT_SECRET=your-32-character-secret-key
   EMAIL_USER=ibrahim.abdullayev1@gmail.com
   EMAIL_PASS=gmail-app-password
   CONTACT_EMAIL=ibrahim.abdullayev1@gmail.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=secure-password
   ```
4. Deploy!

### 3️⃣ Domain Bağlayın

1. Vercel → Settings → Domains → Add:
   - `ibrahimabdullayev.com`
   - `ibrahimabdullayev.az`
2. DNS records əlavə edin (Vercel göstərəcək)

---

## ✅ Hazır!

- 🌐 https://ibrahimabdullayev.com
- 🌐 https://ibrahimabdullayev.az

**Hər şey Vercel-də - Frontend + Backend!**

---

## 📝 Qeydlər

- Backend `api/index.js`-də (Vercel serverless functions)
- Data `data/` qovluğunda (Vercel-də persist olur)
- Pulsuz plan kifayətdir
- SSL avtomatik

