# Google Analytics Quraşdırma Təlimatı

## Məqsəd

`ibrahimabdullayev.com` və `ibrahimabdullayev.az` üçün yeni Google Analytics property yaratmaq.

## Addımlar

### 1. Google Analytics-ə Daxil Olun

1. https://analytics.google.com-a daxil olun
2. Sizin hesabınızda `alobilet.az` property-si görünür (bu qalsın)

### 2. Yeni Property Yaradın

1. Sol aşağıda **"Admin"** (⚙️) düyməsinə basın
2. **"Property"** sütununda **"Create Property"** düyməsinə basın

### 3. Property Məlumatlarını Doldurun

**Property name:**
```
İbrahim Abdullayev Portfolio
```

**Reporting time zone:**
```
(GMT+04:00) Baku
```

**Currency:**
```
USD (və ya AZN)
```

**"Next"** düyməsinə basın

### 4. Business Information

**Industry category:**
```
Travel & Tourism
```

**Business size:**
```
Small (1-10 employees)
```

**"Next"** düyməsinə basın

### 5. Business Objectives

Aşağıdakıları seçin:
- ✅ Generate leads
- ✅ Drive online sales
- ✅ Raise brand awareness

**"Create"** düyməsinə basın

### 6. Data Streams Yaratmaq

**Web stream əlavə edin:**

1. **"Add stream"** → **"Web"** seçin

2. **Website URL:**
```
https://ibrahimabdullayev.com
```

3. **Stream name:**
```
ibrahimabdullayev.com & .az
```

4. **"Create stream"** düyməsinə basın

### 7. Measurement ID Alın

1. Stream yaradıldıqdan sonra **"Measurement ID"** görünəcək
2. Format: `G-XXXXXXXXXX`
3. Bu ID-ni kopyalayın

### 8. Vercel Environment Variable Əlavə Edin

1. **Vercel Dashboard** → **ibrahimabdullayev-portfolio** → **Settings** → **Environment Variables**

2. Yeni variable əlavə edin:
   - **Name:** `VITE_GOOGLE_ANALYTICS_ID`
   - **Value:** `G-XXXXXXXXXX` (sizin Measurement ID)
   - **Environment:** Production, Preview, Development (hamısını seçin)

3. **"Save"** düyməsinə basın

4. **Redeploy** edin:
   - **Deployments** → Son deployment → **"..."** → **"Redeploy"**

### 9. Yoxlama

1. Deployment tamamlandıqdan sonra saytınızı açın
2. Bir neçə səhifəyə keçin
3. Google Analytics-də **"Reports"** → **"Realtime"** bölməsinə baxın
4. Real-time istifadəçiləri görməlisiniz

## Qeyd

- `alobilet.az` property-si olduğu kimi qalacaq
- Yeni property yalnız `ibrahimabdullayev.com` və `ibrahimabdullayev.az` üçündür
- Hər iki domain eyni property-də işləyəcək (çünki eyni saytdır)

## Troubleshooting

**Problem:** Measurement ID işləmir
- **Həll:** Environment variable-ın düzgün əlavə olunduğunu və redeploy edildiyini yoxlayın

**Problem:** Real-time data görünmür
- **Həll:** Bir neçə dəqiqə gözləyin, bəzən gecikmə ola bilər





