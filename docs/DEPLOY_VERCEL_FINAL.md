# 🚀 Vercel Deployment - Qısa

## 3 Addım

### 1. GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ibrahimabdullayev-portfolio.git
git push -u origin main
```

### 2. Vercel
1. [vercel.com](https://vercel.com) → "Add New Project"
2. GitHub repo seçin
3. **Environment Variables əlavə edin:**
   - `JWT_SECRET` = random-32-chars
   - `EMAIL_USER` = ibrahim.abdullayev1@gmail.com
   - `EMAIL_PASS` = gmail-app-password
   - `CONTACT_EMAIL` = ibrahim.abdullayev1@gmail.com
   - `ADMIN_USERNAME` = admin
   - `ADMIN_PASSWORD` = secure-password
4. Deploy!

### 3. Domain
1. Vercel → Settings → Domains → Add:
   - `ibrahimabdullayev.com`
   - `ibrahimabdullayev.az`
2. DNS records əlavə edin

---

## ✅ Hazır!

**Frontend + Backend = Vercel-də!**

---

## 📝 Qeyd

- Backend: `api/[...path].js` (Vercel serverless functions)
- Data: In-memory (hər request-də sıfırlanır - normaldır)
- Bookings: Email-də saxlanır (əsas storage)
- Content: Default data (admin panel-dən dəyişdirmək mümkündür, amma restart-dan sonra sıfırlanır)

**Production üçün:** Database (MongoDB, PostgreSQL) tövsiyə olunur, amma email notification kifayətdir.


