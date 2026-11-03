import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function readDark(): boolean {
  return document.documentElement.classList.contains('dark')
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
      document.documentElement.classList.toggle('dark', e.matches)
      setDark(e.matches)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    setDark(next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* ignore */
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next ? '#0b1220' : '#0ea5e9')
  }

  const label = dark ? t('nav.lightMode') : t('nav.darkMode')

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
