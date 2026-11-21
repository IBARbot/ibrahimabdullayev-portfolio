// Bakıdan uzun müddətdir mövcud olan, əsas istiqamətlər. Yeni istiqamət əlavə etmək üçün bura sətir əlavə edin.
// Məlumat tarixini siyahını yenilədikdə dəyişin (saytda "Məlumat tarixi" kimi göstərilir).
export const ROUTES_UPDATED = '2026-11-21'

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
  { key: 'yekaterinburg', az: 'Yekaterinburq', en: 'Yekaterinburg', ru: 'Екатеринбург', lat: 56.74, lon: 60.8 },
  { key: 'novosibirsk', az: 'Novosibirsk', en: 'Novosibirsk', ru: 'Новосибирск', lat: 55.01, lon: 82.65 },
  { key: 'astrakhan', az: 'Həştərxan', en: 'Astrakhan', ru: 'Астрахань', lat: 46.28, lon: 48.01 },
  { key: 'krasnoyarsk', az: 'Krasnoyarsk', en: 'Krasnoyarsk', ru: 'Красноярск', lat: 56.17, lon: 92.49 },
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

// Karqo: Silk Way West cədvəli, Atlas Air və Cargolux Bakı uçuşları (noyabr 2026) + əvvəlki siyahı.
export const CARGO_ROUTES: RoutePoint[] = [
  { key: 'luxembourg', az: 'Lüksemburq', en: 'Luxembourg', ru: 'Люксембург', lat: 49.62, lon: 6.21 },
  { key: 'liege', az: 'Liej', en: 'Liège', ru: 'Льеж', lat: 50.64, lon: 5.44 },
  { key: 'hahn', az: 'Hahn (Frankfurt-Hahn)', en: 'Hahn (Frankfurt-Hahn)', ru: 'Хан (Франкфурт-Хан)', lat: 49.95, lon: 7.26 },
  { key: 'amsterdam', az: 'Amsterdam', en: 'Amsterdam', ru: 'Амстердам', lat: 52.31, lon: 4.76 },
  { key: 'madrid', az: 'Madrid', en: 'Madrid', ru: 'Мадрид', lat: 40.47, lon: -3.56 },
  { key: 'milan', az: 'Milan', en: 'Milan', ru: 'Милан', lat: 45.63, lon: 8.72 },
  { key: 'zaragoza', az: 'Saraqosa', en: 'Zaragoza', ru: 'Сарагоса', lat: 41.67, lon: -1.04 },
  { key: 'london', az: 'London (Stansted)', en: 'London (Stansted)', ru: 'Лондон (Станстед)', lat: 51.89, lon: 0.24 },
  { key: 'birmingham', az: 'Birminhem', en: 'Birmingham', ru: 'Бирмингем', lat: 52.45, lon: -1.75 },
  { key: 'oslo', az: 'Oslo', en: 'Oslo', ru: 'Осло', lat: 60.19, lon: 11.1 },
  { key: 'vienna', az: 'Vyana', en: 'Vienna', ru: 'Вена', lat: 48.11, lon: 16.57 },
  { key: 'istanbul', az: 'İstanbul', en: 'Istanbul', ru: 'Стамбул', lat: 41.26, lon: 28.74 },
  { key: 'tbilisi', az: 'Tbilisi', en: 'Tbilisi', ru: 'Тбилиси', lat: 41.67, lon: 44.95 },
  { key: 'dubai', az: 'Dubay (DWC)', en: 'Dubai (DWC)', ru: 'Дубай (DWC)', lat: 24.9, lon: 55.16 },
  { key: 'dammam', az: 'Dammam', en: 'Dammam', ru: 'Даммам', lat: 26.47, lon: 49.8 },
  { key: 'kuwait', az: 'Küveyt', en: 'Kuwait', ru: 'Кувейт', lat: 29.24, lon: 47.97 },
  { key: 'telaviv', az: 'Tel-Əviv', en: 'Tel Aviv', ru: 'Тель-Авив', lat: 32.01, lon: 34.89 },
  { key: 'erbil', az: 'Ərbil', en: 'Erbil', ru: 'Эрбиль', lat: 36.24, lon: 43.96 },
  { key: 'basra', az: 'Bəsrə', en: 'Basra', ru: 'Басра', lat: 30.55, lon: 47.66 },
  { key: 'baghdad', az: 'Bağdad', en: 'Baghdad', ru: 'Багдад', lat: 33.26, lon: 44.23 },
  { key: 'aktau', az: 'Aktau', en: 'Aktau', ru: 'Актау', lat: 43.86, lon: 51.09 },
  { key: 'atyrau', az: 'Atırau', en: 'Atyrau', ru: 'Атырау', lat: 47.12, lon: 51.82 },
  { key: 'tashkent', az: 'Daşkənd', en: 'Tashkent', ru: 'Ташкент', lat: 41.26, lon: 69.28 },
  { key: 'bishkek', az: 'Bişkek', en: 'Bishkek', ru: 'Бишкек', lat: 43.06, lon: 74.48 },
  { key: 'almaty', az: 'Almatı', en: 'Almaty', ru: 'Алматы', lat: 43.35, lon: 77.04 },
  { key: 'karaganda', az: 'Qaraqanda', en: 'Karaganda', ru: 'Караганда', lat: 49.67, lon: 73.33 },
  { key: 'delhi', az: 'Dehli', en: 'Delhi', ru: 'Дели', lat: 28.56, lon: 77.1 },
  { key: 'mumbai', az: 'Mumbay', en: 'Mumbai', ru: 'Мумбаи', lat: 19.09, lon: 72.87 },
  { key: 'dhaka', az: 'Dəkkə', en: 'Dhaka', ru: 'Дакка', lat: 23.84, lon: 90.4 },
  { key: 'hongkong', az: 'Honkonq', en: 'Hong Kong', ru: 'Гонконг', lat: 22.31, lon: 113.92 },
  { key: 'zhengzhou', az: 'Çjençjou', en: 'Zhengzhou', ru: 'Чжэнчжоу', lat: 34.52, lon: 113.84 },
  { key: 'shanghai', az: 'Şanxay', en: 'Shanghai', ru: 'Шанхай', lat: 31.14, lon: 121.81 },
  { key: 'tianjin', az: 'Tyantszin', en: 'Tianjin', ru: 'Тяньцзинь', lat: 39.34, lon: 117.36 },
  { key: 'seoul', az: 'Seul', en: 'Seoul', ru: 'Сеул', lat: 37.46, lon: 126.44 },
  { key: 'taipei', az: 'Taybey', en: 'Taipei', ru: 'Тайбэй', lat: 25.08, lon: 121.23 },
  { key: 'osaka', az: 'Osaka', en: 'Osaka', ru: 'Осака', lat: 34.43, lon: 135.23 },
  { key: 'tokyo', az: 'Tokio', en: 'Tokyo', ru: 'Токио', lat: 35.77, lon: 140.39 },
  { key: 'singapore', az: 'Sinqapur', en: 'Singapore', ru: 'Сингапур', lat: 1.36, lon: 103.99 },
  { key: 'chicago', az: 'Çikaqo', en: 'Chicago', ru: 'Чикаго', lat: 41.98, lon: -87.9 },
  { key: 'newyork', az: 'Nyu-York', en: 'New York', ru: 'Нью-Йорк', lat: 40.64, lon: -73.78 },
  { key: 'houston', az: 'Hyuston', en: 'Houston', ru: 'Хьюстон', lat: 29.98, lon: -95.34 },
  { key: 'losangeles', az: 'Los-Anceles', en: 'Los Angeles', ru: 'Лос-Анджелес', lat: 33.94, lon: -118.41 },
]
