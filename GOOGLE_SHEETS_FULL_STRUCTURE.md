# Google Sheets Tam Struktur Təlimatı

## Sütun Strukturu (33 sütun)

Booking formundan gələn bütün məlumatlar üçün tam struktur:

### 1-ci sətirdə (Başlıqlar) bu sütunları yaradın:

| Sütun | Başlıq | Təsvir |
|-------|--------|--------|
| A | Tarix | Sorğunun göndərilmə tarixi |
| B | Növ | Booking növü (flight, hotel, transfer, insurance, embassy) |
| C | Ad | İstifadəçinin adı |
| D | Email | Email ünvanı |
| E | Telefon | Telefon nömrəsi |
| F | Flight - Səyahət növü | one-way, round-trip, multi-city |
| G | Haradan | Uçuş/Transfer başlanğıc nöqtəsi |
| H | Hara | Uçuş/Transfer təyinat nöqtəsi |
| I | Flight - Gediş tarixi | Uçuş gediş tarixi |
| J | Flight - Qayıdış tarixi | Uçuş qayıdış tarixi |
| K | Flight - Multi-city | Multi-city uçuşlar (JSON formatında) |
| L | Flight - Nəfər sayı | Sərnişin sayı |
| M | Flight - Sinif | Economy, Business, First |
| N | Flight - Stopla | Stopla seçimi |
| O | Hotel - Məkan | Otel məkanı |
| P | Hotel - Giriş tarixi | Check-in tarixi |
| Q | Hotel - Çıxış tarixi | Check-out tarixi |
| R | Hotel - Otaq sayı | Otaq sayı |
| S | Hotel - Nəfər sayı | Qonaq sayı |
| T | Hotel - Otel növü | Otel növü |
| U | Transfer - Transfer növü | Transfer növü |
| V | Transfer - Tarix | Transfer tarixi |
| W | Transfer - Vaxt | Transfer vaxtı |
| X | Transfer - Nəqliyyat növü | Nəqliyyat vasitəsi növü |
| Y | Insurance - Sığorta növü | Sığorta növü |
| Z | Insurance - Paket | Sığorta paketi |
| AA | Insurance - Başlama tarixi | Sığorta başlama tarixi |
| AB | Insurance - Bitmə tarixi | Sığorta bitmə tarixi |
| AC | Insurance - Əhatə dairəsi | Sığorta əhatə dairəsi |
| AD | Embassy - Ölkə | Səfirlik ölkəsi |
| AE | Embassy - Viza növü | Viza növü |
| AF | Embassy - Təcili | Təcili sorğu (Bəli/Xeyr) |
| AG | Əlavə məlumat | Qeydlər və əlavə məlumat |

## Google Sheets-də Quraşdırma

### Addım 1: Başlıqları Əlavə Edin

1. Google Sheets-i açın
2. 1-ci sətirdə yuxarıdakı başlıqları əlavə edin
3. Başlıqları **qalın** (bold) edin (formatlaşdırma üçün)

### Addım 2: Sütun Genişliyini Tənzimləyin

1. Bütün sütunları seçin (A-dan AG-yə qədər)
2. **Format** → **Column** → **Auto-fit column width**

### Addım 3: Formatlaşdırma (İstəyə bağlı)

1. **Tarix** sütununu (A) tarix formatına çevirin
2. **Email** sütununu (D) link formatına çevirin
3. **Telefon** sütununu (E) nömrə formatına çevirin

## Məlumat Strukturu

### Flight (Aviabilet) üçün:
- **F sütunu**: tripType (one-way, round-trip, multi-city)
- **G-H sütunları**: from, to
- **I-J sütunları**: departureDate, returnDate
- **K sütunu**: segments (JSON formatında)
- **L sütunu**: passengers
- **M sütunu**: class
- **N sütunu**: stops

### Hotel (Otel) üçün:
- **O sütunu**: destination
- **P-Q sütunları**: checkIn, checkOut
- **R sütunu**: rooms
- **S sütunu**: guests
- **T sütunu**: hotelType

### Transfer üçün:
- **U sütunu**: transferType
- **G-H sütunları**: from, to (Flight ilə eyni)
- **V sütunu**: date
- **W sütunu**: time
- **X sütunu**: vehicleType
- **L sütunu**: passengers (Flight ilə eyni)

### Insurance (Sığorta) üçün:
- **Y sütunu**: insuranceType
- **Z sütunu**: package
- **AA-AB sütunları**: startDate, endDate
- **AC sütunu**: coverage

### Embassy (Səfirlik) üçün:
- **AD sütunu**: embassyCountry
- **AE sütunu**: visaType
- **AF sütunu**: urgent (Bəli/Xeyr)

### Ümumi:
- **AG sütunu**: notes (bütün növlər üçün)

## Qeyd

- Boş sahələr boş qalacaq (hər booking növü üçün yalnız müvafiq sahələr doldurulacaq)
- Multi-city segments JSON formatında saxlanacaq (K sütunu)
- Tarix sahələri ISO formatında olacaq (məsələn: 2024-01-15T10:30:00.000Z)

## Yoxlama

Yeni bir rezervasiya sorğusu göndərdikdən sonra:
1. Google Sheets-də yeni sətir əlavə olunmalıdır
2. Müvafiq sahələr doldurulmalıdır
3. Boş sahələr boş qalmalıdır



