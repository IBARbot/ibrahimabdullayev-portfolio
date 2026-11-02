# 📸 Imgur Şəkil Yükləmə Konfiqurasiyası

Sertifikat şəkillərinin və digər şəkillərin saytda saxlanması üçün Imgur API istifadə olunur.

## 🔑 Imgur Client ID Almaq

### Addım 1: Imgur Hesabı
1. [Imgur.com](https://imgur.com) saytına daxil olun və hesab yaradın (pulsuz)
2. Email ilə qeydiyyatdan keçin və email-ı təsdiq edin

### Addım 2: API Application Yaradın
**DİQQƏT:** Imgur API Applications səhifəsinə daxil olmaq üçün **birbaşa bu linkə** gedin:

👉 **https://api.imgur.com/oauth2/addclient**

**QEYD:** 
- `https://imgur.com/account/settings/apps` səhifəsi boş ola bilər - bu səhifəni istifadə etməyin
- Birbaşa `https://api.imgur.com/oauth2/addclient` linkinə gedin

### Addım 3: Application Məlumatlarını Doldurun
Formu doldurun:

- **Application name**: `ibrahimabdullayev-portfolio` (və ya istədiyiniz ad)
- **Authorization type**: **`Anonymous usage without user authorization`** seçin (vacib!)
- **Authorization callback URL**: boş buraxa bilərsiniz və ya `https://ibrahimabdullayev.az` yazın
- **Application website**: `https://ibrahimabdullayev.az` (saytınızın URL-i)
- **Email**: email ünvanınız (məsələn: `ibrahim.abdullayev1@gmail.com`)

### Addım 4: Submit və Client ID Alın
1. "Submit" düyməsini basın
2. Növbəti səhifədə **Client ID** görünəcək (bu uzun bir string-dir, məsələn: `a1b2c3d4e5f6g7h8`)
3. **Client ID**-ni kopyalayın və təhlükəsiz yerdə saxlayın
4. **QEYD:** Client Secret lazım deyil - yalnız Client ID lazımdır

## ⚙️ Vercel Environment Variables

Vercel-də deploy etdikdən sonra:

1. Vercel Dashboard-a daxil olun
2. Layihənizi seçin
3. **Settings** → **Environment Variables** bölməsinə gedin
4. Yeni variable əlavə edin:
   - **Name**: `IMGUR_CLIENT_ID`
   - **Value**: Imgur-dan aldığınız Client ID
   - **Environment**: Production, Preview, Development (hamısını seçin)
5. **Save** düyməsini basın
6. Layihəni yenidən deploy edin

## 🧪 Test

1. Admin paneldə daxil olun
2. Sertifikat bölməsinə gedin
3. Şəkil yükləyin
4. Şəkil Imgur-a yüklənəcək və URL qaytarılacaq
5. Save edin və saytda görün

## 📝 Qeyd

- **Imgur Client ID yoxdursa**: Şəkillər base64 formatında saxlanılacaq (işləyir, amma daha yavaşdır)
- **Imgur limitləri**: Günlük 1250 upload limiti var (pulsuz plan)
- **Şəkil ölçüsü**: 10MB-dan kiçik olmalıdır

## 🔄 Alternativ: Base64 Formatında Saxlama

Əgər Imgur istifadə etmək istəmirsinizsə, şəkillər base64 formatında Google Sheets-də saxlanılacaq. Bu işləyir, amma:
- Daha yavaşdır (böyük şəkillər üçün)
- Google Sheets-də məhdudiyyətlər ola bilər




