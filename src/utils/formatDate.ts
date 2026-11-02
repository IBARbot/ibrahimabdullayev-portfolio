const LOCALES: Record<string, string> = { az: 'az-AZ', en: 'en-GB', ru: 'ru-RU' }

// Tarixi seçilmiş dilə uyğun yazır (məs. "1 mart 2022"); oxunmayan dəyər olduğu kimi qaytarılır
export function formatDate(value: string, language: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const locale = LOCALES[language.slice(0, 2)] ?? 'en-GB'
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}
