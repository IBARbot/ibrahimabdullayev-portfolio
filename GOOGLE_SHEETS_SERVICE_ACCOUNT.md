# Google Sheets Service Account Konfigürasyonu (Türkçe)

## Service Account Nedir?

Service Account, Google Cloud'da bir uygulama veya servis için oluşturulan özel bir hesap türüdür. Bu hesap, kullanıcı etkileşimi olmadan Google API'lerine erişim sağlar. Google Sheets'e veri yazmak için en güvenli yöntemdir.

## Service Account Oluşturma Adımları

### Adım 1: Service Account Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/) giriş yapın
2. Projenizi seçin: **"Ibrahim Abdullayevcomaz 89953"**
3. Sol menüden **"APIs & Services"** → **"Credentials"** (Kimlik Bilgileri) bölümüne gidin
4. Sayfanın üst kısmında **"Create Credentials"** (Kimlik Bilgileri Oluştur) butonuna tıklayın
5. Açılan menüden **"Service Account"** seçin

### Adım 2: Service Account Detaylarını Doldurma

1. **Service Account Details** (Hesap Detayları) bölümünde:
   - **Service account name** (Hesap adı): `ibrahim-portfolio-sheets` (veya istediğiniz bir isim)
   - **Service account ID** (Hesap ID): Otomatik oluşturulur
   - **Description** (Açıklama): `Portfolio booking form için Google Sheets erişimi` (isteğe bağlı)

2. **"Create and Continue"** (Oluştur ve Devam Et) butonuna tıklayın

### Adım 3: Rol Atama (İsteğe Bağlı)

1. **Grant this service account access to project** (Bu servis hesabına proje erişimi ver) bölümünde:
   - **Role** (Rol): **"Editor"** veya **"Owner"** seçin (veya boş bırakabilirsiniz)
   - **"Continue"** (Devam Et) butonuna tıklayın

2. **"Done"** (Tamam) butonuna tıklayın

### Adım 4: JSON Key Dosyası İndirme

1. Oluşturulan Service Account'un yanındaki **üç nokta (⋮)** menüsüne tıklayın
2. **"Manage Keys"** (Anahtarları Yönet) seçin
3. **"Add Key"** (Anahtar Ekle) → **"Create new key"** (Yeni anahtar oluştur) seçin
4. **Key type** (Anahtar türü): **"JSON"** seçin
5. **"Create"** (Oluştur) butonuna tıklayın
6. JSON dosyası otomatik olarak indirilecektir
7. Bu dosyayı güvenli bir yerde saklayın (örneğin: `service-account-key.json`)

### Adım 5: Google Sheets'te Service Account'u Paylaşma

1. [Google Sheets](https://sheets.google.com/) giriş yapın
2. Spreadsheet'inizi açın: `https://docs.google.com/spreadsheets/d/1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA/edit`
3. Sağ üst köşedeki **"Paylaş"** (Share) butonuna tıklayın
4. **"Kişi veya grup ekle"** (Add people and groups) alanına Service Account'un **email adresini** yazın
   - Service Account email'i JSON dosyasında `client_email` alanında bulunur
   - Örnek format: `ibrahim-portfolio-sheets@banded-arcana-479707-b2.iam.gserviceaccount.com`
5. **"Düzenleyici"** (Editor) iznini seçin
6. **"Gönder"** (Send) butonuna tıklayın

### Adım 6: Vercel'de Environment Variables Ekleme

1. [Vercel Dashboard](https://vercel.com/dashboard) giriş yapın
2. Projenizi seçin: **"ibrahimabdullayev-portfolio"**
3. **"Settings"** (Ayarlar) → **"Environment Variables"** (Ortam Değişkenleri) bölümüne gidin
4. Aşağıdaki değişkenleri ekleyin:

#### Seçenek A: JSON Key'i Base64 Encode Ederek (Önerilen)

1. İndirdiğiniz JSON dosyasını açın
2. Tüm içeriği kopyalayın
3. [Base64 Encode](https://www.base64encode.org/) sitesine gidin
4. JSON içeriğini yapıştırın ve encode edin
5. Vercel'de şu değişkeni ekleyin:
   - **Name**: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - **Value**: (Base64 encode edilmiş JSON içeriği)
   - **Environment**: Production, Preview, Development (hepsini seçin)

#### Seçenek B: API Key Kullanarak (Daha Basit, Ama Daha Az Güvenli)

Vercel'de şu değişkenleri ekleyin:
- **Name**: `GOOGLE_SHEET_ID`
  - **Value**: `1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA`
  - **Environment**: Production, Preview, Development

- **Name**: `GOOGLE_SHEETS_API_KEY`
  - **Value**: `AIzaSyBT47CJJvh9lidce-smaTWvpOrZ82ReAXI`
  - **Environment**: Production, Preview, Development

**Not:** API Key yöntemi daha basittir, ancak Service Account yöntemi daha güvenlidir.

### Adım 7: API Key Kısıtlamaları (Önemli!)

1. Google Cloud Console'da **"Credentials"** (Kimlik Bilgileri) bölümüne gidin
2. Oluşturduğunuz API Key'e tıklayın
3. **"API restrictions"** (API kısıtlamaları) bölümünde:
   - **"Restrict key"** (Anahtarı kısıtla) seçin
   - **"Select APIs"** (API'leri seç) bölümünden **"Google Sheets API"** seçin
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

## Test Etme

1. Booking formunu doldurun ve gönderin
2. Google Sheets'te yeni satırın eklendiğini kontrol edin
3. Vercel Logs'u kontrol edin: **Deployments** → Son deployment → **Logs**

## Sorun Giderme

### API Key çalışmıyor?
- Google Sheets API'nin etkinleştirildiğini kontrol edin
- API Key'in doğru olduğunu kontrol edin
- API Key kısıtlamalarını kontrol edin

### Veri yazılmıyor?
- Vercel Logs'u kontrol edin
- Spreadsheet ID'nin doğru olduğunu kontrol edin
- Service Account'un Google Sheets'te paylaşıldığını kontrol edin (Editor izni)

### Service Account email'i nerede?
- İndirdiğiniz JSON dosyasını açın
- `client_email` alanındaki email adresini kopyalayın
- Bu email'i Google Sheets'te paylaşın

## Önemli Notlar

1. **JSON Key Dosyasını Güvenli Tutun**: Bu dosya hassas bilgiler içerir, asla public repository'lere yüklemeyin
2. **API Key Kısıtlamaları**: API Key'inizi mutlaka kısıtlayın (sadece Google Sheets API ve belirli domain'ler)
3. **Service Account Email**: Service Account email'ini Google Sheets'te mutlaka paylaşın (Editor izni ile)

