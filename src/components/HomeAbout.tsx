import { useEffect, useState } from 'react'
import { ZoomIn, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../utils/formatDate'

interface CertificateItem {
  id: string
  title: string
  subtitle?: string
  provider?: string
  date?: string
  image: string
}

export default function HomeAbout() {
  const { t, i18n } = useTranslation()
  const [certs, setCerts] = useState<CertificateItem[]>([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<CertificateItem | null>(null)

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => setCerts((data.certificates || []) as CertificateItem[]))
      .catch(() => {
        // Sertifikatlar yüklənməsə, bölmə sadəcə görünmür
      })
  }, [])

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  return (
    <section id="about" className="max-w-xl mx-auto px-5 pt-12">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8" />
      <p className="text-xl font-semibold text-gray-900 leading-snug tracking-tight">
        {t('home.aboutLead')}
      </p>
      <p className="mt-4 text-gray-600 leading-relaxed">{t('home.aboutText1')}</p>
      <p className="mt-3 text-gray-600 leading-relaxed">{t('home.aboutText2')}</p>

      {certs.length > 0 && (
        <div id="certificates" className="mt-5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 touch-manipulation"
          >
            {t('home.certificates')} {open ? '↑' : '→'}
          </button>

          {open && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {certs.map((cert) => (
                <button
                  key={cert.id}
                  type="button"
                  onClick={() => setSelected(cert)}
                  className="group text-left rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  {cert.image && (
                    <div className="relative h-28 bg-gray-100 overflow-hidden">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-xs text-primary-600 font-semibold mb-1">{cert.provider}</p>
                    <p className="text-sm font-medium text-gray-900">{cert.title}</p>
                    {cert.date && (
                      <p className="text-xs text-gray-400 mt-1">{formatDate(cert.date, i18n.language)}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <div
            className="relative bg-white rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label={t('nav.close')}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {selected.image && (
              <div className="bg-black flex items-center justify-center max-h-[75vh]">
                <img src={selected.image} alt={selected.title} className="max-h-[75vh] w-auto object-contain" />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-900">{selected.title}</h3>
              {selected.subtitle && <p className="text-sm text-gray-600 mt-1">{selected.subtitle}</p>}
              {selected.provider && <p className="text-xs text-gray-500 mt-1">{selected.provider}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
