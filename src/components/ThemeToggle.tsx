import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function readDark(): boolean {
  return document.documentElement.classList.contains('dark')
}

function apply(dark: boolean, remember: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b1220' : '#0ea5e9')
  if (!remember) return
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  } catch {
    /* ignore */
  }
}

export default function ThemeToggle() {
  const { t } = useTranslation()
  const [dark, setDark] = useState(readDark)

  // Sistem rejimi dəyişəndə (istifadəçi özü seçməyibsə) ona uyğunlaş
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem('theme')) return
      } catch {
        /* ignore */
      }
      apply(e.matches, false)
      setDark(e.matches)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const choose = (next: boolean) => {
    apply(next, true)
    setDark(next)
  }

  const base =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors touch-manipulation'
  const on = 'bg-primary-600 text-white shadow-sm'
  const off = 'text-gray-600 hover:text-gray-900'

  return (
    <div
      role="group"
      aria-label={t('nav.theme')}
      className="inline-flex items-center gap-1 p-1 rounded-full bg-gray-100 border border-gray-200"
    >
      <button type="button" onClick={() => choose(false)} aria-pressed={!dark} className={`${base} ${!dark ? on : off}`}>
        <Sun className="w-4 h-4" aria-hidden="true" />
        {t('nav.light')}
      </button>
      <button type="button" onClick={() => choose(true)} aria-pressed={dark} className={`${base} ${dark ? on : off}`}>
        <Moon className="w-4 h-4" aria-hidden="true" />
        {t('nav.dark')}
      </button>
    </div>
  )
}
