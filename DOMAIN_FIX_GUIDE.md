# Domain Probleminin Həlli - Təlimat

## Problem
Domain-lər (`ibrahimabdullayev.com` və `www.ibrahimabdullayev.com`) köhnə məlumatları göstərir, yeni proyekt canlı görünmür.

## Səbəblər və Həll Yolları

### 1. DNS Qeydlərinin Yoxlanılması

**Vercel-də DNS qeydləri:**
1. Vercel Dashboard → Project Settings → Domains
2. `ibrahimabdullayev.com` və `www.ibrahimabdullayev.com` üçün "View DNS Records" linkinə klikləyin
3. Aşağıdakı qeydlərin olmasını yoxlayın:

**DNS Qeydləri (Domain Provider-də):**
```
Type: A
Name: @ (və ya ibrahimabdullayev.com)
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Və ya Vercel-in təklif etdiyi qeydlər:**
- Vercel-də hər domain üçün "View DNS Records" bölməsində dəqiq qeydləri görəcəksiniz
- Bu qeydləri domain provider-inizdə (GoDaddy, Namecheap, və s.) düzgün konfiqurasiya edin

### 2. Domain Konfiqurasiyasının Yoxlanılması

**Vercel Dashboard-da:**
1. Project → Settings → Domains
2. Hər domain üçün:
   - **Status:** "Valid Configuration" olmalıdır
   - **Environment:** "Production" seçilməlidir
   - **Redirect:** Yalnız `ibrahimabdullayev.com` → `www.ibrahimabdullayev.com` redirect olmalıdır

**Düzgün konfiqurasiya:**
```
ibrahimabdullayev.com → Redirect (307) → www.ibrahimabdullayev.com
www.ibrahimabdullayev.com → Connect to Production
```

### 3. Deployment Status-un Yoxlanılması

1. Vercel Dashboard → Deployments
2. Son deployment-in status-u "Ready" olmalıdır
3. Əgər "Error" varsa, log-lara baxın və düzəldin
4. Yeni deployment başlatmaq üçün:
   - GitHub-da yeni commit push edin
   - Veya Vercel Dashboard-da "Redeploy" düyməsinə basın

### 4. Cache Probleminin Həlli

**Browser Cache:**
- Hard Refresh: `Ctrl + Shift + R` (Windows) və ya `Cmd + Shift + R` (Mac)
- Incognito/Private Mode-da test edin
- Fərqli browser-də test edin

**DNS Cache:**
- DNS cache-i təmizləmək:
  ```bash
  # Windows
  ipconfig /flushdns
  
  # Mac/Linux
  sudo dscacheutil -flushcache
  sudo killall -HUP mDNSResponder
  ```

### 5. Domain Provider-də Yoxlama

**Domain Provider Dashboard-da (GoDaddy, Namecheap, və s.):**
1. DNS Management bölməsinə keçin
2. Aşağıdakı qeydlərin olmasını yoxlayın:
   - A Record: `@` → `76.76.21.21` (Vercel-in IP-si)
   - CNAME: `www` → `cname.vercel-dns.com`
3. Köhnə qeydləri silin (əgər varsa)
4. TTL dəyərini minimuma endirin (300 saniyə)

### 6. Vercel-də Domain-ləri Yenidən Bağlamaq

**Əgər yuxarıdakı addımlar işləmirsə:**

1. **Domain-ləri silin:**
   - Vercel Dashboard → Settings → Domains
   - Hər domain üçün "Remove" düyməsinə basın

2. **Domain-ləri yenidən əlavə edin:**
   - "Add Domain" düyməsinə basın
   - `ibrahimabdullayev.com` əlavə edin → "Redirect to Another Domain" seçin → `www.ibrahimabdullayev.com` yazın
   - `www.ibrahimabdullayev.com` əlavə edin → "Connect to Production" seçin

3. **DNS qeydlərini yeniləyin:**
   - Vercel-də göstərilən DNS qeydlərini domain provider-də yeniləyin

### 7. Deployment-i Məcburi Yeniləmək

**GitHub-da:**
```bash
git commit --allow-empty -m "Force redeploy"
git push
```

**Veya Vercel Dashboard-da:**
- Deployments → Son deployment → "Redeploy" düyməsi

## Test Addımları

1. **DNS Propagation Yoxlama:**
   - https://dnschecker.org/ istifadə edin
   - `ibrahimabdullayev.com` və `www.ibrahimabdullayev.com` üçün DNS qeydlərini yoxlayın

2. **Domain Status Yoxlama:**
   - Vercel Dashboard → Settings → Domains
   - Hər domain üçün "Valid Configuration" status-unu yoxlayın

3. **Browser-də Test:**
   - Incognito mode-da test edin
   - Fərqli browser-də test edin
   - Fərqli cihazda test edin

## Əlavə Məlumat

- **DNS Propagation:** 24-48 saat çəkə bilər
- **Vercel Cache:** 5-10 dəqiqə çəkə bilər
- **Browser Cache:** Hard refresh ilə dərhal təmizlənir

## Dəstək

Əgər problem davam edərsə:
1. Vercel Support-a müraciət edin
2. Domain provider-in dəstək xidmətinə müraciət edin
3. DNS qeydlərini iki dəfə yoxlayın

