# ☁️ Cloudinary Şəkil Yükləmə Konfiqurasiyası

Sertifikat şəkillərinin və digər şəkillərin saytda saxlanması üçün Cloudinary istifadə olunur. Cloudinary Imgur-dan daha etibarlı və peşəkardır.

## 🔑 Cloudinary Hesabı və API Key Almaq

### Addım 1: Cloudinary Hesabı Yaradın
1. [Cloudinary.com](https://cloudinary.com) saytına daxil olun
2. "Sign Up for Free" düyməsini basın
3. Email ilə qeydiyyatdan keçin və email-ı təsdiq edin
4. Pulsuz plan kifayətdir (25GB storage, 25GB bandwidth/ay)

### Addım 2: Dashboard-dan API Məlumatlarını Alın
1. Cloudinary Dashboard-a daxil olun: https://console.cloudinary.com/
2. Yuxarı sağ küncdə **"Settings"** (⚙️) düyməsini basın
3. **"Upload"** tab-ına keçin
4. **"Upload presets"** bölməsində:
   - **"Add upload preset"** düyməsini basın
   - **Preset name**: `ml_default` (və ya istədiyiniz ad)
   - **Signing mode**: `Unsigned` seçin (vacib!)
   - **Folder**: `ibrahimabdullayev` (optional - şəkilləri təşkil etmək üçün)
   - **Save** düyməsini basın

### Addım 3: Cloud Name və Upload Preset-i Kopyalayın
1. Dashboard-da yuxarıda **Cloud Name** görünür (məsələn: `dxyz123`)
2. **Cloud Name**-i kopyalayın
3. **Upload Preset** adını yadda saxlayın (məsələn: `ml_default`)

## ⚙️ Vercel Environment Variables

Vercel-də deploy etdikdən sonra:

1. Vercel Dashboard-a daxil olun
2. Layihənizi seçin
3. **Settings** → **Environment Variables** bölməsinə gedin
4. Yeni variable-lar əlavə edin:

   **Variable 1:**
   - **Name**: `CLOUDINARY_CLOUD_NAME`
   - **Value**: Cloudinary Dashboard-dan aldığınız Cloud Name (məsələn: `dxyz123`)
   - **Environment**: Production, Preview, Development (hamısını seçin)

   **Variable 2:**
   - **Name**: `CLOUDINARY_UPLOAD_PRESET`
   - **Value**: Upload Preset adı (məsələn: `ml_default`)
   - **Environment**: Production, Preview, Development (hamısını seçin)

5. **Save** düyməsini basın
6. Layihəni yenidən deploy edin

## 🧪 Test

1. Admin paneldə daxil olun
2. Sertifikat bölməsinə gedin
3. Şəkil yükləyin
4. Şəkil Cloudinary-ə yüklənəcək və URL qaytarılacaq
5. Save edin və saytda görün

## 📝 Qeyd

- **Cloudinary pulsuz plan**: 25GB storage, 25GB bandwidth/ay
- **Şəkil ölçüsü**: 10MB-dan kiçik olmalıdır
- **Formatlar**: JPG, PNG, WebP, GIF və s.
- **Automatic optimization**: Cloudinary avtomatik olaraq şəkilləri optimize edir

## 🔄 Fallback Sistemi

Sistem aşağıdakı ardıcıllıqla işləyir:
1. **Cloudinary** (əgər konfiqurasiya edilibsə) - **Tövsiyə olunur**
2. **Imgur** (əgər konfiqurasiya edilibsə) - Fallback
3. **Base64** (heç biri yoxdursa) - Son fallback

## 🆚 Cloudinary vs Imgur

| Xüsusiyyət | Cloudinary | Imgur |
|------------|------------|-------|
| **Etibarlılıq** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **API Asanlığı** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Pulsuz Plan** | 25GB storage | 1250 upload/gün |
| **Image Optimization** | ✅ Avtomatik | ❌ Yox |
| **CDN** | ✅ Dünya üzrə | ✅ Məhdud |

## 🔗 Əlaqəli Linklər

- [Cloudinary Dashboard](https://console.cloudinary.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference)

