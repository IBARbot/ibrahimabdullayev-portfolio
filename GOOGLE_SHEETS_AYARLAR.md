# Google Sheets Ayarları - Tövsiyələr

## Hazırki Vəziyyət ✅

Service Account-u **"Düzenleyen"** (Editor) icazəsi ilə paylaşdınız - bu düzgündür!

## Ayarlar Pəncərəsində Nəzərdən Keçirməli

### 1. "Erişim" (Access) Bölməsi

**"Düzenleyenlerin paylaşmasına ve izinleri değiştirmesine izin ver"** (Allow editors to share and change permissions)

**Tövsiyə:** Bu seçimi **qapatın** (uncheck edin)

**Səbəb:**
- Service Account yalnız veri yazmaq üçün istifadə olunur
- Paylaşım və icazə dəyişdirməsinə ehtiyac yoxdur
- Daha təhlükəsizdir

**Necə:**
1. Bu checkbox-ı uncheck edin
2. "Tamam" və ya "Kaydet" düyməsinə basın

### 2. "İndirme, kopyalama və yazdırma" Bölməsi

**Hazırki vəziyyət:**
- ✅ "Düzenleyenler" (Editors) - seçilmiş
- ✅ "Yorumcular və görüntüleyenler" (Commenters and viewers) - seçilmiş

**Tövsiyə:** Bu ayarları **dəyişdirməyin** - olduğu kimi qalsın

**Səbəb:**
- Service Account üçün problem yaratmır
- İndirmə/kopyalama/yazdırma funksiyaları Service Account-un işinə təsir etmir

## Xülasə

### ✅ Düzgün Olanlar:
1. Service Account "Düzenleyen" (Editor) icazəsi ilə paylaşılıb
2. İndirmə/kopyalama/yazdırma ayarları uyğundur

### 🔧 Dəyişdirməli:
1. "Düzenleyenlerin paylaşmasına ve izinleri değiştirmesine izin ver" seçimini **qapatın**

## Növbəti Addımlar

1. Ayarlar pəncərəsində yuxarıdakı dəyişikliyi edin
2. "Tamam" və ya "Kaydet" düyməsinə basın
3. JSON faylını Base64 encode edin
4. Vercel-də environment variables əlavə edin
5. Deployment-i yeniləyin

