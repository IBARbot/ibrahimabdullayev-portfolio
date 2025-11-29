# GoDaddy DNS Qeydlərinin Yenilənməsi - Təlimat

## Problem
Vercel "DNS Change Recommended" mesajı göstərir çünki GoDaddy-da köhnə DNS qeydləri var.

## Həll: GoDaddy-da DNS Qeydlərini Yeniləyin

### Addım 1: A Record-u Yeniləyin

**Hazırki qeyd (Köhnə):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 saniye
```

**Yeni qeyd (Vercel-in tövsiyəsi):**
```
Type: A
Name: @
Value: 216.198.79.1
TTL: 600 saniye (və ya 300 saniyə - daha sürətli propagation üçün)
```

**Necə yeniləmək:**
1. GoDaddy DNS Management səhifəsində
2. A Record (`@` → `76.76.21.21`) üçün **pencil (düzenle)** ikonuna klikləyin
3. **Value** sahəsində `76.76.21.21`-i `216.198.79.1` ilə əvəz edin
4. **TTL**-i `300` saniyəyə endirin (daha sürətli propagation üçün)
5. **Kaydet** (Save) düyməsinə basın

### Addım 2: CNAME Record-u Yoxlayın

**Hazırki qeyd:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com.
TTL: 600 saniye
```

**Qeyd:** Bu qeyd düzgündür və dəyişdirilməyə ehtiyac yoxdur. Vercel-in mesajında deyilir ki, köhnə qeydlər hələ də işləyir, amma yeni qeydləri tövsiyə edir.

### Addım 3: TTL Dəyərlərini Optimallaşdırın

**Tövsiyə:**
- A Record TTL: `300 saniyə` (5 dəqiqə) - daha sürətli propagation
- CNAME TTL: `300 saniyə` (5 dəqiqə) - daha sürətli propagation

**Necə dəyişdirmək:**
1. Hər qeyd üçün **pencil (düzenle)** ikonuna klikləyin
2. **TTL** sahəsini `300` saniyəyə dəyişdirin
3. **Kaydet** düyməsinə basın

## Yenilənmiş DNS Qeydləri (Final)

GoDaddy-da aşağıdakı qeydlər olmalıdır:

```
Type: A
Name: @
Value: 216.198.79.1
TTL: 300 saniyə

Type: CNAME
Name: www
Value: cname.vercel-dns.com.
TTL: 300 saniyə
```

## DNS Propagation

**Nə qədər vaxt çəkəcək:**
- Minimum: 5-10 dəqiqə (TTL 300 saniyə olduqda)
- Maksimum: 24-48 saat (bəzi hallarda)

**Yoxlama:**
1. https://dnschecker.org/ istifadə edin
2. `ibrahimabdullayev.com` üçün A record-u yoxlayın
3. `216.198.79.1` IP-sinin göründüyünü təsdiq edin

## Vercel-də Status Yoxlama

DNS qeydlərini yenilədikdən sonra:

1. Vercel Dashboard → Settings → Domains
2. `ibrahimabdullayev.com` və `www.ibrahimabdullayev.com` üçün "Refresh" düyməsinə basın
3. "DNS Change Recommended" mesajının yox olduğunu yoxlayın
4. Status "Valid Configuration" olmalıdır

## Test

DNS propagation-dən sonra:

1. **Browser-də test:**
   - Incognito/Private mode-da açın
   - `ibrahimabdullayev.com` və `www.ibrahimabdullayev.com` üçün test edin
   - Hard refresh: `Ctrl + Shift + R` (Windows) və ya `Cmd + Shift + R` (Mac)

2. **DNS Yoxlama:**
   - https://dnschecker.org/
   - `ibrahimabdullayev.com` üçün A record-u yoxlayın
   - `216.198.79.1` IP-sinin göründüyünü təsdiq edin

## Əlavə Qeydlər

- **Köhnə qeydlər:** `76.76.21.21` və `cname.vercel-dns.com` hələ də işləyir, amma Vercel yeni qeydləri tövsiyə edir
- **TTL:** Aşağı TTL (300 saniyə) daha sürətli propagation təmin edir
- **Cache:** Browser və DNS cache-i təmizləyin

## Problem Davam Edərsə

1. **DNS Propagation Yoxlama:**
   - https://dnschecker.org/ ilə yoxlayın
   - Bütün DNS serverlərdə `216.198.79.1` görünməlidir

2. **Vercel-də Yenidən Yoxlama:**
   - Domain-ləri silin və yenidən əlavə edin
   - "Refresh" düyməsinə basın

3. **Dəstək:**
   - Vercel Support-a müraciət edin
   - GoDaddy Support-a müraciət edin

