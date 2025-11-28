# Deployment Guide - ibrahimabdullayev.com və ibrahimabdullayev.az

## 📋 Məzmun
1. [Backend Analizi](#backend-analizi)
2. [Frontend-Backend Əlaqələndirməsi](#frontend-backend-əlaqələndirməsi)
3. [Deployment Addımları](#deployment-addımları)
4. [Domain Konfiqurasiyası](#domain-konfiqurasiyası)
5. [Environment Variables](#environment-variables)
6. [Test və Yoxlama](#test-və-yoxlama)

---

## 🔍 Backend Analizi

### Backend Funksiyaları

#### 1. **API Endpoints**

**Public Endpoints:**
- `GET /api/health` - Server sağlamlıq yoxlaması
- `GET /api/content` - Sayt məzmunu (Hero, About, Contact)
- `GET /api/projects` - Portfolio layihələri
- `GET /api/skills` - Bacarıqlar siyahısı
- `POST /api/contact` - Əlaqə forması göndərmə
- `POST /api/booking` - Rezervasiya sorğusu göndərmə

**Admin Endpoints (JWT Auth tələb olunur):**
- `POST /api/admin/login` - Admin girişi
- `GET /api/admin/bookings` - Bütün rezervasiya sorğuları
- `PUT /api/admin/bookings/:id` - Rezervasiya statusu yeniləmə
- `PUT /api/admin/content` - Sayt məzmunu yeniləmə
- `POST /api/admin/upload-image` - Şəkil yükləmə

#### 2. **Data Storage**
- **Format:** JSON fayllar
- **Yer:** `backend/data/`
- **Fayllar:**
  - `content.json` - Sayt məzmunu
  - `bookings.json` - Rezervasiya sorğuları

#### 3. **Email Konfiqurasiyası**
- **Service:** Gmail (Nodemailer)
- **Tələb olunan:** EMAIL_USER, EMAIL_PASS environment variables
- **İstifadə:** Contact form və booking notifications

#### 4. **Authentication**
- **Metod:** JWT (JSON Web Tokens)
- **Secret:** JWT_SECRET environment variable
- **Expiry:** 24 saat

#### 5. **Server Port**
- **Default:** 5000
- **Konfiqurasiya:** PORT environment variable

---

## 🔗 Frontend-Backend Əlaqələndirməsi

### Development Mode
- **Frontend:** `http://localhost:3000` (Vite)
- **Backend:** `http://localhost:5000` (Express)
- **Proxy:** Vite config-də `/api` requests backend-ə proxy edilir

### Production Mode
- **Frontend:** Build edilmiş static fayllar
- **Backend:** Express server (həm API, həm də static faylları serve edir)

### API Calls
Frontend-də bütün API çağırışları:
- Development: `fetch('/api/...')` → Vite proxy → `http://localhost:5000/api/...`
- Production: `fetch('/api/...')` → Eyni domain → `https://ibrahimabdullayev.com/api/...`

---

## 🚀 Deployment Addımları

### Seçim 1: Vercel (Frontend) + Railway/Render (Backend) - **Tövsiyə olunur**

#### A. Frontend Deployment (Vercel)

1. **GitHub Repository yaradın:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/ibrahimabdullayev-portfolio.git
   git push -u origin main
   ```

2. **Vercel-də deploy:**
   - [Vercel.com](https://vercel.com) hesabı yaradın
   - "New Project" klikləyin
   - GitHub repository-ni seçin
   - **Build Settings:**
     - Framework Preset: `Vite`
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
   - **Environment Variables:**
     - `VITE_API_URL` = `https://your-backend-url.com` (backend URL-i)

3. **Vercel Build Configuration:**
   `vercel.json` faylı yaradın:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://your-backend-url.com/api/$1"
       }
     ]
   }
   ```

#### B. Backend Deployment (Railway)

1. **Railway hesabı:**
   - [Railway.app](https://railway.app) hesabı yaradın
   - "New Project" → "Deploy from GitHub repo"

2. **Environment Variables (Railway Dashboard):**
   ```
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=your-very-secure-secret-key-here
   EMAIL_USER=ibrahim.abdullayev1@gmail.com
   EMAIL_PASS=your-gmail-app-password
   CONTACT_EMAIL=ibrahim.abdullayev1@gmail.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-admin-password
   ```

3. **Railway Build Settings:**
   - Start Command: `node backend/server.js`
   - Root Directory: `/`

4. **Custom Domain (Railway):**
   - Settings → Domains → Add Custom Domain
   - `api.ibrahimabdullayev.com` və ya `api.ibrahimabdullayev.az`

---

### Seçim 2: Full Stack Deployment (VPS/Cloud Server)

#### A. Server Tələbləri
- **OS:** Ubuntu 20.04+ (tövsiyə olunur)
- **RAM:** Minimum 1GB (2GB tövsiyə olunur)
- **CPU:** 1 core (2+ cores tövsiyə olunur)
- **Storage:** 10GB+

#### B. Server Hazırlığı

1. **SSH ilə server-ə qoşulun:**
   ```bash
   ssh root@your-server-ip
   ```

2. **System Updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Node.js və npm quraşdırın:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   node --version  # v20.x.x olmalıdır
   npm --version
   ```

4. **PM2 quraşdırın (Process Manager):**
   ```bash
   sudo npm install -g pm2
   ```

5. **Nginx quraşdırın:**
   ```bash
   sudo apt install -y nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

6. **Git quraşdırın:**
   ```bash
   sudo apt install -y git
   ```

#### C. Application Deployment

1. **Project klonlayın:**
   ```bash
   cd /var/www
   sudo git clone https://github.com/yourusername/ibrahimabdullayev-portfolio.git
   sudo chown -R $USER:$USER ibrahimabdullayev-portfolio
   cd ibrahimabdullayev-portfolio
   ```

2. **Dependencies quraşdırın:**
   ```bash
   npm install
   ```

3. **Environment Variables yaradın:**
   ```bash
   nano .env
   ```
   
   `.env` faylına əlavə edin:
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-very-secure-secret-key-minimum-32-characters
   EMAIL_USER=ibrahim.abdullayev1@gmail.com
   EMAIL_PASS=your-gmail-app-password
   CONTACT_EMAIL=ibrahim.abdullayev1@gmail.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-admin-password-change-this
   ```

4. **Frontend Build:**
   ```bash
   npm run build
   ```

5. **Backend data directory yaradın:**
   ```bash
   mkdir -p backend/data
   ```

6. **PM2 ilə backend-i başlatın:**
   ```bash
   pm2 start backend/server.js --name ibrahim-backend
   pm2 save
   pm2 startup  # System restart-dan sonra avtomatik başlamaq üçün
   ```

#### D. Nginx Konfiqurasiyası

1. **Nginx config yaradın:**
   ```bash
   sudo nano /etc/nginx/sites-available/ibrahimabdullayev
   ```

2. **Config məzmunu:**
   ```nginx
   # HTTP - HTTPS-ə yönləndir
   server {
       listen 80;
       server_name ibrahimabdullayev.com www.ibrahimabdullayev.com ibrahimabdullayev.az www.ibrahimabdullayev.az;
       
       return 301 https://$server_name$request_uri;
   }

   # HTTPS - Main domain
   server {
       listen 443 ssl http2;
       server_name ibrahimabdullayev.com www.ibrahimabdullayev.com;

       ssl_certificate /etc/letsencrypt/live/ibrahimabdullayev.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/ibrahimabdullayev.com/privkey.pem;

       # SSL Security
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers on;

       # Gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

       # Static files (Frontend)
       root /var/www/ibrahimabdullayev-portfolio/dist;
       index index.html;

       # API requests - Backend-ə yönləndir
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }

       # Static assets
       location /assets {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # SPA routing - bütün requests index.html-ə yönləndir
       location / {
           try_files $uri $uri/ /index.html;
       }
   }

   # HTTPS - .az domain
   server {
       listen 443 ssl http2;
       server_name ibrahimabdullayev.az www.ibrahimabdullayev.az;

       ssl_certificate /etc/letsencrypt/live/ibrahimabdullayev.az/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/ibrahimabdullayev.az/privkey.pem;

       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers on;

       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

       root /var/www/ibrahimabdullayev-portfolio/dist;
       index index.html;

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }

       location /assets {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Config aktivləşdirin:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/ibrahimabdullayev /etc/nginx/sites-enabled/
   sudo nginx -t  # Syntax yoxlaması
   sudo systemctl reload nginx
   ```

#### E. SSL Sertifikatı (Let's Encrypt)

1. **Certbot quraşdırın:**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **SSL sertifikatı alın (.com domain):**
   ```bash
   sudo certbot --nginx -d ibrahimabdullayev.com -d www.ibrahimabdullayev.com
   ```

3. **SSL sertifikatı alın (.az domain):**
   ```bash
   sudo certbot --nginx -d ibrahimabdullayev.az -d www.ibrahimabdullayev.az
   ```

4. **Auto-renewal yoxlayın:**
   ```bash
   sudo certbot renew --dry-run
   ```

---

## 🌐 Domain Konfiqurasiyası

### DNS Records (Domain Registrar-də)

#### ibrahimabdullayev.com üçün:

**A Record:**
```
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 3600
```

**A Record (www):**
```
Type: A
Name: www
Value: YOUR_SERVER_IP
TTL: 3600
```

#### ibrahimabdullayev.az üçün:

**A Record:**
```
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 3600
```

**A Record (www):**
```
Type: A
Name: www
Value: YOUR_SERVER_IP
TTL: 3600
```

### DNS Propagation
- DNS dəyişiklikləri 24-48 saat ərzində yayılır
- Yoxlamaq üçün: [whatsmydns.net](https://www.whatsmydns.net)

---

## 🔐 Environment Variables

### Backend .env Faylı

```env
# Server
NODE_ENV=production
PORT=5000

# JWT Authentication
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters-long

# Email Configuration (Gmail)
EMAIL_USER=ibrahim.abdullayev1@gmail.com
EMAIL_PASS=your-gmail-app-password
CONTACT_EMAIL=ibrahim.abdullayev1@gmail.com

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password-change-this-immediately
```

### Gmail App Password Almaq

1. Google Account → Security
2. 2-Step Verification aktivləşdirin
3. App Passwords → Generate
4. "Mail" və "Other (Custom name)" seçin
5. Generated password-u `EMAIL_PASS` kimi istifadə edin

---

## ✅ Test və Yoxlama

### 1. Backend Health Check
```bash
curl https://ibrahimabdullayev.com/api/health
# Expected: {"status":"ok","message":"Server is running"}
```

### 2. Frontend Test
- Browser-də açın: `https://ibrahimabdullayev.com`
- Bütün səhifələrin yükləndiyini yoxlayın

### 3. API Test
```bash
# Content API
curl https://ibrahimabdullayev.com/api/content

# Projects API
curl https://ibrahimabdullayev.com/api/projects

# Skills API
curl https://ibrahimabdullayev.com/api/skills
```

### 4. Contact Form Test
- Contact formunu doldurun və göndərin
- Email-in gəldiyini yoxlayın

### 5. Booking Form Test
- Booking formunu doldurun və göndərin
- Admin panel-də göründüyünü yoxlayın

### 6. Admin Panel Test
- `/admin` səhifəsinə gedin
- Login olun
- Content və bookings-i yoxlayın

---

## 🔄 Update Prosesi

### Code Update

1. **Git pull:**
   ```bash
   cd /var/www/ibrahimabdullayev-portfolio
   git pull origin main
   ```

2. **Dependencies yenilə:**
   ```bash
   npm install
   ```

3. **Frontend rebuild:**
   ```bash
   npm run build
   ```

4. **Backend restart:**
   ```bash
   pm2 restart ibrahim-backend
   ```

---

## 📊 Monitoring

### PM2 Monitoring
```bash
pm2 status
pm2 logs ibrahim-backend
pm2 monit
```

### Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Application Logs
```bash
pm2 logs ibrahim-backend --lines 100
```

---

## 🆘 Troubleshooting

### Problem: Backend işləmir
```bash
pm2 status
pm2 logs ibrahim-backend
pm2 restart ibrahim-backend
```

### Problem: Nginx error
```bash
sudo nginx -t
sudo systemctl status nginx
sudo systemctl restart nginx
```

### Problem: SSL certificate
```bash
sudo certbot certificates
sudo certbot renew
```

### Problem: Port already in use
```bash
sudo lsof -i :5000
sudo kill -9 PID
```

---

## 📝 Qeydlər

1. **Security:**
   - Admin şifrəsini dəyişdirin
   - JWT_SECRET-ı güclü edin
   - Firewall konfiqurasiyası edin (UFW)

2. **Backup:**
   - `backend/data/` qovluğunu müntəzəm backup edin
   - Database migration planı hazırlayın

3. **Performance:**
   - CDN istifadə edin (Cloudflare)
   - Image optimization
   - Caching strategies

4. **Monitoring:**
   - Uptime monitoring (UptimeRobot, Pingdom)
   - Error tracking (Sentry)

---

## 📞 Dəstək

Əgər problem yaşayırsınızsa:
- GitHub Issues: [Repository Issues]
- Email: ibrahim.abdullayev1@gmail.com

---

**Son yeniləmə:** 2024
**Versiya:** 1.0.0

