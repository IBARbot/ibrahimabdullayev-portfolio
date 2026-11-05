import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LAND_CARGO, LAND_PASSENGER } from '../flightData/worldLand'
import {
  BAKU,
  CARGO_ROUTES,
  PASSENGER_ROUTES,
  ROUTES_MAX_AGE_DAYS,
  ROUTES_UPDATED,
  type RoutePoint,
} from '../flightData/routes'
import { formatDate } from '../utils/formatDate'

type Mode = 'passenger' | 'cargo'

interface View {
  lon0: number
  lon1: number
  latTop: number
  latBottom: number
  land: string
  routes: RoutePoint[]
}

const W = 1000

const VIEWS: Record<Mode, View> = {
  passenger: { lon0: -4, lon1: 92, latTop: 66, latBottom: 18, land: LAND_PASSENGER, routes: PASSENGER_ROUTES },
  cargo: { lon0: -10, lon1: 150, latTop: 66, latBottom: 16, land: LAND_CARGO, routes: CARGO_ROUTES },
}

function heightOf(v: View): number {
  return Math.round((W * (v.latTop - v.latBottom)) / (v.lon1 - v.lon0))
}

function project(v: View, lon: number, lat: number): [number, number] {
  return [((lon - v.lon0) / (v.lon1 - v.lon0)) * W, ((v.latTop - lat) / (v.latTop - v.latBottom)) * heightOf(v)]
}

// Böyük dairə məsafəsi (km), yalnız məlumat üçün təxmini
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = Math.PI / 180
  const dLat = (lat2 - lat1) * rad
  const dLon = (lon2 - lon1) * rad
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function RouteMap() {
  const { t, i18n } = useTranslation()
  const [mode, setMode] = useState<Mode>('passenger')
  const [selected, setSelected] = useState<string | null>(null)

  // Məlumat köhnələndə xəritə özü gizlənir: ləğv olunmuş və ya dəyişmiş xətt sayta qalmasın
  const fresh = useMemo(() => {
    const updated = new Date(`${ROUTES_UPDATED}T00:00:00Z`).getTime()
    if (Number.isNaN(updated)) return false
    return Date.now() - updated <= ROUTES_MAX_AGE_DAYS * 24 * 60 * 60 * 1000
  }, [])

  const lang = i18n.language === 'ru' ? 'ru' : i18n.language === 'en' ? 'en' : 'az'
  const view = VIEWS[mode]
  const H = heightOf(view)

  const arcs = useMemo(() => {
    const [bx, by] = project(view, BAKU.lon, BAKU.lat)
    return view.routes.map((r) => {
      const [x, y] = project(view, r.lon, r.lat)
      const dist = Math.hypot(x - bx, y - by)
      const cx = (x + bx) / 2
      const cy = (y + by) / 2 - dist * 0.22
      return {
        key: r.key,
        x,
        y,
        d: `M${bx.toFixed(1)},${by.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`,
      }
    })
  }, [view])

  if (!fresh) return null

  const [bx, by] = project(view, BAKU.lon, BAKU.lat)
  const current = view.routes.find((r) => r.key === selected) ?? null
  const currentArc = arcs.find((a) => a.key === selected) ?? null

  const switchMode = (next: Mode) => {
    setMode(next)
    setSelected(null)
  }
  const toggle = (key: string) => setSelected((s) => (s === key ? null : key))

  const segBase =
    'px-4 py-2 rounded-full text-sm font-semibold transition-colors touch-manipulation min-h-[40px]'

  return (
    <section id="routes" className="max-w-xl mx-auto px-5 pt-12">
      <h2 className="text-xs font-semibold tracking-wider uppercase text-gray-500">{t('home.routes.title')}</h2>
      <p className="mt-1 text-xs text-gray-400">
        {t('home.routes.updated', { date: formatDate(ROUTES_UPDATED, i18n.language) })}
      </p>

      <div
        role="group"
        aria-label={t('home.routes.title')}
        className="mt-3 inline-flex gap-1 p-1 rounded-full bg-gray-100 border border-gray-200"
      >
        {(['passenger', 'cargo'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            aria-pressed={mode === m}
            className={`${segBase} ${mode === m ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {t(`home.routes.${m}`)}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-2xl bg-white border border-gray-200 p-2.5">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={t('home.routes.title')}
          className={`w-full h-auto block ${mode === 'cargo' ? 'text-amber-600' : 'text-primary-600'}`}
        >
          <path d={view.land} className="route-land" />
          {arcs.map((a) => {
            const active = a.key === selected
            const dim = selected !== null && !active
            return (
              <g key={a.key} style={{ transition: 'opacity .25s' }} opacity={dim ? 0.15 : 1}>
                <path
                  d={a.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={active ? 2.6 : 1.4}
                  strokeLinecap="round"
                  opacity={active ? 1 : 0.75}
                  className={active ? '' : 'route-arc'}
                />
                {/* Nöqtə toxunmaq üçün böyük görünməz dairə ilə əhatə olunub */}
                <circle cx={a.x} cy={a.y} r={active ? 6 : 3.4} fill="currentColor" />
                <circle
                  cx={a.x}
                  cy={a.y}
                  r="16"
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => toggle(a.key)}
                />
              </g>
            )
          })}
          {current && currentArc && (
            <text
              x={Math.min(Math.max(currentArc.x, 60), W - 60)}
              y={Math.max(currentArc.y - 14, 18)}
              textAnchor="middle"
              className="route-label"
            >
              {current[lang]}
            </text>
          )}
          <circle cx={bx} cy={by} r="5" className="route-hub" />
          <circle cx={bx} cy={by} r="5" fill="none" strokeWidth="1.5" className="route-hub-ring motion-reduce:hidden">
            <animate attributeName="r" values="5;16" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </svg>

        <p className="px-1 pt-2 text-sm text-gray-700 min-h-[1.75rem]" aria-live="polite">
          {current ? (
            <>
              <span className="font-semibold">{t('home.routes.baku')} → {current[lang]}</span>
              <span className="text-gray-400">
                {' · ≈'}
                {Math.round(distanceKm(BAKU.lat, BAKU.lon, current.lat, current.lon) / 10) * 10} {t('home.routes.km')}
              </span>
            </>
          ) : (
            <span className="text-gray-400">{t('home.routes.hint')}</span>
          )}
        </p>

        <ul className="flex flex-wrap gap-1.5 px-1 pt-1 pb-1">
          {view.routes.map((r) => {
            const on = r.key === selected
            return (
              <li key={r.key}>
                <button
                  type="button"
                  onClick={() => toggle(r.key)}
                  aria-pressed={on}
                  className={`text-xs sm:text-[13px] rounded-full px-3 py-1.5 border transition-colors touch-manipulation ${
                    on
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'
                  }`}
                >
                  {r[lang]}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-gray-400">{t('home.routes.note')}</p>
    </section>
  )
}
