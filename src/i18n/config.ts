import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import azTranslations from './locales/az.json'
import enTranslations from './locales/en.json'
import ruTranslations from './locales/ru.json'

// Dil detection prioriteti:
// 1. localStorage-dan seçilmiş dil
// 2. URL-dən dil parametri (?lang=az)
// 3. Browser dili
// 4. IP əsaslı ölkə (geolocation)
// 5. Default: az

const detectionOptions = {
  // Detection order
  order: ['localStorage', 'querystring', 'navigator', 'htmlTag'],
  
  // Keys to lookup language from
  lookupLocalStorage: 'i18nextLng',
  lookupQuerystring: 'lang',
  
  // Cache user language
  caches: ['localStorage'],
  
  // Exclude path from detection
  excludeCacheFor: ['cimode'],
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      az: { translation: azTranslations },
      en: { translation: enTranslations },
      ru: { translation: ruTranslations },
    },
    fallbackLng: 'az',
    defaultNS: 'translation',
    ns: 'translation',
    detection: detectionOptions,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: false,
    },
  })

// IP əsaslı ölkə detection (async)
export const detectCountryLanguage = async (): Promise<string | null> => {
  try {
    // Free geolocation API
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    if (data.country_code) {
      const countryCode = data.country_code.toLowerCase()
      
      // Ölkə koduna görə dil mapping
      const countryToLang: Record<string, string> = {
        'az': 'az', // Azerbaijan
        'tr': 'az', // Turkey (Azerbaijani speakers)
        'ru': 'ru', // Russia
        'by': 'ru', // Belarus
        'kz': 'ru', // Kazakhstan
        'kg': 'ru', // Kyrgyzstan
        'us': 'en', // USA
        'gb': 'en', // UK
        'ca': 'en', // Canada
        'au': 'en', // Australia
        // Daha çox ölkə əlavə edə bilərsiniz
      }
      
      return countryToLang[countryCode] || null
    }
  } catch (error) {
    console.error('Country detection error:', error)
  }
  
  return null
}

// Browser dili əsasında detection
export const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language || (navigator as any).userLanguage || 'az'
  
  // Browser dil kodunu i18n dil koduna çevir
  if (browserLang.startsWith('az')) return 'az'
  if (browserLang.startsWith('en')) return 'en'
  if (browserLang.startsWith('ru')) return 'ru'
  
  return 'az' // Default
}

// Dil seçimini tətbiq et
export const setLanguage = async (lang: 'az' | 'en' | 'ru') => {
  await i18n.changeLanguage(lang)
  localStorage.setItem('i18nextLng', lang)
  
  // URL-də dil parametrini yenilə
  const url = new URL(window.location.href)
  url.searchParams.set('lang', lang)
  window.history.replaceState({}, '', url.toString())
}

export default i18n

