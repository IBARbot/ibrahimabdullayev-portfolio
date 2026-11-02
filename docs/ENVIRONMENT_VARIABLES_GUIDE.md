# 🔐 Environment Variables - Detallı İzah

## 📋 Ümumi Məlumat

Bu dəyişənlər Vercel-də **Settings → Environment Variables** bölməsində əlavə edilir. Onlar saytın backend funksiyaları üçün lazımdır.

---

## 1️⃣ JWT_SECRET

### Nədir?
**JSON Web Token Secret Key** - Admin panelə giriş üçün token şifrələmə açarı.

### Nə üçün lazımdır?
- Admin panelə giriş zamanı token yaradır
- Token-ləri yoxlayır və təhlükəsizlik təmin edir

### Necə yaradılır?
**Seçim 1: Random generator istifadə edin**
- [randomkeygen.com](https://randomkeygen.com) → "CodeIgniter Encryption Keys" → 32 simvol seçin
- Və ya PowerShell-də:
  ```powershell
  -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
  ```

**Seçim 2: Özünüz yaradın**
- 32 simvol uzunluğunda random string
- Məsələn: `MySecretKey2024!@#$%^&*()_+ABCDEF`

### Nümunə:
```
JWT_SECRET=aB3$kL9mN2pQ7rS5tU8vW1xY4zA6cD0eF
```

⚠️ **Vacib:** Bu açarı heç kimlə paylaşmayın və GitHub-a yükləməyin!

---

## 2️⃣ EMAIL_USER

### Nədir?
Gmail email ünvanınız - email göndərmək üçün istifadə olunur.

### Nə üçün lazımdır?
- Müştərilərdən gələn mesajları qəbul edir
- Booking sorğularını email-də alır
- Contact form mesajlarını göndərir

### Dəyər:
```
EMAIL_USER=ibrahim.abdullayev1@gmail.com
```

✅ **Hazırdır** - öz email ünvanınızı yazın.

---

## 3️⃣ EMAIL_PASS

### Nədir?
Gmail **App Password** (Tətbiq Şifrəsi) - adi şifrə deyil!

### Nə üçün lazımdır?
- Gmail-dən email göndərmək üçün
- Adi şifrə işləmir, App Password lazımdır

### Necə əldə edilir?

**Addım-addım:**

1. **Google Account-a daxil olun:**
   - [myaccount.google.com](https://myaccount.google.com)

2. **Security (Təhlükəsizlik) bölməsinə keçin:**
   - Sol menyuda "Security" klikləyin

3. **2-Step Verification (2 addımlı doğrulama) aktiv edin:**
   - Əgər aktiv deyilsə, aktiv edin
   - Telefon nömrənizi təsdiq edin

4. **App Passwords (Tətbiq Şifrələri) yaradın:**
   - "2-Step Verification" altında "App passwords" klikləyin
   - Və ya birbaşa: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

5. **Yeni App Password yaradın:**
   - "Select app" → "Mail" seçin
   - "Select device" → "Other (Custom name)" seçin
   - Ad: "Vercel Portfolio" yazın
   - "Generate" klikləyin

6. **16 simvollu şifrəni kopyalayın:**
   - Məsələn: `abcd efgh ijkl mnop`
   - Boşluqları silin: `abcdefghijklmnop`

### Nümunə:
```
EMAIL_PASS=abcdefghijklmnop
```

⚠️ **Vacib:** 
- Bu şifrəni heç kimlə paylaşmayın
- GitHub-a yükləməyin
- Yalnız Vercel Environment Variables-də saxlayın

---

## 4️⃣ CONTACT_EMAIL

### Nədir?
Mesajların və booking sorğularının göndəriləcəyi email ünvanı.

### Nə üçün lazımdır?
- Contact form-dan gələn mesajlar bura göndərilir
- Booking sorğuları bura göndərilir
- Admin kimi bütün sorğuları bura alırsınız

### Dəyər:
```
CONTACT_EMAIL=ibrahim.abdullayev1@gmail.com
```

✅ **Hazırdır** - adətən `EMAIL_USER` ilə eynidir.

---

## 5️⃣ ADMIN_USERNAME

### Nədir?
Admin panelə giriş üçün istifadəçi adı.

### Nə üçün lazımdır?
- Admin panelə daxil olmaq üçün
- Saytın məzmununu dəyişdirmək üçün
- Booking sorğularını görmək üçün

### Dəyər:
```
ADMIN_USERNAME=admin
```

✅ **Hazırdır** - istədiyiniz adı yaza bilərsiniz (məsələn: `ibrahim`, `admin123`)

---

## 6️⃣ ADMIN_PASSWORD

### Nədir?
Admin panelə giriş üçün şifrə.

### Nə üçün lazımdır?
- Admin panelə giriş üçün
- Təhlükəsizlik üçün

### Dəyər:
```
ADMIN_PASSWORD=secure-password
```

⚠️ **Vacib:** Güclü şifrə seçin!
- Minimum 8 simvol
- Böyük və kiçik hərflər
- Rəqəmlər və simvollar
- Məsələn: `MyAdmin2024!@#`

---

## 📝 Vercel-də Əlavə Etmə

### Addım-addım:

1. **Vercel Dashboard-a daxil olun:**
   - [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Project seçin:**
   - `ibrahimabdullayev-portfolio` proyektinə klikləyin

3. **Settings → Environment Variables:**
   - Sol menyuda "Settings" klikləyin
   - "Environment Variables" bölməsinə keçin

4. **Hər bir dəyişəni əlavə edin:**
   - "Add New" klikləyin
   - **Key:** `JWT_SECRET`
   - **Value:** `aB3$kL9mN2pQ7rS5tU8vW1xY4zA6cD0eF` (sizin yaratdığınız)
   - **Environment:** Production, Preview, Development (hamısını seçin)
   - "Save" klikləyin

5. **Hamısını təkrarlayın:**
   - `EMAIL_USER`
   - `EMAIL_PASS` (Gmail App Password)
   - `CONTACT_EMAIL`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`

6. **Redeploy edin:**
   - "Deployments" bölməsinə keçin
   - Son deployment-ın yanında "..." → "Redeploy" klikləyin

---

## ✅ Yoxlama

Deployment-dan sonra:
1. Saytınızı açın: `https://your-site.vercel.app`
2. Contact form-u test edin
3. Booking form-u test edin
4. Admin panelə daxil olun: `/admin`

---

## 🔒 Təhlükəsizlik Qeydləri

1. ✅ **Heç vaxt** bu dəyişənləri GitHub-a yükləməyin
2. ✅ `.env` faylı `.gitignore`-da olmalıdır (artıq var)
3. ✅ `JWT_SECRET` və `ADMIN_PASSWORD` güclü olmalıdır
4. ✅ `EMAIL_PASS` yalnız Gmail App Password olmalıdır
5. ✅ Dəyişənləri dəyişdikdən sonra redeploy edin

---

## ❓ Problemlər

### Email göndərilmir?
- ✅ Gmail App Password düzgündürmü yoxlayın
- ✅ 2-Step Verification aktivdirmi yoxlayın
- ✅ `EMAIL_USER` və `EMAIL_PASS` düzgündürmü yoxlayın

### Admin panelə giriş olmur?
- ✅ `ADMIN_USERNAME` və `ADMIN_PASSWORD` düzgündürmü yoxlayın
- ✅ `JWT_SECRET` düzgündürmü yoxlayın
- ✅ Redeploy edin

### Environment Variables görünmür?
- ✅ Production, Preview, Development hamısını seçdiyinizə əmin olun
- ✅ Redeploy edin

---

## 📞 Kömək

Əgər problem varsa:
1. Vercel Logs-u yoxlayın: Deployments → Son deployment → "Logs"
2. Browser Console-u yoxlayın (F12)
3. Network tab-da API request-ləri yoxlayın


