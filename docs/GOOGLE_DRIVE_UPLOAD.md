# 📸 Google Drive Şəkil Yükləmə Konfiqurasiyası

Google Drive API-dən istifadə edərək şəkilləri yükləmək mümkündür, amma bu metod bir az mürəkkəbdir. Daha sadə alternativlər də mövcuddur.

## ⚠️ Google Drive API Problemləri

Google Drive API-dən istifadə etmək üçün:
- OAuth 2.0 authentication lazımdır
- Service Account və ya OAuth credentials lazımdır
- API keys və secrets idarə etmək lazımdır
- Mürəkkəb konfiqurasiya

## 🎯 Daha Sadə Alternativlər

### Metod 1: GitHub Pages (Ən Sadə - Tövsiyə Olunur)

GitHub repository-də şəkilləri saxlayıb GitHub Pages-dən istifadə edə bilərsiniz.

**Üstünlükləri:**
- ✅ Tamamilə pulsuz
- ✅ Heç bir API key lazım deyil
- ✅ Çox sadə
- ✅ GitHub-da şəkilləri idarə edə bilərsiniz

**Addımlar:**
1. GitHub repository-də `public/images` qovluğu yaradın
2. Şəkilləri upload edin
3. GitHub Pages-dən URL alın: `https://username.github.io/repo/images/filename.jpg`
4. Admin paneldə URL daxil edin

---

### Metod 2: Direct URL Input (Ən Sadə)

Admin paneldə şəkil URL-i birbaşa daxil edə bilərsiniz.

**Üstünlükləri:**
- ✅ Heç bir konfiqurasiya lazım deyil
- ✅ İstənilən şəkil hosting xidmətindən istifadə edə bilərsiniz
- ✅ Tamamilə pulsuz

**Addımlar:**
1. Şəkilinizi istənilən hosting xidmətinə yükləyin (Imgur, Google Photos, Dropbox, və s.)
2. Direct link-i kopyalayın
3. Admin paneldə URL daxil edin

**Hosting xidmətləri:**
- **Imgur**: https://imgur.com/upload (manual upload)
- **Google Photos**: Şəkil yükləyin, "Share" → "Get link"
- **Dropbox**: Şəkil yükləyin, "Share" → "Create link"
- **GitHub**: Repository-də şəkil yükləyin, "Raw" link-i kopyalayın

---

### Metod 3: Vercel Blob Storage (Vercel-də Artıq Var)

Vercel Blob Storage Vercel-də artıq mövcuddur və əlavə konfiqurasiya lazım deyil.

**Üstünlükləri:**
- ✅ Vercel-də artıq mövcuddur
- ✅ Pulsuz (512MB storage)
- ✅ CDN ilə təmin edilir

**Konfiqurasiya:**
1. Vercel Dashboard-da **Storage** bölməsinə gedin
2. **Blob** yaradın
3. Kodda Vercel Blob Storage API istifadə edin

---

### Metod 4: Google Drive (Mürəkkəb)

Google Drive API-dən istifadə etmək mümkündür, amma mürəkkəbdir.

**Problemlər:**
- OAuth 2.0 authentication lazımdır
- Service Account və ya OAuth credentials lazımdır
- API keys və secrets idarə etmək lazımdır

**Əgər istəsəniz, implementasiya edə bilərəm.**

---

## 💡 Tövsiyə

**GitHub Pages** və ya **Direct URL Input** ən yaxşı seçimdir çünki:
1. Çox sadədir
2. Heç bir API key lazım deyil
3. Tamamilə pulsuzdur
4. Konfiqurasiya problemi yoxdur

---

## 🔧 Admin Panel-də URL Input Əlavə Etmək

Admin panel-də şəkil URL-i daxil etmək üçün input field əlavə edə bilərəm. Bu ən sadə həll olacaq.

