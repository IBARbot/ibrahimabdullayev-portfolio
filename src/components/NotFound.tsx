import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()

  // Mövcud olmayan səhifə axtarış sistemlərində indekslənməsin
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
      <p className="text-6xl font-bold text-primary-600 mb-4">404</p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-balance">
        {t('notFound.title')}
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">{t('notFound.description')}</p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors"
      >
        {t('notFound.home')}
      </Link>
    </main>
  )
}
