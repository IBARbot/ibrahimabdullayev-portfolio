# Backend Funksiyaları Analizi

## 📊 Backend API Endpoints

### Public Endpoints

#### 1. Health Check
- **Endpoint:** `GET /api/health`
- **Məqsəd:** Server sağlamlıq yoxlaması
- **Response:**
  ```json
  {
    "status": "ok",
    "message": "Server is running"
  }
  ```

#### 2. Content API
- **Endpoint:** `GET /api/content`
- **Məqsəd:** Sayt məzmununu almaq (Hero, About, Contact)
- **Response:**
  ```json
  {
    "hero": { "title": "...", "subtitle": "...", ... },
    "about": { "title": "...", "content": "..." },
    "contact": { "email": "...", "phone": "...", ... }
  }
  ```

#### 3. Projects API
- **Endpoint:** `GET /api/projects`
- **Məqsəd:** Portfolio layihələri siyahısı
- **Response:** Array of project objects

#### 4. Skills API
- **Endpoint:** `GET /api/skills`
- **Məqsəd:** Bacarıqlar siyahısı
- **Response:** Array of skill objects with category

#### 5. Contact Form
- **Endpoint:** `POST /api/contact`
- **Məqsəd:** Əlaqə forması göndərmə
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "subject": "string (optional)",
    "message": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Mesajınız uğurla göndərildi!"
  }
  ```
- **Email:** Gmail ilə email göndərilir (konfiqurasiya varsa)

#### 6. Booking Request
- **Endpoint:** `POST /api/booking`
- **Məqsəd:** Rezervasiya sorğusu göndərmə
- **Request Body:**
  ```json
  {
    "type": "flight|hotel|transfer|insurance|embassy",
    "name": "string",
    "email": "string",
    "phone": "string",
    // Type-specific fields
    "from": "string (flight)",
    "to": "string (flight)",
    "date": "string (flight)",
    "passengers": "string (flight)",
    // ... other fields based on type
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Sorğunuz uğurla göndərildi!",
    "bookingId": "timestamp"
  }
  ```
- **Storage:** `backend/data/bookings.json`
- **Email:** Admin-ə notification email göndərilir

---

### Admin Endpoints (JWT Authentication Required)

#### 7. Admin Login
- **Endpoint:** `POST /api/admin/login`
- **Məqsəd:** Admin girişi
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "jwt-token"
  }
  ```
- **Token Expiry:** 24 saat

#### 8. Get Bookings (Admin)
- **Endpoint:** `GET /api/admin/bookings`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "bookings": [...]
  }
  ```

#### 9. Update Booking Status (Admin)
- **Endpoint:** `PUT /api/admin/bookings/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "status": "new|processing|completed|cancelled"
  }
  ```

#### 10. Update Content (Admin)
- **Endpoint:** `PUT /api/admin/content`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** Content object (partial update)
- **Storage:** `backend/data/content.json`

#### 11. Upload Image (Admin)
- **Endpoint:** `POST /api/admin/upload-image`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "image": "base64-string",
    "name": "string"
  }
  ```
- **Note:** Production-da cloud storage (S3, Cloudinary) istifadə etmək tövsiyə olunur

---

## 💾 Data Storage

### JSON Files
- **Location:** `backend/data/`
- **Files:**
  - `content.json` - Sayt məzmunu
  - `bookings.json` - Rezervasiya sorğuları

### Data Structure

**content.json:**
```json
{
  "hero": {
    "title": "...",
    "subtitle": "...",
    "description": "...",
    "image": "..."
  },
  "about": {
    "title": "...",
    "content": "..."
  },
  "contact": {
    "email": "...",
    "phone": "...",
    "address": "...",
    "linkedin": "...",
    "instagram": "...",
    "whatsapp": "..."
  }
}
```

**bookings.json:**
```json
[
  {
    "id": "timestamp",
    "type": "flight",
    "name": "...",
    "email": "...",
    "phone": "...",
    "status": "new",
    "createdAt": "ISO-date",
    "updatedAt": "ISO-date (optional)"
  }
]
```

---

## 🔐 Authentication

### JWT Token
- **Algorithm:** HS256
- **Secret:** `JWT_SECRET` environment variable
- **Expiry:** 24 saat
- **Header Format:** `Authorization: Bearer <token>`

### Admin Credentials
- **Username:** `ADMIN_USERNAME` environment variable (default: "admin")
- **Password:** `ADMIN_PASSWORD` environment variable (default: "admin123")
- **⚠️ Production-da dəyişdirilməlidir!**

---

## 📧 Email Configuration

### Gmail Setup
1. Google Account → Security
2. 2-Step Verification aktivləşdirin
3. App Password yaradın
4. `EMAIL_PASS` environment variable-ına əlavə edin

### Email Usage
- Contact form submissions
- Booking request notifications
- Admin email: `CONTACT_EMAIL` environment variable

---

## 🔄 Frontend-Backend Connection

### Development
- Frontend: `http://localhost:3000` (Vite)
- Backend: `http://localhost:5000` (Express)
- Proxy: Vite config `/api` → `http://localhost:5000/api`

### Production
- Frontend: Build edilmiş static files (`dist/`)
- Backend: Express server (static files + API)
- Same domain: `https://ibrahimabdullayev.com`

### API Calls Pattern
```javascript
// Frontend-də
fetch('/api/endpoint')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## ✅ Test Checklist

### Backend Health
- [ ] `GET /api/health` returns 200
- [ ] Server logs show no errors

### Public APIs
- [ ] `GET /api/content` returns valid data
- [ ] `GET /api/projects` returns array
- [ ] `GET /api/skills` returns array
- [ ] `POST /api/contact` sends email
- [ ] `POST /api/booking` saves to bookings.json

### Admin APIs
- [ ] `POST /api/admin/login` returns token
- [ ] `GET /api/admin/bookings` requires auth
- [ ] `PUT /api/admin/content` updates content.json
- [ ] `PUT /api/admin/bookings/:id` updates status

### Data Persistence
- [ ] `content.json` exists and is readable
- [ ] `bookings.json` exists and is writable
- [ ] Bookings are saved correctly
- [ ] Content updates persist

### Email
- [ ] Email credentials configured
- [ ] Contact form emails sent
- [ ] Booking notification emails sent

---

## 🚨 Common Issues

### Issue: Email not sending
**Solution:**
- Gmail App Password istifadə edin (regular password deyil)
- 2-Step Verification aktiv olmalıdır
- `EMAIL_USER` və `EMAIL_PASS` düzgün set edilməlidir

### Issue: JWT token invalid
**Solution:**
- Token expiry yoxlayın (24 saat)
- `JWT_SECRET` environment variable düzgün set edilməlidir
- Header format: `Authorization: Bearer <token>`

### Issue: Data not persisting
**Solution:**
- `backend/data/` directory permissions yoxlayın
- File system write permissions yoxlayın
- JSON file format düzgün olmalıdır

### Issue: CORS errors
**Solution:**
- Backend-də CORS middleware aktivdir
- Production-da domain whitelist əlavə edin (lazım olsa)

---

## 📝 Notes

1. **Security:**
   - Production-da admin credentials dəyişdirin
   - JWT_SECRET güclü olmalıdır (minimum 32 characters)
   - Environment variables `.env` faylında saxlayın

2. **Scalability:**
   - JSON files kiçik məlumat üçün yaxşıdır
   - Böyük məlumat üçün database (MongoDB, PostgreSQL) tövsiyə olunur

3. **Backup:**
   - `backend/data/` qovluğunu müntəzəm backup edin
   - Automated backup script yaradın

4. **Monitoring:**
   - Server logs monitor edin
   - Error tracking (Sentry) əlavə edin
   - Uptime monitoring (UptimeRobot)

---

**Son yeniləmə:** 2024
**Versiya:** 1.0.0


