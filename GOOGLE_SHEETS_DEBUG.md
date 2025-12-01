# Google Sheets Debugging Guide

## Problem
Google Sheets-ə məlumat yazılmır, amma email gəlir.

## Həll Addımları

### 1. Vercel Function Loglarını Yoxlayın

1. **Vercel Dashboard** → **ibrahimabdullayev-portfolio** → **Deployments**
2. **Son deployment**-i açın
3. **"Functions"** tab-ına keçin
4. **`/api/google-sheets`** funksiyasını tapın
5. **"Logs"** bölməsinə keçin
6. Yeni bir rezervasiya sorğusu göndərin
7. Logları yoxlayın

**Gözlənilən loglar:**
- `Google Sheets API çağırışı başladı`
- `Sheet ID: Mövcuddur`
- `Service Account Key: Mövcuddur`
- `Göndəriləcək məlumat: [...]`
- `Service Account metodu istifadə olunur...`
- `Access token alındı, Google Sheets-ə yazılır...`
- `Google Sheets-ə uğurla yazıldı`

**Xəta varsa:**
- Xəta mesajını kopyalayın
- `Error details:` və `Error stack:` bölmələrinə diqqət yetirin

### 2. Google Sheets Strukturunu Yoxlayın

Sizin cədvəlinizdə **5 sütun** olmalıdır (1-ci sətirdə):

| A1 | B1 | C1 | D1 | E1 |
|---|---|---|---|---|
| Tarix | Növ | Ad | Email | Telefon |

**Yoxlama:**
1. Google Sheets-i açın
2. 1-ci sətirdə bu başlıqların olduğunu yoxlayın
3. Başlıqların **horizontal** (yatay) olduğundan əmin olun

### 3. Service Account İcazələrini Yoxlayın

1. Google Sheets-i açın
2. **"Paylaş"** (Share) düyməsinə basın
3. Service Account email-inin siyahıda olduğunu yoxlayın:
   - `ibrahim-portfolio-sheets@banded-arcana-479707-b2.iam.gserviceaccount.com`
4. İcazəsi **"Düzenleyen"** (Editor) olmalıdır

### 4. Vercel Environment Variables Yoxlayın

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Bu dəyişənlərin olduğunu yoxlayın:
   - `GOOGLE_SHEET_ID` = `1hsARpte6_oNcBtleF9v0V28IHqhM3_yZEHlLsGupOkA`
   - `GOOGLE_SERVICE_ACCOUNT_KEY` = (Base64 encoded JSON)

**Yoxlama:**
- `GOOGLE_SERVICE_ACCOUNT_KEY` dəyəri çox uzun olmalıdır (Base64 string)
- Dəyərin başında `ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCI=` kimi görünməlidir

### 5. Test Sorğusu Göndərin

1. Saytınızı açın
2. Rezervasiya formunu doldurun
3. **Email və ya telefon** daxil edin (ən azı biri mütləq)
4. Göndərin
5. Dərhal Vercel Logs-ı yoxlayın

### 6. Google Sheets API Quota Yoxlayın

1. [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Dashboard**
2. **Google Sheets API**-nin aktiv olduğunu yoxlayın
3. **Quotas** bölməsində limitləri yoxlayın

## Ümumi Xətalar və Həllər

### Xəta: "Access token alınamadı"
- **Səbəb:** Service Account key səhv və ya Base64 encoding problem
- **Həll:** Vercel-də `GOOGLE_SERVICE_ACCOUNT_KEY` dəyərini yenidən yoxlayın

### Xəta: "Permission denied"
- **Səbəb:** Service Account email-i Google Sheets-də paylaşılmamış
- **Həll:** Google Sheets-də Service Account email-ini "Düzenleyen" kimi əlavə edin

### Xəta: "Sheet not found"
- **Səbəb:** `GOOGLE_SHEET_ID` səhv
- **Həll:** Vercel-də `GOOGLE_SHEET_ID` dəyərini yoxlayın

### Məlumat yazılmır, amma xəta yoxdur
- **Səbəb:** Sütun sayı uyğun deyil
- **Həll:** Google Sheets-də yalnız 5 sütun olduğundan əmin olun (Tarix, Növ, Ad, Email, Telefon)

## Statistikalar Haqqında

**Sual:** Saytın statistikalarının dataları toplanacaqmı bu üsulla?

**Cavab:** Xeyr, bu üsul yalnız rezervasiya sorğularını toplayır. Sayt statistikaları üçün ayrı bir sistem lazımdır:

1. **Google Analytics** - İstifadəçi davranışı, səhifə görüntüləmələri
2. **Vercel Analytics** - Deployment statistikaları
3. **Custom Analytics** - Öz backend-inizdə statistikalar toplamaq

Əgər sayt statistikaları istəyirsinizsə, ayrıca bir endpoint və database lazımdır.




