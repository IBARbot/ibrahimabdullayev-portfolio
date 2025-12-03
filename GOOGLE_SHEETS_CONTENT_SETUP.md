# Google Sheets Content Storage Setup

Bu təlimat, saytın kontentini (sertifikat şəkilləri, portfolio, və s.) Google Sheets-də davamlı saxlamaq üçün lazımdır.

## Addım 1: Google Sheets-də "Content" Səhifəsi Yaradın

1. **ibrahimabdullayevcomaz** Google Sheets faylını açın
2. Aşağıda **"+"** düyməsinə basın və yeni səhifə yaradın
3. Səhifənin adını **"Content"** qoyun
4. **A1** hücrəsini boş buraxın (sistem avtomatik yazacaq)

## Addım 2: Service Account Email-ini Paylaşın

1. Google Sheets-də sağ yuxarıda **"Paylaş"** düyməsinə basın
2. Service Account email-ini tapın (Vercel Environment Variables-də `GOOGLE_SERVICE_ACCOUNT_KEY`-də `client_email` sahəsindədir)
3. Service Account email-ini **"Düzenleyen"** icazəsi ilə əlavə edin
4. **"Göndər"** düyməsinə basın

## Addım 3: Yoxlama

1. Admin panelə daxil olun
2. Sertifikat şəkilini yükləyin və **SAXLA** düyməsinə basın
3. Google Sheets-də **"Content"** səhifəsinə baxın
4. **A1** hücrəsində JSON formatında kontent görünməlidir
5. Saytı bağlayıb yenidən açın - şəkillər qalmalıdır!

## Qeydlər

- **Content səhifəsi** mövcud Google Sheets faylında yaradılmalıdır (analytics və booking ilə eyni fayl)
- **A1 hücrəsi** bütün kontenti JSON formatında saxlayır
- Əgər Google Sheets konfiqurasiya edilməyibsə, sistem default kontenti istifadə edəcək
- Şəkillər base64 formatında saxlanılır (Google Sheets-də çox yer tuta bilər, amma işləyir)

## Problemlər

### Problem: "Content saved to Google Sheets successfully" mesajı görünmür

**Həll:**
1. `GOOGLE_SHEET_ID` environment variable-ının düzgün təyin edildiyini yoxlayın
2. `GOOGLE_SERVICE_ACCOUNT_KEY` environment variable-ının düzgün təyin edildiyini yoxlayın
3. Service Account email-inin Google Sheets-də paylaşıldığını yoxlayın

### Problem: Şəkillər yenə də silinir

**Həll:**
1. Vercel logs-da "Content saved to Google Sheets successfully" mesajını yoxlayın
2. Google Sheets-də "Content" səhifəsinin mövcud olduğunu yoxlayın
3. A1 hücrəsində JSON məlumatın olduğunu yoxlayın

### Problem: "Could not get access token" xətası

**Həll:**
1. `GOOGLE_SERVICE_ACCOUNT_KEY` environment variable-ının base64 formatında olduğunu yoxlayın
2. Service Account JSON faylının düzgün formatda olduğunu yoxlayın



