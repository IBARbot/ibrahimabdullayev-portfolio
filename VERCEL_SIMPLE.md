# 🚀 Vercel Deployment - Qısa Təlimat

## ⚡ 3 Addım

### 1️⃣ GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ibrahimabdullayev-portfolio.git
git push -u origin main
```

### 2️⃣ Vercel
1. [Vercel.com](https://vercel.com) → "Add New Project"
2. GitHub repo seçin
3. **Environment Variables:**
   ```
   JWT_SECRET=your-secret-key
   EMAIL_USER=ibrahim.abdullayev1@gmail.com
   EMAIL_PASS=gmail-app-password
   CONTACT_EMAIL=ibrahim.abdullayev1@gmail.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=secure-password
   ```
4. Deploy!

### 3️⃣ Domain
1. Vercel → Settings → Domains → Add:
   - `ibrahimabdullayev.com`
   - `ibrahimabdullayev.az`
2. DNS records əlavə edin

---

## ✅ Hazır!

**Hər şey Vercel-də - Frontend + Backend!**

---

## 📝 Qeyd

- Backend: `api/index.js` (Vercel serverless functions)
- Data: In-memory (restart-dan sonra sıfırlanır)
- Bookings: Email-də saxlanır
- Content: Default data (admin panel-dən dəyişdirmək mümkündür, amma restart-dan sonra sıfırlanır)

**Production üçün:** Database (MongoDB, PostgreSQL) tövsiyə olunur.


