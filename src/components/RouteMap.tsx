import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { WORLD_LAND_PATH } from '../flightData/worldLand'
import { BAKU, PASSENGER_ROUTES, ROUTES_MAX_AGE_DAYS, ROUTES_UPDATED } from '../flightData/routes'
import { formatDate } from '../utils/formatDate'

const W = 1000
const H = 500
const LON0 = -4
const LON1 = 92
const LAT_TOP = 66
const LAT_BOTTOM = 18

function project(lon: number, lat: number): [number, number] {
  return [((lon - LON0) / (LON1 - LON0)) * W, ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * H]
}

export default function RouteMap() {
  const { t, i18n } = useTranslation()

  // Məlumat köhnələndə xəritə özü gizlənir: ləğv olunmuş və ya dəyişmiş xətt sayta qalmasın
  const fresh = useMemo(() => {
    const updated = new Date(`${ROUTES_UPDATED}T00:00:00Z`).getTime()
    if (Number.isNaN(updated)) return false
    return Date.now() - updated <= ROUTES_MAX_AGE_DAYS * 24 * 60 * 60 * 1000
  }, [])

  const lang = i18n.language === 'ru' ? 'ru' : i18n.language === 'en' ? 'en' : 'az'

  const arcs = useMemo(() => {
    const [bx, by] = project(BAKU.lon, BAKU.lat)
    return PASSENGER_ROUTES.map((r) => {
      const [x, y] = project(r.lon, r.lat)
      const dist = Math.hypot(x - bx, y - by)
      const cx = (x + bx) / 2
      const cy = (y + by) / 2 - dist * 0.28
      return { key: r.key, x, y, d: `M${bx.toFixed(1)},${by.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}` }
    })
  }, [])

  if (!fresh) return null

  const [bx, by] = project(BAKU.lon, BAKU.lat)

  return (
    <section id="routes" className="max-w-xl mx-auto px-5 pt-12">
      <h2 className="text-xs font-semibold tracking-wider uppercase text-gray-500">{t('home.routes.title')}</h2>
      <p className="mt-1 text-xs text-gray-400">
        {t('home.routes.updated', { date: formatDate(ROUTES_UPDATED, i18n.language) })}
      </p>

      <div className="mt-3 rounded-2xl bg-white border border-gray-200 p-2.5">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={t('home.routes.title')}
          className="w-full h-auto block text-primary-600"
        >
          <path d={WORLD_LAND_PATH} className="route-land" />
          {arcs.map((a) => (
            <g key={a.key}>
              <path d={a.d} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" className="route-arc" />
              <circle cx={a.x} cy={a.y} r="3.2" fill="currentColor" />
            </g>
          ))}
          <circle cx={bx} cy={by} r="5" className="route-hub" />
          <circle cx={bx} cy={by} r="5" fill="none" strokeWidth="1.5" className="route-hub-ring motion-reduce:hidden">
            <animate attributeName="r" values="5;16" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </svg>

        <ul className="flex flex-wrap gap-1.5 px-1 pt-2 pb-1">
          {PASSENGER_ROUTES.map((r) => (
            <li key={r.key} className="text-xs sm:text-[13px] text-gray-700 border border-gray-200 rounded-full px-2.5 py-1">
              {r[lang]}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-gray-400">{t('home.routes.note')}</p>
    </section>
  )
}
