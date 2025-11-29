# Google Sheets Kurulum Rehberi (Türkçe)

## Mevcut Durumunuz

✅ **API Key**: `AIzaSyBT47CJJvh9lidce-smaTWvpOrZ82ReAXI`  
✅ **Spreadsheet ID**: `1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA`  
✅ **Spreadsheet Link**: https://docs.google.com/spreadsheets/d/1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA/edit

## Seçenek 1: API Key Kullanarak (Hızlı ve Kolay) ⚡

Bu yöntem daha basit ve hızlıdır. Şu anda sahip olduğunuz bilgilerle hemen kullanabilirsiniz.

### Adım 1: Google Sheets'te Başlıkları Hazırlayın

1. Google Sheets'i açın: https://docs.google.com/spreadsheets/d/1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA/edit
2. İlk satıra (A1'den başlayarak) şu başlıkları yazın:

| A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 | I1 | J1 | K1 |
|---|---|---|---|---|---|---|---|---|---|---|
| Tarix | Növ | Ad | Email | Telefon | Haradan | Hara | Gediş tarixi | Qayıdış tarixi | Nəfər sayı | Əlavə məlumat |

### Adım 2: Spreadsheet'i Herkese Açık Yapın (Geçici)

1. Google Sheets'te sağ üst köşedeki **"Paylaş"** (Share) butonuna tıklayın
2. **"Herkesi değiştirebilir"** (Anyone with the link can edit) seçeneğini seçin
3. **"Tamam"** (Done) butonuna tıklayın

**Not:** Bu geçici bir çözümdür. Daha güvenli için Service Account kullanın.

### Adım 3: API Key Kısıtlamalarını Ayarlayın

1. [Google Cloud Console](https://console.cloud.google.com/) → **"APIs & Services"** → **"Credentials"** bölümüne gidin
2. API Key'inize (`AIzaSyBT47CJJvh9lidce-smaTWvpOrZ82ReAXI`) tıklayın
3. **"API restrictions"** (API kısıtlamaları) bölümünde:
   - **"Restrict key"** (Anahtarı kısıtla) seçin
   - **"Select APIs"** (API'leri seç) → **"Google Sheets API"** seçin
   - **"Save"** (Kaydet) butonuna tıklayın

4. **"Application restrictions"** (Uygulama kısıtlamaları) bölümünde:
   - **"HTTP referrers"** (Web sitesi kısıtlamaları) seçin
   - **"Add an item"** (Öğe ekle) butonuna tıklayın
   - Şu referrer'ları ekleyin:
     - `https://ibrahimabdullayev-portfolio.vercel.app/*`
     - `https://ibrahimabdullayev.com/*`
     - `https://www.ibrahimabdullayev.com/*`
     - `https://ibrahimabdullayev.az/*`
   - **"Save"** (Kaydet) butonuna tıklayın

### Adım 4: Vercel'de Environment Variables Ekleme

1. [Vercel Dashboard](https://vercel.com/dashboard) → Projenizi seçin
2. **"Settings"** (Ayarlar) → **"Environment Variables"** (Ortam Değişkenleri) bölümüne gidin
3. Şu değişkenleri ekleyin:

**Değişken 1:**
- **Name**: `GOOGLE_SHEET_ID`
- **Value**: `1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA`
- **Environment**: Production, Preview, Development (hepsini seçin)
- **"Save"** (Kaydet) butonuna tıklayın

**Değişken 2:**
- **Name**: `GOOGLE_SHEETS_API_KEY`
- **Value**: `AIzaSyBT47CJJvh9lidce-smaTWvpOrZ82ReAXI`
- **Environment**: Production, Preview, Development (hepsini seçin)
- **"Save"** (Kaydet) butonuna tıklayın

### Adım 5: Deployment Yenileme

1. Vercel Dashboard'da **"Deployments"** (Dağıtımlar) bölümüne gidin
2. Son deployment'ın yanındaki **üç nokta (⋮)** menüsüne tıklayın
3. **"Redeploy"** (Yeniden dağıt) seçin
4. Deployment'ın tamamlanmasını bekleyin (2-3 dakika)

### Adım 6: Test Etme

1. Sitenizde booking formunu doldurun
2. Formu gönderin
3. Google Sheets'te yeni satırın eklendiğini kontrol edin

---

## Seçenek 2: Service Account Kullanarak (Daha Güvenli) 🔒

Bu yöntem daha güvenlidir ve uzun vadede önerilir. Service Account, kullanıcı etkileşimi olmadan Google API'lerine erişim sağlayan özel bir hesap türüdür.

### Service Account Nedir?

Service Account, Google Cloud'da bir uygulama veya servis için oluşturulan özel bir hesap türüdür. Bu hesap:
- Kullanıcı girişi gerektirmez
- Sadece belirli API'lere erişim sağlar
- Daha güvenlidir (API Key'den daha güvenli)
- Google Sheets'e doğrudan yazma izni verir

### Service Account Oluşturma Adımları

#### 1. Service Account Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/) giriş yapın
2. Projenizi seçin: **"Ibrahim Abdullayevcomaz 89953"**
3. Sol menüden **"APIs & Services"** → **"Credentials"** (Kimlik Bilgileri) bölümüne gidin
4. Sayfanın üst kısmında **"Create Credentials"** (Kimlik Bilgileri Oluştur) butonuna tıklayın
5. Açılan menüden **"Service Account"** (Servis Hesabı) seçin

#### 2. Service Account Detaylarını Doldurma

1. **Service Account Details** (Hesap Detayları) bölümünde:
   - **Service account name** (Hesap adı): `ibrahim-portfolio-sheets` (veya istediğiniz bir isim)
   - **Service account ID** (Hesap ID): Otomatik oluşturulur (örnek: `ibrahim-portfolio-sheets@banded-arcana-479707-b2.iam.gserviceaccount.com`)
   - **Description** (Açıklama): `Portfolio booking form için Google Sheets erişimi` (isteğe bağlı)

2. **"Create and Continue"** (Oluştur ve Devam Et) butonuna tıklayın

#### 3. Rol Atama (İsteğe Bağlı)

1. **Grant this service account access to project** (Bu servis hesabına proje erişimi ver) bölümünde:
   - Bu adımı atlayabilirsiniz (boş bırakın)
   - **"Continue"** (Devam Et) butonuna tıklayın

2. **"Done"** (Tamam) butonuna tıklayın

#### 4. JSON Key Dosyası İndirme

1. Oluşturulan Service Account listesinde, hesabınızın yanındaki **üç nokta (⋮)** menüsüne tıklayın
2. **"Manage Keys"** (Anahtarları Yönet) seçin
3. **"Add Key"** (Anahtar Ekle) → **"Create new key"** (Yeni anahtar oluştur) seçin
4. **Key type** (Anahtar türü): **"JSON"** seçin
5. **"Create"** (Oluştur) butonuna tıklayın
6. JSON dosyası otomatik olarak indirilecektir (örnek: `banded-arcana-479707-b2-xxxxx.json`)
7. Bu dosyayı güvenli bir yerde saklayın

#### 5. JSON Dosyası İçeriğini Kontrol Etme

İndirdiğiniz JSON dosyasını açın. İçeriği şuna benzer olacaktır:

```json
{
  "type": "service_account",
  "project_id": "banded-arcana-479707-b2",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "ibrahim-portfolio-sheets@banded-arcana-479707-b2.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

**Önemli:** `client_email` değerini kopyalayın (örnek: `ibrahim-portfolio-sheets@banded-arcana-479707-b2.iam.gserviceaccount.com`)

#### 6. Google Sheets'te Service Account'u Paylaşma

1. [Google Sheets](https://sheets.google.com/) giriş yapın
2. Spreadsheet'inizi açın: https://docs.google.com/spreadsheets/d/1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA/edit
3. Sağ üst köşedeki **"Paylaş"** (Share) butonuna tıklayın
4. **"Kişi veya grup ekle"** (Add people and groups) alanına Service Account'un **email adresini** yazın
   - JSON dosyasındaki `client_email` değerini kullanın
   - Örnek: `ibrahim-portfolio-sheets@banded-arcana-479707-b2.iam.gserviceaccount.com`
5. **"Düzenleyici"** (Editor) iznini seçin
6. **"Gönder"** (Send) butonuna tıklayın
7. **"Tamam"** (Done) butonuna tıklayın

#### 7. JSON Key'i Base64 Encode Etme

1. İndirdiğiniz JSON dosyasını açın
2. Tüm içeriği kopyalayın (Ctrl+A, Ctrl+C)
3. [Base64 Encode](https://www.base64encode.org/) sitesine gidin
4. JSON içeriğini yapıştırın
5. **"Encode"** (Kodla) butonuna tıklayın
6. Base64 encode edilmiş metni kopyalayın

#### 8. Vercel'de Environment Variables Ekleme

1. [Vercel Dashboard](https://vercel.com/dashboard) → Projenizi seçin
2. **"Settings"** (Ayarlar) → **"Environment Variables"** (Ortam Değişkenleri) bölümüne gidin
3. Şu değişkenleri ekleyin:

**Değişken 1:**
- **Name**: `GOOGLE_SHEET_ID`
- **Value**: `1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA`
- **Environment**: Production, Preview, Development (hepsini seçin)

**Değişken 2:**
- **Name**: `GOOGLE_SERVICE_ACCOUNT_KEY`
- **Value**: (Base64 encode edilmiş JSON içeriği - çok uzun bir metin olacak)
- **Environment**: Production, Preview, Development (hepsini seçin)

4. **"Save"** (Kaydet) butonuna tıklayın

**Not:** Service Account kullanıyorsanız, `GOOGLE_SHEETS_API_KEY` değişkenine ihtiyacınız yoktur.

#### 9. Kod Güncellemesi (Gerekirse)

Service Account kullanmak için `api/google-sheets.js` dosyasını güncellememiz gerekebilir. Şu anda API Key yöntemi kullanılıyor, Service Account için kod güncellemesi gerekirse size bildireceğim.

---

## Hangi Yöntemi Seçmeliyim?

### API Key Yöntemi (Seçenek 1) ✅
- ✅ Daha hızlı kurulum
- ✅ Daha basit
- ✅ Şu anda sahip olduğunuz bilgilerle hemen kullanılabilir
- ⚠️ Daha az güvenli (ama kısıtlamalarla güvenli hale getirilebilir)

### Service Account Yöntemi (Seçenek 2) 🔒
- ✅ Daha güvenli
- ✅ Uzun vadede önerilir
- ✅ Kullanıcı etkileşimi gerektirmez
- ⚠️ Biraz daha karmaşık kurulum

**Öneri:** Başlangıç için **API Key yöntemini** kullanın, daha sonra güvenlik için **Service Account**'a geçebilirsiniz.

---

## Sorun Giderme

### Veri yazılmıyor?
1. Vercel Logs'u kontrol edin: **Deployments** → Son deployment → **Logs**
2. Environment Variables'ın doğru eklendiğini kontrol edin
3. Google Sheets'te başlıkların doğru olduğunu kontrol edin

### API Key hatası?
1. Google Sheets API'nin etkinleştirildiğini kontrol edin
2. API Key kısıtlamalarını kontrol edin
3. Spreadsheet'in herkese açık olduğunu kontrol edin (API Key yöntemi için)

### Service Account hatası?
1. Service Account email'inin Google Sheets'te paylaşıldığını kontrol edin
2. Editor izninin verildiğini kontrol edin
3. JSON key'in doğru encode edildiğini kontrol edin

---

## Sonraki Adımlar

1. **API Key yöntemini** kullanacaksanız: Adım 4'e geçin (Vercel Environment Variables)
2. **Service Account yöntemini** kullanacaksanız: Service Account oluşturma adımlarını takip edin

Her iki yöntem de çalışır, tercihinize göre seçebilirsiniz!

