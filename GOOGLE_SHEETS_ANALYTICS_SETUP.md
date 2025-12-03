# Google Sheets Analytics Səhifəsi Quraşdırma

## Məqsəd

Analytics məlumatlarını mövcud Google Sheets faylında "Analytics" adlı yeni səhifədə toplamaq.

## Addımlar

### 1. Google Sheets-də Yeni Səhifə Yaradın

1. **ibrahimabdullayevcomaz** Google Sheets faylını açın
2. Aşağıdakı **"+"** düyməsinə basın (yeni səhifə əlavə etmək üçün)
3. Səhifənin adını **"Analytics"** qoyun
4. Köhnə "Sayfa1" səhifəsini silməyin (booking məlumatları orada qalır)

### 2. Başlıqları Əlavə Edin

**Analytics** səhifəsinin 1-ci sətirində bu başlıqları əlavə edin:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Tarix | Növ | Path | Element | Dəyər | Referrer | User Agent | Screen Size | IP |

**Başlıq təsvirləri:**
- **A: Tarix** - Event-in baş vermə tarixi
- **B: Növ** - Event növü (pageview, click, scroll)
- **C: Path** - Səhifə yolu (/ və ya /#home)
- **D: Element** - Kliklənən element adı və ya scroll dərinliyi
- **E: Dəyər** - Əlavə dəyər
- **F: Referrer** - İstifadəçinin haradan gəldiyi
- **G: User Agent** - Brauzer məlumatı
- **H: Screen Size** - Ekran ölçüsü (məs: 1920x1080)
- **I: IP** - İstifadəçi IP ünvanı

### 3. Formatlaşdırma (İstəyə bağlı)

1. Başlıq sətirini **qalın** (bold) edin
2. **Tarix** sütununu tarix formatına çevirin
3. Sütun genişliyini avtomatik tənzimləyin

### 4. Yoxlama

1. Saytınızı açın və bir neçə səhifəyə keçin
2. Bir neçə düyməyə klik edin
3. Google Sheets-də **Analytics** səhifəsinə baxın
4. Yeni sətirlərin əlavə olunduğunu yoxlayın

## Qeyd

- Analytics məlumatları **avtomatik** olaraq bu səhifəyə yazılacaq
- Booking məlumatları **köhnə səhifədə** (Sayfa1 və ya ilk səhifə) qalır
- Hər iki səhifə eyni Google Sheets faylındadır

## Məlumat Növləri

### Pageview (Səhifə Baxışı)
- **Növ:** pageview
- **Path:** Səhifə yolu
- **Element:** Boş

### Click (Klik)
- **Növ:** click
- **Path:** Səhifə yolu
- **Element:** Düymə adı (məs: "İndi Rezerv Et")

### Scroll (Scroll Dərinliyi)
- **Növ:** scroll
- **Path:** Səhifə yolu
- **Element:** Scroll dərinliyi (25, 50, 75, 100)

## Troubleshooting

**Problem:** Məlumat yazılmır
- **Həll:** Service Account email-inin Google Sheets-də "Düzenleyen" icazəsi olduğundan əmin olun

**Problem:** "Analytics" səhifəsi tapılmır
- **Həll:** Səhifə adının düzgün "Analytics" olduğunu yoxlayın (böyük/kiçik hərf vacibdir)







