import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LAND_DOTS } from '../flightData/landDots'
import {
  BAKU,
  CARGO_ROUTES,
  GANJA,
  PASSENGER_ROUTES,
  ROUTES_UPDATED,
  type RoutePoint,
} from '../flightData/routes'
import { formatDate } from '../utils/formatDate'

type Mode = 'passenger' | 'cargo'
type Vec = [number, number, number]

const RAD = Math.PI / 180
const ZMIN = 0.7
const ZMAX = 4.5
const DOTS = LAND_DOTS.split(',').map(Number)
const short = (s: string) => s.replace(/\s*\(.*\)\s*$/, '')

const vec = (lat: number, lon: number): Vec => [
  Math.cos(lat * RAD) * Math.cos(lon * RAD),
  Math.cos(lat * RAD) * Math.sin(lon * RAD),
  Math.sin(lat * RAD),
]
const angle = (a: Vec, b: Vec) => Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
function slerp(a: Vec, b: Vec, t: number): Vec {
  const d = angle(a, b)
  if (d < 1e-6) return a
  const s = Math.sin(d)
  const k1 = Math.sin((1 - t) * d) / s
  const k2 = Math.sin(t * d) / s
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2]
}
const originOf = (r: RoutePoint) => (r.from === 'ganja' ? GANJA : BAKU)
const km = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) =>
  6371 * angle(vec(a.lat, a.lon), vec(b.lat, b.lon))

interface Cam {
  lon: number
  lat: number
  zoom: number
}

export default function RouteGlobe() {
  const { t, i18n } = useTranslation()
  const [mode, setMode] = useState<Mode>('passenger')
  const [selected, setSelected] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animasiya vəziyyəti React render-indən kənarda saxlanılır
  const st = useRef({
    rot: { lon: 50, lat: 30 } as { lon: number; lat: number },
    zoom: 1,
    base: 50,
    target: null as Cam | null,
    auto: true,
    dragging: false,
    vel: { x: 0, y: 0 },
    W: 0,
    H: 0,
    R: 0,
    mode: 'passenger' as Mode,
    selected: null as string | null,
    lang: 'az' as 'az' | 'en' | 'ru',
    lines: null as null | { solid: Vec[][]; dashed: Vec[][]; coast: Vec[][] },
    hits: [] as { key: string; x: number; y: number; dot: boolean }[],
  })
  const pickRef = useRef<(key: string) => void>(() => {})

  const lang = i18n.language === 'ru' ? 'ru' : i18n.language === 'en' ? 'en' : 'az'
  const routes = mode === 'passenger' ? PASSENGER_ROUTES : CARGO_ROUTES
  st.current.mode = mode
  st.current.selected = selected
  st.current.lang = lang

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const s = st.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    s.auto = !reduce
    // Sərhəd və sahil xətləri ayrıca, gecikmə ilə yüklənir (əsas səhifəni ağırlaşdırmır)
    const parse = (txt: string): Vec[][] =>
      txt.split(';').map((line) => {
        const n = line.split(',').map(Number)
        const out: Vec[] = []
        for (let i = 0; i < n.length; i += 2) out.push(vec(n[i] / 10, n[i + 1] / 10))
        return out
      })
    import('../flightData/borders')
      .then((m) => {
        s.lines = { solid: parse(m.BORDERS_SOLID), dashed: parse(m.BORDERS_DASHED), coast: parse(m.COASTLINES) }
      })
      .catch(() => {})
    let raf = 0
    let visible = true
    let last = performance.now()
    let dpr = 1

    const resize = () => {
      const w = cv.parentElement?.clientWidth || 320
      dpr = Math.min(2, window.devicePixelRatio || 1)
      s.W = w
      s.H = Math.round(w * 0.86)
      cv.width = s.W * dpr
      cv.height = s.H * dpr
      cv.style.height = `${s.H}px`
    }

    // Görünüş koordinatları: x sağa, y yuxarı, z izləyiciyə
    const view = (v: Vec): Vec => {
      const l0 = s.rot.lon * RAD
      const p0 = s.rot.lat * RAD
      const x1 = v[0] * Math.cos(l0) + v[1] * Math.sin(l0)
      const y1 = -v[0] * Math.sin(l0) + v[1] * Math.cos(l0)
      const z1 = v[2]
      return [y1, z1 * Math.cos(p0) - x1 * Math.sin(p0), z1 * Math.sin(p0) + x1 * Math.cos(p0)]
    }

    const frame = (now: number) => {
      raf = 0
      if (!visible) return
      const dt = Math.min(50, now - last)
      last = now
      const tg = s.target
      if (tg) {
        const k = 1 - Math.pow(0.0025, dt / 1000)
        const dl = ((tg.lon - s.rot.lon + 540) % 360) - 180
        s.rot.lon += dl * k
        s.rot.lat += (tg.lat - s.rot.lat) * k
        s.zoom += (tg.zoom - s.zoom) * k
        if (Math.abs(dl) < 0.05 && Math.abs(tg.lat - s.rot.lat) < 0.05 && Math.abs(tg.zoom - s.zoom) < 0.002) s.target = null
      } else if (!s.dragging) {
        if (s.auto) s.rot.lon += (s.base + Math.sin(now / 5200) * 28 - s.rot.lon) * Math.min(1, dt / 900)
        s.rot.lon += s.vel.x
        s.rot.lat = Math.max(-35, Math.min(70, s.rot.lat + s.vel.y))
        s.vel.x *= 0.92
        s.vel.y *= 0.92
      }

      const css = getComputedStyle(cv)
      const tok = (n: string) => css.getPropertyValue(n).trim()
      const c = {
        panel: tok('--g-panel'),
        ocean: tok('--g-ocean'),
        land: tok('--g-land'),
        fg: tok('--g-fg'),
        muted: tok('--g-muted'),
        bg: tok('--g-bg'),
        glow: tok('--g-glow'),
        border: tok('--g-border'),
        accent: s.mode === 'passenger' ? tok('--g-pax') : tok('--g-cargo'),
      }
      const { W, H } = s
      const R = Math.min(W, H) * 0.42 * s.zoom
      s.R = R
      const cx = W / 2
      const cy = H / 2
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Atmosfer və okean
      let g = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.22)
      g.addColorStop(0, c.glow)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.22, 0, 7)
      ctx.fill()
      g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R)
      g.addColorStop(0, c.panel)
      g.addColorStop(1, c.ocean)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, 7)
      ctx.fill()

      // Quru nöqtələri
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, 7)
      ctx.clip()
      ctx.fillStyle = c.land
      const ds = Math.max(1, Math.min(2.4, R / 230))
      for (let i = 0; i < DOTS.length; i += 2) {
        const v = view(vec(DOTS[i] / 10, DOTS[i + 1] / 10))
        if (v[2] <= 0) continue
        const x = cx + v[0] * R
        const y = cy - v[1] * R
        if (x < -5 || x > W + 5 || y < -5 || y > H + 5) continue
        ctx.globalAlpha = 0.25 + 0.75 * v[2]
        ctx.fillRect(x - ds * 0.75, y - ds * 0.75, ds * 1.5, ds * 1.5)
      }
      // Sahil xətləri və dövlət sərhədləri: yaxınlaşdıqca daha aydın
      if (s.lines) {
        const strokeSet = (set: Vec[][]) => {
          ctx.beginPath()
          for (const line of set) {
            let pen = false
            for (const v0 of line) {
              const v = view(v0)
              if (v[2] <= 0) {
                pen = false
                continue
              }
              const x = cx + v[0] * R
              const y = cy - v[1] * R
              if (!pen) {
                ctx.moveTo(x, y)
                pen = true
              } else ctx.lineTo(x, y)
            }
          }
          ctx.stroke()
        }
        const zf = Math.max(0, Math.min(1, (s.zoom - 1) / 1.5))
        ctx.lineJoin = 'round'
        ctx.strokeStyle = c.land
        ctx.lineWidth = 0.8
        ctx.globalAlpha = 0.35 + 0.4 * zf
        strokeSet(s.lines.coast)
        ctx.strokeStyle = c.border
        ctx.lineWidth = 0.6 + 0.6 * zf
        ctx.globalAlpha = 0.25 + 0.65 * zf
        strokeSet(s.lines.solid)
        ctx.setLineDash([3, 3])
        strokeSet(s.lines.dashed)
        ctx.setLineDash([])
      }
      ctx.restore()
      ctx.globalAlpha = 1
      s.hits = []

      const list = s.mode === 'passenger' ? PASSENGER_ROUTES : CARGO_ROUTES
      const phase = reduce ? 1 : (now / 2600) % 1
      const P = (v: Vec, h: number) => {
        const q = view(v)
        return {
          x: cx + q[0] * R * (1 + h),
          y: cy - q[1] * R * (1 + h),
          vis: q[2] > 0 || (q[0] * q[0] + q[1] * q[1]) * (1 + h) * (1 + h) > 1,
        }
      }
      const arc = (
        key: string,
        a: { lat: number; lon: number },
        b: { lat: number; lon: number },
        on: boolean,
        dim: boolean,
        delay: number
      ) => {
        const va = vec(a.lat, a.lon)
        const vb = vec(b.lat, b.lon)
        const d = angle(va, vb)
        const hmax = Math.min(0.35, 0.05 + d * 0.28)
        const N = Math.max(16, Math.round(d * 60))
        const pts = []
        for (let i = 0; i <= N; i++) {
          const tt = i / N
          pts.push(P(slerp(va, vb, tt), hmax * Math.sin(Math.PI * tt)))
        }
        ctx.strokeStyle = c.accent
        ctx.lineWidth = on ? 2.4 : 1.2
        ctx.globalAlpha = dim ? 0.12 : on ? 1 : 0.55
        ctx.beginPath()
        let pen = false
        for (const p of pts) {
          if (!p.vis) {
            pen = false
            continue
          }
          if (!pen) {
            ctx.moveTo(p.x, p.y)
            pen = true
          } else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
        for (let i = 1; i < pts.length; i += 2) if (pts[i].vis) s.hits.push({ key, x: pts[i].x, y: pts[i].y, dot: false })
        if (!dim) {
          const p = pts[Math.floor(((phase + delay) % 1) * N)]
          if (p && p.vis) {
            ctx.globalAlpha = 1
            ctx.fillStyle = c.accent
            ctx.shadowColor = c.accent
            ctx.shadowBlur = 10
            ctx.beginPath()
            ctx.arc(p.x, p.y, on ? 3 : 2, 0, 7)
            ctx.fill()
            ctx.shadowBlur = 0
          }
        }
        ctx.globalAlpha = 1
      }

      list.forEach((r, i) => {
        const on = s.selected === r.key
        const dim = s.selected !== null && !on
        const o = originOf(r)
        if (r.via) {
          arc(r.key, o, r.via, on, dim, i * 0.13)
          arc(r.key, r.via, r, on, dim, i * 0.13 + 0.5)
        } else arc(r.key, o, r, on, dim, i * 0.13)
      })

      list.forEach((r) => {
        const on = s.selected === r.key
        const dim = s.selected !== null && !on
        const p = P(vec(r.lat, r.lon), 0)
        if (!p.vis) return
        s.hits.push({ key: r.key, x: p.x, y: p.y, dot: true })
        ctx.globalAlpha = dim ? 0.25 : 1
        ctx.fillStyle = c.accent
        ctx.beginPath()
        ctx.arc(p.x, p.y, on ? 4.5 : 2.6, 0, 7)
        ctx.fill()
        if (r.via && !dim) {
          const q = P(vec(r.via.lat, r.via.lon), 0)
          if (q.vis) {
            ctx.strokeStyle = c.accent
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.arc(q.x, q.y, 4, 0, 7)
            ctx.stroke()
          }
        }
        const name = short(r[s.lang])
        if (!on && !dim && s.zoom > 1.8 && !r.from) {
          ctx.font = '500 11px ui-sans-serif, system-ui, sans-serif'
          ctx.textAlign = 'left'
          ctx.lineWidth = 3
          ctx.strokeStyle = c.bg
          ctx.strokeText(name, p.x + 6, p.y + 4)
          ctx.fillStyle = c.muted
          ctx.fillText(name, p.x + 6, p.y + 4)
        }
        if (on) {
          ctx.font = '600 13px ui-sans-serif, system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.lineWidth = 4
          ctx.strokeStyle = c.bg
          ctx.strokeText(name, p.x, p.y - 10)
          ctx.fillStyle = c.fg
          ctx.fillText(name, p.x, p.y - 10)
        }
      })
      ctx.globalAlpha = 1

      // Mərkəzlər: Bakı (döyünən) və Gəncə
      const hubs = s.mode === 'passenger' && list.some((r) => r.from === 'ganja') ? [BAKU, GANJA] : [BAKU]
      for (const hub of hubs) {
        const p = P(vec(hub.lat, hub.lon), 0)
        if (!p.vis) continue
        const big = hub === BAKU
        if (big && !reduce) {
          const k = (now / 1800) % 1
          ctx.strokeStyle = c.fg
          ctx.globalAlpha = 0.7 * (1 - k)
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(p.x, p.y, 4 + k * 14, 0, 7)
          ctx.stroke()
          ctx.globalAlpha = 1
        }
        ctx.fillStyle = c.fg
        ctx.beginPath()
        ctx.arc(p.x, p.y, big ? 4.5 : 3, 0, 7)
        ctx.fill()
      }

      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (!raf && visible) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    // Ekrandakı nöqtənin coğrafi koordinatı (kürədən kənardırsa null)
    const pick = (px: number, py: number) => {
      const rc = cv.getBoundingClientRect()
      const a = (px - rc.left - s.W / 2) / s.R
      const b = -(py - rc.top - s.H / 2) / s.R
      const q = a * a + b * b
      if (q > 1) return null
      const cz = Math.sqrt(1 - q)
      const l0 = s.rot.lon * RAD
      const p0 = s.rot.lat * RAD
      const y1 = a
      const x1 = cz * Math.cos(p0) - b * Math.sin(p0)
      const z1 = b * Math.cos(p0) + cz * Math.sin(p0)
      const v0 = x1 * Math.cos(l0) - y1 * Math.sin(l0)
      const v1 = x1 * Math.sin(l0) + y1 * Math.cos(l0)
      return { lat: Math.asin(Math.max(-1, Math.min(1, z1))) / RAD, lon: Math.atan2(v1, v0) / RAD }
    }
    const zoomAt = (px: number, py: number, f: number) => {
      const gp = pick(px, py)
      const cur = s.target || { lon: s.rot.lon, lat: s.rot.lat, zoom: s.zoom }
      const z = Math.max(ZMIN, Math.min(ZMAX, cur.zoom * f))
      let lon = cur.lon
      let lat = cur.lat
      if (gp && f > 1) {
        const k = 1 - 1 / f
        lon = cur.lon + ((((gp.lon - cur.lon + 540) % 360) - 180) * k)
        lat = cur.lat + (gp.lat - cur.lat) * k
      }
      s.target = { lon, lat: Math.max(-35, Math.min(70, lat)), zoom: z }
      s.auto = false
    }

    // Ekrandakı nöqtəyə ən yaxın marşrut: əvvəlcə şəhər nöqtəsi, sonra xətt
    const hitAt = (px: number, py: number): string | null => {
      const rc = cv.getBoundingClientRect()
      const x = px - rc.left
      const y = py - rc.top
      let best: string | null = null
      let bestD = Infinity
      for (const h of s.hits) {
        const d = Math.hypot(h.x - x, h.y - y) - (h.dot ? 8 : 0)
        if (d < bestD && d < (h.dot ? 12 : 10)) {
          bestD = d
          best = h.key
        }
      }
      return best
    }

    // Barmaq kürənin üzərindədirsə kürə hər istiqamətdə fırlanır; kənardadırsa səhifə sürüşür
    const onGlobe = (px: number, py: number) => {
      const rc = cv.getBoundingClientRect()
      return Math.hypot(px - rc.left - s.W / 2, py - rc.top - s.H / 2) <= s.R * 1.04
    }
    const onTouchStart = (e: TouchEvent) => {
      const t0 = e.touches[0]
      if (e.touches.length > 1 || (t0 && onGlobe(t0.clientX, t0.clientY))) e.preventDefault()
    }

    const ptrs = new Map<number, { x: number; y: number }>()
    let grabbed = false
    let downAt: { x: number; y: number } | null = null
    let pinch = 0
    let lastTap = 0
    const stage = cv.parentElement as HTMLElement
    const onDown = (e: PointerEvent) => {
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY })
      downAt = ptrs.size === 1 ? { x: e.clientX, y: e.clientY } : null
      if (ptrs.size === 1) grabbed = e.pointerType !== 'touch' || onGlobe(e.clientX, e.clientY)
    }
    const onMove = (e: PointerEvent) => {
      const p = ptrs.get(e.pointerId)
      if (!p) {
        if (e.pointerType === 'mouse' && ptrs.size === 0) cv.style.cursor = hitAt(e.clientX, e.clientY) ? 'pointer' : 'grab'
        return
      }
      const dx = e.clientX - p.x
      const dy = e.clientY - p.y
      if (ptrs.size === 1) {
        // Kürədən kənarda başlayan şaquli hərəkət səhifəni sürüşdürür
        if (!grabbed && !s.dragging && e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
          ptrs.delete(e.pointerId)
          return
        }
        if (!s.dragging && Math.hypot(dx, dy) < 3) return
        if (!s.dragging) {
          s.dragging = true
          cv.style.cursor = 'grabbing'
          stage.style.touchAction = 'none'
          try {
            cv.setPointerCapture(e.pointerId)
          } catch {
            /* ignore */
          }
        }
        s.target = null
        s.auto = false
        const k = 90 / (s.R || 200)
        s.vel = { x: -dx * k, y: dy * k }
        s.rot.lon -= dx * k
        s.rot.lat = Math.max(-35, Math.min(70, s.rot.lat + dy * k))
      }
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (pinch) s.zoom = Math.max(ZMIN, Math.min(ZMAX, (s.zoom * d) / pinch))
        pinch = d
        s.target = null
        s.dragging = true
      }
    }
    const onUp = (e: PointerEvent) => {
      const wasDragging = s.dragging
      ptrs.delete(e.pointerId)
      pinch = 0
      if (ptrs.size === 0) {
        s.dragging = false
        cv.style.cursor = 'grab'
        stage.style.touchAction = 'pan-y'
      }
      const tapped =
        e.type === 'pointerup' && !wasDragging && downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) < 8
      downAt = null
      if (tapped) {
        const key = hitAt(e.clientX, e.clientY)
        if (key) {
          pickRef.current(key)
          lastTap = 0
          return
        }
      }
      if (tapped && e.pointerType === 'touch') {
        const n = performance.now()
        if (n - lastTap < 300) {
          zoomAt(e.clientX, e.clientY, 2)
          lastTap = 0
        } else lastTap = n
      }
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.25 : 1 / 1.25)
    }
    const onDbl = (e: MouseEvent) => {
      e.preventDefault()
      if (hitAt(e.clientX, e.clientY)) return
      zoomAt(e.clientX, e.clientY, 2)
    }

    cv.addEventListener('touchstart', onTouchStart, { passive: false })
    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointercancel', onUp)
    cv.addEventListener('wheel', onWheel, { passive: false })
    cv.addEventListener('dblclick', onDbl)
    window.addEventListener('resize', resize)

    // Kürə ekranda görünməyəndə animasiya dayanır (batareya və CPU üçün)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    io.observe(cv)

    resize()
    start()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      cv.removeEventListener('touchstart', onTouchStart)
      cv.removeEventListener('pointerdown', onDown)
      cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerup', onUp)
      cv.removeEventListener('pointercancel', onUp)
      cv.removeEventListener('wheel', onWheel)
      cv.removeEventListener('dblclick', onDbl)
    }
  }, [])

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const focus = (r: RoutePoint | null) => {
    const s = st.current
    if (!r) {
      s.target = { lon: s.base, lat: 30, zoom: s.mode === 'passenger' ? 1 : 0.85 }
      s.auto = !reduceMotion()
      return
    }
    const o = originOf(r)
    const a = vec(o.lat, o.lon)
    const b = vec(r.lat, r.lon)
    const m = r.via ? slerp(slerp(a, vec(r.via.lat, r.via.lon), 0.5), b, 0.5) : slerp(a, b, 0.5)
    const lat = Math.asin(m[2]) / RAD
    const lon = Math.atan2(m[1], m[0]) / RAD
    const d = angle(a, b) + (r.via ? 0.2 : 0)
    s.target = {
      lon,
      lat: Math.max(-40, Math.min(60, lat)),
      zoom: Math.max(1, Math.min(3.2, 1.25 / Math.max(d, 0.15))),
    }
    s.auto = false
  }

  const switchMode = (m: Mode) => {
    const s = st.current
    setMode(m)
    setSelected(null)
    s.base = m === 'passenger' ? 50 : 10
    s.auto = !reduceMotion()
    s.target = m === 'passenger' ? { lon: 50, lat: 30, zoom: 1 } : { lon: 10, lat: 42, zoom: 0.85 }
  }

  const toggle = (r: RoutePoint) => {
    const next = selected === r.key ? null : r.key
    setSelected(next)
    focus(next ? r : null)
  }

  pickRef.current = (key: string) => {
    const r = routes.find((x) => x.key === key)
    if (r) toggle(r)
  }

  const zoomBy = (f: number) => {
    const s = st.current
    s.target = { lon: s.rot.lon, lat: s.rot.lat, zoom: Math.max(ZMIN, Math.min(ZMAX, s.zoom * f)) }
    if (f > 1) s.auto = false
  }

  const current = routes.find((r) => r.key === selected) ?? null
  const originName = (r: RoutePoint) => (r.from === 'ganja' ? t('home.routes.ganja') : t('home.routes.baku'))
  const total = (r: RoutePoint) => (r.via ? km(originOf(r), r.via) + km(r.via, r) : km(originOf(r), r))
  const isCargo = mode === 'cargo'

  const segBase = 'px-4 py-2 rounded-full text-sm font-semibold transition-colors touch-manipulation min-h-[40px]'
  const activeSeg = isCargo ? 'bg-amber-500 text-gray-900 shadow-sm' : 'bg-primary-600 text-white shadow-sm'
  const zoomBtn =
    'w-9 h-9 rounded-full bg-white/90 border border-gray-200 text-gray-700 text-lg leading-none font-semibold hover:border-primary-300 touch-manipulation'

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
            className={`${segBase} ${mode === m ? activeSeg : 'text-gray-600 hover:text-gray-900'}`}
          >
            {t(`home.routes.${m}`)}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-2xl bg-white border border-gray-200 p-2.5">
        <div className="route-globe relative rounded-xl overflow-hidden" style={{ touchAction: 'pan-y' }}>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={t('home.routes.title')}
            className="block w-full select-none"
            style={{ cursor: 'grab' }}
          />
          <div className="absolute right-2 bottom-2 flex flex-col gap-1.5">
            <button type="button" className={zoomBtn} onClick={() => zoomBy(1.6)} aria-label={t('home.routes.zoomIn')}>
              +
            </button>
            <button type="button" className={zoomBtn} onClick={() => zoomBy(1 / 1.6)} aria-label={t('home.routes.zoomOut')}>
              −
            </button>
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
            <span className="text-gray-400">{t('home.routes.globeHint')}</span>
          )}
        </p>

        <ul className="flex flex-wrap gap-1.5 px-1 pt-1 pb-1">
          {routes.map((r) => {
            const on = r.key === selected
            return (
              <li key={r.key}>
                <button
                  type="button"
                  onClick={() => toggle(r)}
                  aria-pressed={on}
                  className={`text-xs sm:text-[13px] rounded-full px-3 py-1.5 border transition-colors touch-manipulation ${
                    on
                      ? isCargo
                        ? 'bg-amber-500 border-amber-500 text-gray-900'
                        : 'bg-primary-600 border-primary-600 text-white'
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
