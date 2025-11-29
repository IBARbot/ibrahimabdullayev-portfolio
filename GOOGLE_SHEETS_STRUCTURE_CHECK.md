# Google Sheets Strukturu Yoxlama

## Hazırki Struktur (Şəkilə görə)

Sizin Google Sheets-də başlıqlar **A sütununda dikey** yazılıb:

```
A1: - Tarix
A2: - Növ
A3: - Ad
A4: - Email
A5: - Telefon
A6: - Haradan
A7: - Hara
A8: - Gediş tarixi
A9: - Qayıdış tarixi
A10: - Nəfər sayı
A11: - Əlavə məlumat
```

## Problem ❌

Kod **A sətirində horizontal** yazır (A1, B1, C1, D1...), amma sizin başlıqlarınız **A sütununda dikey** yazılıb (A1, A2, A3...).

## Həll ✅

### Seçim 1: Başlıqları Dəyişdirin (Tövsiyə olunur)

1. Google Sheets-də başlıqları **ilk sətirdə horizontal** yazın:

| A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 | I1 | J1 | K1 |
|---|---|---|---|---|---|---|---|---|---|---|
| Tarix | Növ | Ad | Email | Telefon | Haradan | Hara | Gediş tarixi | Qayıdış tarixi | Nəfər sayı | Əlavə məlumat |

2. A sütunundakı köhnə başlıqları silin (A1-A11)

### Seçim 2: Kodu Dəyişdirin

Kodu dəyişdirərək A sütununa yazmaq mümkündür, amma bu daha mürəkkəbdir və tövsiyə olunmur.

## Addım-Addım Təlimat

### Google Sheets-də Düzəltmə:

1. Google Sheets-i açın
2. **A1** hücrəsinə: `Tarix` yazın
3. **B1** hücrəsinə: `Növ` yazın
4. **C1** hücrəsinə: `Ad` yazın
5. **D1** hücrəsinə: `Email` yazın
6. **E1** hücrəsinə: `Telefon` yazın
7. **F1** hücrəsinə: `Haradan` yazın
8. **G1** hücrəsinə: `Hara` yazın
9. **H1** hücrəsinə: `Gediş tarixi` yazın
10. **I1** hücrəsinə: `Qayıdış tarixi` yazın
11. **J1** hücrəsinə: `Nəfər sayı` yazın
12. **K1** hücrəsinə: `Əlavə məlumat` yazın
13. A sütunundakı köhnə başlıqları silin (A1-A11)

## Yoxlama

Düzəltmədən sonra:
1. İlk sətirdə (1-ci sətir) başlıqlar horizontal olmalıdır
2. A sütununda başlıq olmamalıdır
3. Yeni məlumatlar 2-ci sətirdən başlayaraq əlavə olunacaq


