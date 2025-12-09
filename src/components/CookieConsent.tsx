import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'cookieConsent'

type ConsentStatus = 'accepted' | 'rejected' | null

export default function CookieConsent() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<ConsentStatus>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ConsentStatus | null
    if (!saved) {
      setIsVisible(true)
    } else {
      setStatus(saved)
    }
  }, [])

  const handleConsent = (value: ConsentStatus) => {
    setStatus(value)
    setIsVisible(false)
    if (value) {
      localStorage.setItem(STORAGE_KEY, value)
    }
  }

  if (!isVisible || status) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:pb-6 pointer-events-none"
      >
        <div className="max-w-5xl mx-auto pointer-events-auto">
          <div className="bg-gray-900/95 text-gray-100 rounded-2xl shadow-2xl border border-gray-700/60 p-4 sm:p-5 md:p-6 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  {t('cookie.title')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  {t('cookie.description')}
                </p>
                <p className="mt-2 text-[11px] sm:text-xs text-gray-400">
                  {t('cookie.details')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:ml-4 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleConsent('rejected')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-gray-600 text-xs sm:text-sm font-medium text-gray-200 hover:bg-gray-800 transition-colors"
                >
                  {t('cookie.reject')}
                </button>
                <button
                  type="button"
                  onClick={() => handleConsent('accepted')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-primary-500 text-xs sm:text-sm font-semibold text-white hover:bg-primary-600 shadow-lg shadow-primary-500/30 transition-colors"
                >
                  {t('cookie.accept')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}








