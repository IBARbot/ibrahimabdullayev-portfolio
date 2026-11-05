import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LAND_CARGO, LAND_PASSENGER } from '../flightData/worldLand'
import {
  BAKU,
  CARGO_ROUTES,
  GANJA,
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
const MAX_ZOOM = 6

const VIEWS: Record<Mode, View> = {
  passenger: { lon0: -6, lon1: 122, latTop: 66, latBottom: 18, land: LAND_PASSENGER, routes: PASSENGER_ROUTES },
  cargo: { lon0: -130, lon1: 150, latTop: 66, latBottom: 14, land: LAND_CARGO, routes: CARGO_ROUTES },
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

interface Cam {
  x: number
  y: number
  z: number
}

const short = (s: string) => s.replace(/\s*\(.*\)\s*$/, '')

export default function RouteMap() {
  const { t, i18n } = useTranslation()
  const [mode, setMode] = useState<Mode>('passenger')
  const [selected, setSelected] = useState<string | null>(null)
  const [cam, setCam] = useState<Cam>({ x: 0, y: 0, z: 1 })
  const svgRef = useRef<SVGSVGElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{ dist: number; moved: boolean }>({ dist: 0, moved: false })

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
    const seg = (x1: number, y1: number, x2: number, y2: number) => {
      const dist = Math.hypot(x2 - x1, y2 - y1)
      const cx = (x1 + x2) / 2
      const cy = (y1 + y2) / 2 - dist * 0.22
      return `Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`
    }
    return view.routes.map((r) => {
      const origin = r.from === 'ganja' ? GANJA : BAKU
      const [ox, oy] = project(view, origin.lon, origin.lat)
      const [x, y] = project(view, r.lon, r.lat)
      let d = `M${ox.toFixed(1)},${oy.toFixed(1)} `
      let via: [number, number] | null = null
      if (r.via) {
        const [vx, vy] = project(view, r.via.lon, r.via.lat)
        via = [vx, vy]
        d += `${seg(ox, oy, vx, vy)} ${seg(vx, vy, x, y)}`
      } else {
        d += seg(ox, oy, x, y)
      }
      return { key: r.key, x, y, d, via }
    })
  }, [view])

  if (!fresh) return null

  const k = 1 / cam.z // ekran vahidində sabit ölçü üçün
  const vbW = W * k
  const vbH = H * k
  const [bx, by] = project(view, BAKU.lon, BAKU.lat)
  const [gx, gy] = project(view, GANJA.lon, GANJA.lat)
  const hasGanja = view.routes.some((r) => r.from === 'ganja')
  const current = view.routes.find((r) => r.key === selected) ?? null
  const currentArc = arcs.find((a) => a.key === selected) ?? null

  const clamp = (c: Cam): Cam => {
    const z = Math.min(MAX_ZOOM, Math.max(1, c.z))
    return {
      z,
      // Kənarlara bir qədər boşluqla sərbəst sürüşdürmə
      x: Math.min(Math.max(c.x, -0.35 * (W / z)), W - 0.65 * (W / z)),
      y: Math.min(Math.max(c.y, -0.35 * (H / z)), H - 0.65 * (H / z)),
    }
  }
  const zoomBy = (factor: number, fx = 0.5, fy = 0.5) =>
    setCam((c) => {
      const z = Math.min(MAX_ZOOM, Math.max(1, c.z * factor))
      // Mərkəz nöqtəsi yerində qalsın
      const px = c.x + (W / c.z) * fx
      const py = c.y + (H / c.z) * fy
      return clamp({ z, x: px - (W / z) * fx, y: py - (H / z) * fy })
    })

  const switchMode = (next: Mode) => {
    setMode(next)
    setSelected(null)
    setCam({ x: 0, y: 0, z: 1 })
  }
  const toggle = (key: string) => {
    if (gesture.current.moved) return
    if (key === selected) {
      setSelected(null)
      setCam({ x: 0, y: 0, z: 1 })
      return
    }
    setSelected(key)
    // Çıxış və təyinat şəhərini birlikdə ortalayan görünüş
    const a = arcs.find((x) => x.key === key)
    const route = view.routes.find((x) => x.key === key)
    if (a && route) {
      const o = route.from === 'ganja' ? GANJA : BAKU
      const [ox, oy] = project(view, o.lon, o.lat)
      const pts: [number, number][] = [[ox, oy], [a.x, a.y]]
      if (a.via) pts.push(a.via)
      const xs = pts.map((q) => q[0])
      const ys = pts.map((q) => q[1])
      const minX = Math.min(...xs)
      const maxX = Math.max(...xs)
      const minY = Math.min(...ys)
      const maxY = Math.max(...ys)
      const padX = 0.2
      const bw = Math.max(maxX - minX, 40) / (1 - 2 * padX)
      const bh = Math.max(maxY - minY, 25) / (1 - 2 * padX)
      const z = Math.min(MAX_ZOOM, Math.max(1, Math.min(W / bw, H / bh)))
      const cx = (minX + maxX) / 2
      // Qövs yuxarı əyildiyi üçün mərkəzi bir qədər yuxarı çəkirik
      const cy = (minY + maxY) / 2 - (maxX - minX) * 0.05
      setCam(clamp({ z, x: cx - W / z / 2, y: cy - H / z / 2 }))
    }
  }
  }

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    gesture.current.moved = false
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      gesture.current.dist = Math.hypot(a.x - b.x, a.y - b.y)
    }
  }
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const next = { x: e.clientX, y: e.clientY }
    if (pointers.current.size === 1) {
      const dx = next.x - prev.x
      const dy = next.y - prev.y
      if (Math.abs(dx) + Math.abs(dy) > 0) {
        if (!gesture.current.moved && Math.abs(dx) + Math.abs(dy) < 2) return
        if (!gesture.current.moved) {
          try {
            e.currentTarget.setPointerCapture(e.pointerId)
          } catch {
            /* ignore */
          }
        }
        gesture.current.moved = true
        pointers.current.set(e.pointerId, next)
        const scale = W / cam.z / rect.width
        setCam((c) => clamp({ ...c, x: c.x - dx * scale, y: c.y - dy * scale }))
      }
    } else if (pointers.current.size === 2) {
      pointers.current.set(e.pointerId, next)
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      if (gesture.current.dist > 0 && dist > 0) {
        gesture.current.moved = true
        const fx = Math.min(1, Math.max(0, ((a.x + b.x) / 2 - rect.left) / rect.width))
        const fy = Math.min(1, Math.max(0, ((a.y + b.y) / 2 - rect.top) / rect.height))
        zoomBy(dist / gesture.current.dist, fx, fy)
      }
      gesture.current.dist = dist
    }
  }
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId)
    gesture.current.dist = 0
    // Klik hadisəsi bitdikdən sonra bayraq sıfırlansın
    setTimeout(() => {
      gesture.current.moved = false
    }, 0)
  }

  const segBase =
    'px-4 py-2 rounded-full text-sm font-semibold transition-colors touch-manipulation min-h-[40px]'
  const zoomBtn =
    'w-9 h-9 rounded-full bg-white/90 border border-gray-200 text-gray-700 text-lg leading-none font-semibold hover:border-primary-300 disabled:opacity-40 touch-manipulation'

  const originName = (r: RoutePoint) => (r.from === 'ganja' ? t('home.routes.ganja') : t('home.routes.baku'))
  const total = (r: RoutePoint) => {
    const o = r.from === 'ganja' ? GANJA : BAKU
    return r.via
      ? distanceKm(o.lat, o.lon, r.via.lat, r.via.lon) + distanceKm(r.via.lat, r.via.lon, r.lat, r.lon)
      : distanceKm(o.lat, o.lon, r.lat, r.lon)
  }

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
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`${cam.x.toFixed(1)} ${cam.y.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`}
            role="img"
            aria-label={t('home.routes.title')}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ touchAction: cam.z > 1 ? 'none' : 'pan-y' }}
            className={`w-full h-auto block rounded-xl select-none ${cam.z > 1 ? 'cursor-grab' : ''} ${
              mode === 'cargo' ? 'text-amber-600' : 'text-primary-600'
            }`}
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
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    opacity={active ? 1 : 0.75}
                    className={active ? '' : 'route-arc'}
                  />
                  {a.via && (
                    <circle
                      cx={a.via[0]}
                      cy={a.via[1]}
                      r={3.4 * k}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  <circle cx={a.x} cy={a.y} r={(active ? 6 : 3.4) * k} fill="currentColor" />
                  {/* Toxunmaq üçün böyük görünməz dairə */}
                  <circle
                    cx={a.x}
                    cy={a.y}
                    r={16 * k}
                    fill="transparent"
                    className="cursor-pointer"
                    onClick={() => toggle(a.key)}
                  />
                </g>
              )
            })}
            {current && currentArc && (
              <text
                x={Math.min(Math.max(currentArc.x, cam.x + 60 * k), cam.x + vbW - 60 * k)}
                y={Math.max(currentArc.y - 14 * k, cam.y + 18 * k)}
                textAnchor="middle"
                className="route-label"
                style={{ fontSize: 26 * k, strokeWidth: 5 * k }}
              >
                {short(current[lang])}
              </text>
            )}
            {hasGanja && <circle cx={gx} cy={gy} r={3.6 * k} className="route-hub" />}
            <circle cx={bx} cy={by} r={5 * k} className="route-hub" />
            <circle cx={bx} cy={by} r={5 * k} fill="none" strokeWidth="1.5" className="route-hub-ring motion-reduce:hidden">
              <animate attributeName="r" values={`${5 * k};${16 * k}`} dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </svg>

          <div className="absolute right-2 bottom-2 flex flex-col gap-1.5">
            <button type="button" className={zoomBtn} onClick={() => zoomBy(1.6)} disabled={cam.z >= MAX_ZOOM} aria-label={t('home.routes.zoomIn')}>
              +
            </button>
            <button type="button" className={zoomBtn} onClick={() => zoomBy(1 / 1.6)} disabled={cam.z <= 1} aria-label={t('home.routes.zoomOut')}>
              −
            </button>
            {cam.z > 1 && (
              <button type="button" className={`${zoomBtn} text-sm`} onClick={() => setCam({ x: 0, y: 0, z: 1 })} aria-label={t('home.routes.zoomReset')}>
                ⟲
              </button>
            )}
          </div>
        </div>

        <p className="px-1 pt-2 text-sm text-gray-700 min-h-[1.75rem]" aria-live="polite">
          {current ? (
            <>
              <span className="font-semibold">
                {originName(current)} → {current.via ? `${current.via[lang]} → ` : ''}
                {short(current[lang])}
              </span>
              <span className="text-gray-400">
                {' · ≈'}
                {Math.round(total(current) / 10) * 10} {t('home.routes.km')}
              </span>
            </>
          ) : (
            <span className="text-gray-400">{t('home.routes.hint')} · {t('home.routes.zoomHint')}</span>
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
