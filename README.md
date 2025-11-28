# İbrahim Abdullayev - Portfolio Website

Modern və responsive portfolio saytı. React, TypeScript, Tailwind CSS və Node.js/Express texnologiyaları ilə yaradılıb.

## 🚀 Xüsusiyyətlər

- ✨ Modern və responsive dizayn
- 🎨 Tailwind CSS ilə gözəl UI
- ⚡ React + TypeScript ilə sürətli performans
- 📧 Əlaqə formu ilə email göndərmə
- 🎭 Framer Motion ilə animasiyalar
- 📱 Mobil cihazlar üçün optimallaşdırılmış
- 🌐 Backend API ilə dinamik məlumatlar
- 🔐 Admin Panel - sayt məzmununu idarə etmək üçün
- 🎫 Booking Form - aviabilet, otel, transfer, sığorta, səfirlik sorğuları

## 📋 Tələblər

- Node.js (v18 və ya daha yeni)
- npm və ya yarn

## 🔧 Quraşdırma

### 1. Dependencies quraşdırın

```bash
npm install
```

### 2. Backend üçün environment dəyişənlərini təyin edin

`backend` qovluğunda `.env` faylı yaradın:

```env
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=ibrahim.abdullayev1@gmail.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-secret-key-change-in-production
```

**Qeyd:** Gmail istifadə edirsinizsə, "App Password" yaratmalısınız:
1. Google Account Settings → Security
2. 2-Step Verification aktiv edin
3. App Passwords bölməsindən yeni password yaradın

### 3. Development serveri işə salın

```bash
npm run dev
```

Bu komanda həm frontend (port 3000), həm də backend (port 5000) serverlərini işə salır.

Yalnız frontend:
```bash
npm run dev:frontend
```

Yalnız backend:
```bash
npm run dev:backend
```

### 4. Browser-də açın

Frontend: http://localhost:3000
Backend API: http://localhost:5000
Admin Panel: http://localhost:3000/admin

## 📁 Layihə Strukturu

```
ibrahim-abdullayev-com/
├── backend/
│   ├── server.js          # Express backend server
│   ├── data/              # JSON data files (auto-created)
│   │   ├── content.json   # Site content
│   │   └── bookings.json  # Booking requests
│   └── .env               # Environment variables
├── src/
│   ├── components/         # React komponentləri
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── BookingForm.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   └── AdminPanel.tsx
│   ├── App.tsx            # Əsas App komponenti
│   ├── main.tsx           # Entry point
│   └── index.css          # Global stillər
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Komponentlər

- **Navigation**: Scroll edilən navigation bar
- **Hero**: Ana səhifə hero bölməsi
- **About**: Haqqımda məlumatları
- **Skills**: Texniki bacarıqlar
- **Projects**: Portfolio layihələri
- **BookingForm**: Rezervasiya sorğuları (aviabilet, otel, transfer, sığorta, səfirlik)
- **Contact**: Əlaqə formu
- **Footer**: Footer məlumatları
- **AdminPanel**: Sayt məzmununu idarə etmək üçün admin panel

## 🔌 API Endpoints

### Public Endpoints

#### GET `/api/health`
Server statusunu yoxlayır.

#### GET `/api/projects`
Layihələrin siyahısını qaytarır.

#### GET `/api/skills`
Bacarıqların siyahısını qaytarır.

#### GET `/api/content`
Sayt məzmununu qaytarır (hero, about, contact).

#### POST `/api/contact`
Əlaqə formu məlumatlarını qəbul edir və email göndərir.

**Request Body:**
```json
{
  "name": "Ad Soyad",
  "email": "email@example.com",
  "subject": "Mövzu",
  "message": "Mesaj mətni"
}
```

#### POST `/api/booking`
Rezervasiya sorğusu göndərir (aviabilet, otel, transfer, sığorta, səfirlik).

**Request Body (Flight):**
```json
{
  "type": "flight",
  "name": "Ad Soyad",
  "email": "email@example.com",
  "phone": "+994 50 123 45 67",
  "from": "Bakı",
  "to": "İstanbul",
  "date": "2024-12-25",
  "passengers": "2",
  "notes": "Əlavə məlumat"
}
```

**Request Body (Hotel):**
```json
{
  "type": "hotel",
  "name": "Ad Soyad",
  "email": "email@example.com",
  "phone": "+994 50 123 45 67",
  "destination": "İstanbul",
  "checkIn": "2024-12-25",
  "checkOut": "2024-12-30",
  "rooms": "1",
  "guests": "2"
}
```

**Request Body (Transfer):**
```json
{
  "type": "transfer",
  "name": "Ad Soyad",
  "email": "email@example.com",
  "phone": "+994 50 123 45 67",
  "from": "Hava limanı",
  "to": "Otel",
  "date": "2024-12-25",
  "time": "10:00",
  "passengers": "2"
}
```

**Request Body (Insurance):**
```json
{
  "type": "insurance",
  "name": "Ad Soyad",
  "email": "email@example.com",
  "phone": "+994 50 123 45 67",
  "insuranceType": "travel",
  "package": "premium",
  "startDate": "2024-12-25",
  "endDate": "2025-01-25"
}
```

**Request Body (Embassy):**
```json
{
  "type": "embassy",
  "name": "Ad Soyad",
  "email": "email@example.com",
  "phone": "+994 50 123 45 67",
  "embassyCountry": "Türkiyə",
  "visaType": "tourist",
  "urgent": true
}
```

### Admin Endpoints (Requires Authentication)

#### POST `/api/admin/login`
Admin girişi.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here"
}
```

#### GET `/api/admin/bookings`
Bütün rezervasiya sorğularını qaytarır (admin only).

#### PUT `/api/admin/bookings/:id`
Rezervasiya statusunu yeniləyir (admin only).

**Request Body:**
```json
{
  "status": "contacted"
}
```

#### PUT `/api/admin/content`
Sayt məzmununu yeniləyir (admin only).

**Request Body:**
```json
{
  "hero": {
    "title": "Yeni başlıq",
    "subtitle": "Yeni alt başlıq",
    "description": "Yeni təsvir",
    "image": "base64-image-or-url"
  },
  "about": {
    "title": "Yeni başlıq",
    "content": "Yeni məzmun"
  },
  "contact": {
    "email": "new@email.com",
    "phone": "+994 50 123 45 67",
    "address": "Yeni ünvan"
  }
}
```

## 🔐 Admin Panel

Admin panelə daxil olmaq üçün:
1. Browser-də `/admin` səhifəsinə gedin
2. Default credentials:
   - Username: `admin`
   - Password: `admin123`

**Qeyd:** Production-da `.env` faylında `ADMIN_USERNAME` və `ADMIN_PASSWORD` dəyişənlərini dəyişdirməyi unutmayın!

Admin paneldə edə biləcəkləriniz:
- Hero bölməsinin məzmununu dəyişdirmək
- Haqqımda bölməsinin məzmununu dəyişdirmək
- Əlaqə məlumatlarını yeniləmək
- Şəkilləri yükləmək (base64 formatında)

## 🛠️ Build

Production build üçün:

```bash
npm run build
```

Build edilmiş fayllar `dist` qovluğunda olacaq.

## 📝 Fərdiləşdirmə

### Məlumatları dəyişdirmək

1. **Şəxsi məlumatlar**: Admin panel vasitəsilə və ya `backend/data/content.json` faylında
2. **Layihələr**: `backend/server.js` faylında `/api/projects` endpoint-də
3. **Bacarıqlar**: `backend/server.js` faylında `/api/skills` endpoint-də
4. **Admin credentials**: `backend/.env` faylında `ADMIN_USERNAME` və `ADMIN_PASSWORD`

### Rəng sxemi

`tailwind.config.js` faylında `primary` rəngini dəyişdirə bilərsiniz.

## 🚀 Deploy

### Frontend (Vercel, Netlify)

```bash
npm run build
```

Build edilmiş `dist` qovluğunu deploy edin.

### Backend (Heroku, Railway, Render)

Backend serveri ayrıca deploy etməlisiniz. `.env` faylındakı dəyişənləri platformanın environment settings-ə əlavə edin.

**Qeyd:** `backend/data` qovluğu serverdə yaradılacaq. Production-da database (MongoDB, PostgreSQL) istifadə etməyi tövsiyə edirik.

## 📄 Lisenziya

Bu layihə şəxsi istifadə üçündür.

## 👤 Müəllif

İbrahim Abdullayev
- Email: ibrahim.abdullayev1@gmail.com
- Telefon: +994 55 597 39 23
- Ünvan: Baku, Rashid Behbudov str, Azerbaijan

---

**Qeyd:** Email konfiqurasiyası olmadan da sayt işləyəcək, lakin əlaqə formu və booking sorğuları email göndərə bilməyəcək. Bu halda məlumatlar `backend/data/bookings.json` faylında saxlanılacaq.
