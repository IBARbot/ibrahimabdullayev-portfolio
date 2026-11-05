// Bakıdan uzun müddətdir mövcud olan, əsas istiqamətlər. Yeni istiqamət əlavə etmək üçün bura sətir əlavə edin.
// Məlumat tarixini hər yeniləmədə dəyişin: 14 gündən köhnə olarsa, xəritə səhifədə avtomatik gizlənir.
export const ROUTES_UPDATED = '2026-11-05'
export const ROUTES_MAX_AGE_DAYS = 14

export interface ViaPoint {
  az: string
  en: string
  ru: string
  lat: number
  lon: number
}

export interface RoutePoint {
  key: string
  az: string
  en: string
  ru: string
  lat: number
  lon: number
  // Aralıq dayanacaq (məs. Urumçi üzərindən) və ya Bakı olmayan çıxış nöqtəsi
  via?: ViaPoint
  from?: 'ganja'
}

export const BAKU = { lat: 40.41, lon: 49.87 }
export const GANJA = { lat: 40.74, lon: 46.32 }

export const PASSENGER_ROUTES: RoutePoint[] = [
  { key: 'nakhchivan', az: 'Naxçıvan', en: 'Nakhchivan', ru: 'Нахичевань', lat: 39.2, lon: 45.41 },
  { key: 'istanbul', az: 'İstanbul', en: 'Istanbul', ru: 'Стамбул', lat: 41.0, lon: 28.98 },
  { key: 'ankara', az: 'Ankara', en: 'Ankara', ru: 'Анкара', lat: 39.93, lon: 32.86 },
  { key: 'antalya', az: 'Antalya', en: 'Antalya', ru: 'Анталья', lat: 36.9, lon: 30.8 },
  { key: 'izmir', az: 'İzmir', en: 'Izmir', ru: 'Измир', lat: 38.29, lon: 27.15 },
  { key: 'tbilisi', az: 'Tbilisi', en: 'Tbilisi', ru: 'Тбилиси', lat: 41.69, lon: 44.8 },
  { key: 'moscow', az: 'Moskva', en: 'Moscow', ru: 'Москва', lat: 55.75, lon: 37.62 },
  { key: 'stpetersburg', az: 'Sankt-Peterburq', en: 'St. Petersburg', ru: 'Санкт-Петербург', lat: 59.93, lon: 30.34 },
  { key: 'dubai', az: 'Dubay', en: 'Dubai', ru: 'Дубай', lat: 25.2, lon: 55.27 },
  { key: 'sharjah', az: 'Şarcə', en: 'Sharjah', ru: 'Шарджа', lat: 25.35, lon: 55.4 },
  { key: 'abudhabi', az: 'Əbu-Dabi', en: 'Abu Dhabi', ru: 'Абу-Даби', lat: 24.43, lon: 54.65 },
  { key: 'telaviv', az: 'Tel-Əviv', en: 'Tel Aviv', ru: 'Тель-Авив', lat: 32.08, lon: 34.78 },
  { key: 'tashkent', az: 'Daşkənd', en: 'Tashkent', ru: 'Ташкент', lat: 41.3, lon: 69.24 },
  { key: 'almaty', az: 'Almatı', en: 'Almaty', ru: 'Алматы', lat: 43.24, lon: 76.89 },
  { key: 'astana', az: 'Astana', en: 'Astana', ru: 'Астана', lat: 51.17, lon: 71.43 },
  { key: 'aktau', az: 'Aktau', en: 'Aktau', ru: 'Актау', lat: 43.65, lon: 51.15 },
  { key: 'budapest', az: 'Budapeşt', en: 'Budapest', ru: 'Будапешт', lat: 47.5, lon: 19.04 },
  { key: 'milan', az: 'Milan', en: 'Milan', ru: 'Милан', lat: 45.46, lon: 9.19 },
  { key: 'rome', az: 'Roma', en: 'Rome', ru: 'Рим', lat: 41.8, lon: 12.25 },
  { key: 'frankfurt', az: 'Frankfurt', en: 'Frankfurt', ru: 'Франкфурт', lat: 50.03, lon: 8.57 },
  { key: 'paris', az: 'Paris', en: 'Paris', ru: 'Париж', lat: 49.01, lon: 2.55 },
  { key: 'warsaw', az: 'Varşava', en: 'Warsaw', ru: 'Варшава', lat: 52.17, lon: 20.97 },
  { key: 'delhi', az: 'Dehli', en: 'Delhi', ru: 'Дели', lat: 28.61, lon: 77.21 },
  { key: 'jeddah', az: 'Cidda', en: 'Jeddah', ru: 'Джидда', lat: 21.54, lon: 39.17 },
  { key: 'beijing', az: 'Pekin', en: 'Beijing', ru: 'Пекин', lat: 40.08, lon: 116.58 },
  { key: 'urumqi', az: 'Urumçi', en: 'Urumqi', ru: 'Урумчи', lat: 43.91, lon: 87.47 },
  { key: 'guangzhou', az: 'Quançju (Urumçi üzərindən)', en: 'Guangzhou (via Urumqi)', ru: 'Гуанчжоу (через Урумчи)', lat: 23.39, lon: 113.3, via: { az: 'Urumçi', en: 'Urumqi', ru: 'Урумчи', lat: 43.91, lon: 87.47 } },
  { key: 'ganja-istanbul', az: 'İstanbul (Gəncədən)', en: 'Istanbul (from Ganja)', ru: 'Стамбул (из Гянджи)', lat: 41.26, lon: 28.74, from: 'ganja' },
  { key: 'ganja-moscow', az: 'Moskva (Gəncədən)', en: 'Moscow (from Ganja)', ru: 'Москва (из Гянджи)', lat: 55.75, lon: 37.62, from: 'ganja' },
]

// Karqo: yük aviaşirkətlərinin xətləri. Dəyişdirmək üçün bu siyahını redaktə edin.
export const CARGO_ROUTES: RoutePoint[] = [
  { key: 'luxembourg', az: 'Lüksemburq', en: 'Luxembourg', ru: 'Люксембург', lat: 49.62, lon: 6.21 },
  { key: 'liege', az: 'Liej', en: 'Liège', ru: 'Льеж', lat: 50.64, lon: 5.44 },
  { key: 'hahn', az: 'Hahn (Frankfurt-Hahn)', en: 'Hahn (Frankfurt-Hahn)', ru: 'Хан (Франкфурт-Хан)', lat: 49.95, lon: 7.26 },
  { key: 'tianjin', az: 'Tyantszin', en: 'Tianjin', ru: 'Тяньцзинь', lat: 39.34, lon: 117.36 },
  { key: 'osaka', az: 'Osaka', en: 'Osaka', ru: 'Осака', lat: 34.43, lon: 135.23 },
  { key: 'tokyo', az: 'Tokio', en: 'Tokyo', ru: 'Токио', lat: 35.77, lon: 140.39 },
  { key: 'losangeles', az: 'Los-Anceles', en: 'Los Angeles', ru: 'Лос-Анджелес', lat: 33.94, lon: -118.41 },
]
