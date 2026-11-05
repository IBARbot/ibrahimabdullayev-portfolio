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

const RING_COLOR: Record<Availability, string> = {
  instant: 'ring-green-500/25',
  soon: 'ring-amber-400/25',
  later: 'ring-gray-400/25',
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
  const [tip, setTip] = useState(false)

  // Saniyədə bir yenilənir
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const bakuTime = timeIn(BAKU_TZ, now, true)
  const bakuHour = Number(bakuTime.slice(0, 2)) % 24
  const status = getAvailability(bakuHour)
  const bakuDay = dayKey(BAKU_TZ, now)

  const statusText = t(`hero.status.${status}`)

  return (
    <div className="mt-2 flex flex-col items-center">
      <div className="flex items-center gap-3.5">
        {/* Nöqtə: üzərinə gələndə və ya toxunanda vəziyyət mətni görünür */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => setTip((v) => !v)}
            onBlur={() => setTip(false)}
            aria-label={statusText}
            className="relative flex h-5 w-5 items-center justify-center rounded-full focus-visible:outline-2"
          >
            {status === 'instant' && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping motion-reduce:hidden" />
            )}
            <span className={`relative inline-flex rounded-full h-4 w-4 ring-4 ${RING_COLOR[status]} ${DOT_COLOR[status]}`} />
          </button>
          <span
            role="status"
            className={`pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg transition-opacity group-hover:opacity-100 ${
              tip ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {statusText}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? t('hero.clocks.hide') : t('hero.clocks.show')}
          className="inline-flex items-baseline gap-2 text-gray-900 hover:text-primary-600 transition-colors"
        >
          <span className="text-3xl sm:text-4xl font-semibold tabular-nums tracking-tight">{bakuTime}</span>
          <span className="text-sm text-gray-500">{t('hero.status.time')}</span>
          <ChevronDown
            className={`w-4 h-4 self-center text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
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
