# 📸 Vercel Blob Storage Konfiqurasiyası

Vercel Blob Storage ən sadə və etibarlı şəkil yükləmə həllidir. Şəkillər Vercel-də saxlanılır və silinməz.

## ✅ Üstünlükləri

- ✅ Vercel-də artıq mövcuddur
- ✅ Pulsuz (512MB storage)
- ✅ CDN ilə təmin edilir
- ✅ Konfiqurasiya problemi yoxdur
- ✅ Şəkillər silinməz

## 🔧 Konfiqurasiya (5 dəqiqə)

### Addım 1: Vercel Dashboard-da Blob Storage Yaradın

1. Vercel Dashboard-a daxil olun: https://vercel.com/dashboard
2. Layihənizi seçin
3. **Storage** bölməsinə gedin
4. **Create Database** → **Blob** seçin
5. **Create** düyməsini basın

### Addım 2: BLOB_READ_WRITE_TOKEN Alın

1. Blob Storage yaradıldıqdan sonra, **Settings** bölməsinə gedin
2. **Environment Variables** bölməsində **BLOB_READ_WRITE_TOKEN** avtomatik yaradılacaq
3. Token-i kopyalayın (əgər lazımdırsa)

### Addım 3: Environment Variable Əlavə Edin

1. Vercel Dashboard-da layihənizi seçin
2. **Settings** → **Environment Variables** bölməsinə gedin
3. Yeni variable əlavə edin:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Blob Storage-dan aldığınız token
   - **Environment**: Production, Preview, Development (hamısını seçin)
4. **Save** düyməsini basın

### Addım 4: Deploy Edin

1. Layihəni yenidən deploy edin
2. Hazır! 🎉

## 🧪 Test

1. Admin paneldə daxil olun
2. Sertifikat bölməsinə gedin
3. Şəkil yükləyin
4. Şəkil Vercel Blob Storage-ə yüklənəcək və URL qaytarılacaq
5. Save edin və saytda görün

## 📝 Qeyd

- **Storage limiti**: Pulsuz plan üçün 512MB
- **Şəkil ölçüsü**: 10MB-dan kiçik olmalıdır
- **Formatlar**: JPG, PNG, WebP, GIF və s.
- **CDN**: Şəkillər dünya üzrə CDN-dən təmin edilir

## 🔄 Fallback Sistemi

Sistem aşağıdakı ardıcıllıqla işləyir:
1. **Vercel Blob Storage** (əgər konfiqurasiya edilibsə) - **Tövsiyə olunur**
2. **Cloudinary/Imgur** (əgər konfiqurasiya edilibsə) - Fallback

## 💡 Tövsiyə

Vercel Blob Storage ən yaxşı seçimdir çünki:
1. Vercel-də artıq mövcuddur
2. Konfiqurasiya problemi yoxdur
3. Şəkillər silinməz
4. CDN ilə təmin edilir

