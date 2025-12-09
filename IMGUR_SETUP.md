# 📸 Imgur Şəkil Yükləmə Konfiqurasiyası

Sertifikat şəkillərinin və digər şəkillərin saytda saxlanması üçün Imgur API istifadə olunur.

## 🔑 Imgur Client ID Almaq

1. [Imgur.com](https://imgur.com) saytına daxil olun və hesab yaradın (pulsuz)
2. Imgur API Applications səhifəsinə gedin:
   - **Birinci yol:** [https://api.imgur.com/oauth2/addclient](https://api.imgur.com/oauth2/addclient) - birbaşa API səhifəsi
   - **İkinci yol:** [https://imgur.com/register/api](https://imgur.com/register/api) - Imgur-un rəsmi qeydiyyat səhifəsi
   - **Üçüncü yol:** Imgur.com-da daxil olduqdan sonra, profil ikonuna klikləyin → **Settings** → **API** bölməsinə gedin
3. "Application" bölməsində:
   - **Application name**: `ibrahimabdullayev-portfolio` (və ya istədiyiniz ad)
   - **Authorization type**: `Anonymous usage without user authorization` seçin
   - **Authorization callback URL**: boş buraxa bilərsiniz
   - **Application website**: saytınızın URL-i
   - **Email**: email ünvanınız
4. "Submit" düyməsini basın
5. **Client ID**-ni kopyalayın (bu uzun bir string-dir)

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

## ⚠️ Problem: Link işləmir?

Əgər Imgur API Applications linkinə daxil olanda ana səhifəyə yönləndirilirsinizsə:

1. **Brauzer keşini təmizləyin:**
   - Chrome: Ctrl+Shift+Delete → "Cached images and files" seçin → Clear
   - Firefox: Ctrl+Shift+Delete → "Cache" seçin → Clear

2. **Fərqli brauzerdən cəhd edin:**
   - Chrome, Firefox, Edge və ya Safari

3. **Birbaşa URL istifadə edin:**
   - [https://api.imgur.com/oauth2/addclient](https://api.imgur.com/oauth2/addclient)
   - Və ya [https://imgur.com/register/api](https://imgur.com/register/api)

4. **Imgur-da daxil olun:**
   - Əvvəlcə [imgur.com](https://imgur.com) saytına daxil olun
   - Sonra yeni tab-da API səhifəsinə gedin

5. **Alternativ:** Əgər hələ də işləmirsə, Imgur-un dəstək komandası ilə əlaqə saxlayın və ya base64 formatında saxlayın (işləyir, amma daha yavaşdır)

## 🔄 Alternativ: Base64 Formatında Saxlama

Əgər Imgur istifadə etmək istəmirsinizsə, şəkillər base64 formatında Google Sheets-də saxlanılacaq. Bu işləyir, amma:
- Daha yavaşdır (böyük şəkillər üçün)
- Google Sheets-də məhdudiyyətlər ola bilər




