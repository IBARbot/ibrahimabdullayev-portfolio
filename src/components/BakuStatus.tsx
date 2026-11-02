import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const TIME_ZONE = 'Asia/Baku'
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

function readBakuTime() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0') % 24
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'
  return { hour, label: `${String(hour).padStart(2, '0')}:${minute}` }
}

export default function BakuStatus() {
  const { t } = useTranslation()
  const [now, setNow] = useState(readBakuTime)

  useEffect(() => {
    const id = window.setInterval(() => setNow(readBakuTime()), 30000)
    return () => window.clearInterval(id)
  }, [])

  const status = getAvailability(now.hour)

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-white/80 border border-gray-200 shadow-sm text-xs sm:text-sm text-gray-700">
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        {status === 'instant' && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping motion-reduce:hidden" />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${DOT_COLOR[status]}`} />
      </span>
      <span>{t(`hero.status.${status}`)}</span>
      <span className="text-gray-300" aria-hidden="true">|</span>
      <span className="tabular-nums text-gray-500">
        {now.label} {t('hero.status.time')}
      </span>
    </div>
  )
}
