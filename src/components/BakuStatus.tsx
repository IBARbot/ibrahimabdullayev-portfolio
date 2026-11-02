import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// Bakı vaxtı ilə cavab sürəti: 09:00–21:00 dərhal, 07:00–09:00 və 21:00–23:00 qısa müddətdə, gecə bir qədər sonra
type Availability = 'instant' | 'soon' | 'later'

function getAvailability(hour: number): Availability {
  if (hour >= 9 && hour < 21) return 'instant'
  if ((hour >= 7 && hour < 9) || (hour >= 21 && hour < 23)) return 'soon'
  return 'later'
}

const DOT_COLOR: Record<Availability, string> = {
  instant: 'bg-green-500',
  soon: 'bg-amber-400',
  later: 'bg-gray-400',
}

const BAKU_TZ = 'Asia/Baku'

const CITIES: { key: string; tz: string }[] = [
  { key: 'istanbul', tz: 'Europe/Istanbul' },
  { key: 'london', tz: 'Europe/London' },
  { key: 'moscow', tz: 'Europe/Moscow' },
  { key: 'beijing', tz: 'Asia/Shanghai' },
  { key: 'tokyo', tz: 'Asia/Tokyo' },
  { key: 'newyork', tz: 'America/New_York' },
]

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(tz: string, withSeconds: boolean): Intl.DateTimeFormat {
  const id = `${tz}|${withSeconds}`
  let f = formatterCache.get(id)
  if (!f) {
    f = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      ...(withSeconds ? { second: '2-digit' as const } : {}),
      hourCycle: 'h23',
    })
    formatterCache.set(id, f)
  }
  return f
}

function timeIn(tz: string, date: Date, withSeconds: boolean): string {
  return getFormatter(tz, withSeconds).format(date)
}

function dayKey(tz: string, date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(date)
}

export default function BakuStatus() {
  const { t } = useTranslation()
  const [now, setNow] = useState(() => new Date())
  const [open, setOpen] = useState(false)

  // Saniyədə bir yenilənir
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const bakuTime = timeIn(BAKU_TZ, now, true)
  const bakuHour = Number(bakuTime.slice(0, 2)) % 24
  const status = getAvailability(bakuHour)
  const bakuDay = dayKey(BAKU_TZ, now)

  return (
    <div className="mb-5 flex flex-col items-center md:items-start">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-gray-200 shadow-sm text-xs sm:text-sm text-gray-700">
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          {status === 'instant' && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping motion-reduce:hidden" />
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${DOT_COLOR[status]}`} />
        </span>
        <span>{t(`hero.status.${status}`)}</span>
        <span className="text-gray-300" aria-hidden="true">|</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? t('hero.clocks.hide') : t('hero.clocks.show')}
          className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors"
        >
          <span className="tabular-nums">
            {bakuTime} {t('hero.status.time')}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="mt-2 w-full max-w-md rounded-xl bg-white/90 border border-gray-200 shadow-sm p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">{t('hero.clocks.title')}</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CITIES.map(({ key, tz }) => {
              const dayDiff = dayKey(tz, now) !== bakuDay
              return (
                <li key={key} className="rounded-lg bg-gray-50 px-3 py-2 text-left">
                  <p className="text-xs text-gray-500">{t(`hero.clocks.${key}`)}</p>
                  <p className="text-sm font-semibold text-gray-900 tabular-nums">
                    {timeIn(tz, now, true)}
                    {dayDiff && (
                      <span className="ml-1 text-[10px] font-normal text-gray-400">
                        {dayKey(tz, now) > bakuDay ? '+1' : '−1'}
                      </span>
                    )}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
