# Google Sheets Errors Page Setup

Bu təlimat, saytın bütün xətalarını Google Sheets-də "Errors" səhifəsində saxlamaq üçün lazımdır.

## Addım 1: Google Sheets-də "Errors" Səhifəsi Yaradın

1. **ibrahimabdullayevcomaz** Google Sheets faylını açın
2. Aşağıda **"+"** düyməsinə basın və yeni səhifə yaradın
3. Səhifənin adını **"Errors"** qoyun
4. İlk sətirdə aşağıdakı başlıqları yazın:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Error Type | Endpoint | Message | Stack Trace | Additional Data | User Agent | URL | Status Code | Method |

## Addım 2: Service Account Email-ini Paylaşın

Əgər artıq paylaşmayıbsınızsa:
1. Google Sheets-də sağ yuxarıda **"Paylaş"** düyməsinə basın
2. Service Account email-ini tapın (Vercel Environment Variables-də `GOOGLE_SERVICE_ACCOUNT_KEY`-də `client_email` sahəsindədir)
3. Service Account email-ini **"Düzenleyen"** icazəsi ilə əlavə edin

## Error Types

Sistem aşağıdakı error type-ları log edir:

- **API_ERROR** - Backend API xətaları
- **FRONTEND_ERROR** - Frontend JavaScript xətaları
- **VALIDATION_ERROR** - Form validation xətaları
- **API_ERROR_RESPONSE** - API-dən gələn error response-ları

## Error Logging Strukturu

Hər error aşağıdakı məlumatları ehtiva edir:

- **Timestamp** - Xətanın baş verdiyi vaxt (ISO format)
- **Error Type** - Xətanın növü
- **Endpoint** - Xətanın baş verdiyi endpoint və ya səhifə
- **Message** - Xəta mesajı
- **Stack Trace** - Xətanın stack trace-i (varsa)
- **Additional Data** - Əlavə məlumatlar (JSON format)
- **User Agent** - İstifadəçi brauzer məlumatı
- **URL** - Xətanın baş verdiyi URL
- **Status Code** - HTTP status kodu (varsa)
- **Method** - HTTP metodu (varsa)

## Yoxlama

1. Saytda bir xəta yaradın (məsələn, booking form-da yanlış məlumat daxil edin)
2. Google Sheets-də **"Errors"** səhifəsinə baxın
3. Yeni sətirdə xəta məlumatı görünməlidir

## Qeydlər

- Xətalar real-time olaraq Google Sheets-ə yazılır
- Sensitive məlumatlar (email, telefon) log edilmir və ya maskalanır
- Error logging sistem xətası olsa belə, əsas funksionallığı bloklamır

