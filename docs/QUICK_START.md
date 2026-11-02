# Sürətli Başlanğıc Təlimatı

## 1. Dependencies quraşdırın

```bash
npm install
```

## 2. Backend üçün .env faylı yaradın

`backend` qovluğunda `.env` faylı yaradın və aşağıdakı məlumatları doldurun:

```env
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=your-contact-email@gmail.com
```

**Qeyd:** Email konfiqurasiyası olmadan da sayt işləyəcək, lakin email göndərilməyəcək.

## 3. Serveri işə salın

```bash
npm run dev
```

Bu komanda həm frontend (http://localhost:3000), həm də backend (http://localhost:5000) serverlərini işə salır.

## 4. Browser-də açın

http://localhost:3000

---

**Məlumat:** Ətraflı məlumat üçün `README.md` faylına baxın.


