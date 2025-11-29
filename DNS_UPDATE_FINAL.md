# GoDaddy DNS Qeydlərinin Final Yenilənməsi

## Vercel-in Yeni DNS Qeydləri

Vercel indi hər proyekt üçün unikal DNS qeydləri verir:

### 1. A Record (Root Domain - ibrahimabdullayev.com)
```
Type: A
Name: @
Value: 216.198.79.1
TTL: 300 saniyə
```

### 2. CNAME Record (www subdomain)
```
Type: CNAME
Name: www
Value: ed27c65ea3b39129.vercel-dns-017.com.
TTL: 300 saniyə
```

## GoDaddy-da Yeniləmə Addımları

### Addım 1: A Record-u Yeniləyin

1. GoDaddy DNS Management səhifəsində
2. A Record (`@` → `76.76.21.21`) üçün **pencil (düzenle)** ikonuna klikləyin
3. **Value** sahəsində:
   - **Köhnə:** `76.76.21.21`
   - **Yeni:** `216.198.79.1`
4. **TTL**-i `300` saniyəyə endirin
5. **Kaydet** (Save) düyməsinə basın

### Addım 2: CNAME Record-u Yeniləyin

1. GoDaddy DNS Management səhifəsində
2. CNAME Record (`www` → `cname.vercel-dns.com.`) üçün **pencil (düzenle)** ikonuna klikləyin
3. **Value** sahəsində:
   - **Köhnə:** `cname.vercel-dns.com.`
   - **Yeni:** `ed27c65ea3b39129.vercel-dns-017.com.`
   - **Qeyd:** Son nöqtəni (`.`) unutmayın!
4. **TTL**-i `300` saniyəyə endirin
5. **Kaydet** (Save) düyməsinə basın

## Final DNS Qeydləri (GoDaddy-da)

Yeniləmədən sonra GoDaddy-da aşağıdakı qeydlər olmalıdır:

```
Type: A
Name: @
Value: 216.198.79.1
TTL: 300 saniyə

Type: CNAME
Name: www
Value: ed27c65ea3b39129.vercel-dns-017.com.
TTL: 300 saniyə
```

## Vercel-də Yoxlama

DNS qeydlərini yenilədikdən sonra:

1. Vercel Dashboard → Settings → Domains
2. `ibrahimabdullayev.com` üçün "Refresh" düyməsinə basın
3. `www.ibrahimabdullayev.com` üçün "Refresh" düyməsinə basın
4. "DNS Change Recommended" mesajının yox olduğunu yoxlayın
5. Status "Valid Configuration" olmalıdır

## DNS Propagation

**Nə qədər vaxt çəkəcək:**
- Minimum: 5-10 dəqiqə (TTL 300 saniyə olduqda)
- Maksimum: 24 saat

**Yoxlama:**
1. https://dnschecker.org/ istifadə edin
2. `ibrahimabdullayev.com` üçün A record-u yoxlayın → `216.198.79.1`
3. `www.ibrahimabdullayev.com` üçün CNAME yoxlayın → `ed27c65ea3b39129.vercel-dns-017.com.`

## Test

DNS propagation-dən sonra:

1. **Browser-də test:**
   - Incognito/Private mode-da açın
   - `ibrahimabdullayev.com` və `www.ibrahimabdullayev.com` üçün test edin
   - Hard refresh: `Ctrl + Shift + R` (Windows) və ya `Cmd + Shift + R` (Mac)

2. **DNS Yoxlama:**
   - https://dnschecker.org/
   - Hər iki domain üçün qeydləri yoxlayın

## Əhəmiyyətli Qeydlər

- **CNAME Value:** Son nöqtəni (`.`) unutmayın: `ed27c65ea3b39129.vercel-dns-017.com.`
- **Unikal CNAME:** Bu CNAME yalnız sizin proyektiniz üçündür
- **Köhnə qeydlər:** Köhnə qeydlər (`cname.vercel-dns.com` və `76.76.21.21`) hələ də işləyir, amma yeni qeydləri istifadə etmək tövsiyə olunur

## Problem Davam Edərsə

1. **DNS Propagation Yoxlama:**
   - https://dnschecker.org/ ilə yoxlayın
   - Bütün DNS serverlərdə yeni qeydlərin göründüyünü təsdiq edin

2. **Vercel-də Yenidən Yoxlama:**
   - Domain-ləri silin və yenidən əlavə edin
   - "Refresh" düyməsinə basın

3. **Dəstək:**
   - Vercel Support-a müraciət edin
   - GoDaddy Support-a müraciət edin

