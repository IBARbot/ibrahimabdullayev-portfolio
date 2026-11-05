import { MessageCircle, CalendarCheck, Mail, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import BakuStatus from './BakuStatus'

interface ProfileProps {
  onOpenBooking?: () => void
}

const PHOTO = '/profile.jpg'
const FALLBACK = '/profile-192.jpg'

export default function Profile({ onOpenBooking }: ProfileProps) {
  const { t, i18n } = useTranslation()
  const name =
    i18n.language === 'ru' ? 'Ибрагим Абдуллаев' : i18n.language === 'en' ? 'Ibrahim Abdullayev' : 'İbrahim Abdullayev'

  const primary =
    'flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors touch-manipulation'
  const secondary =
    'flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition-colors touch-manipulation'

  return (
    <section id="home" className="max-w-xl mx-auto px-5 pt-6 pb-2">
      <div className="flex flex-col items-center text-center gap-3">
        <img
          src={PHOTO}
          alt={name}
          width={112}
          height={112}
          className="w-28 h-28 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            const target = e.currentTarget
            if (!target.src.endsWith(FALLBACK)) target.src = FALLBACK
          }}
        />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{name}</h1>
        <p className="text-lg text-gray-600 max-w-sm text-balance">{t('home.tagline')}</p>
        <BakuStatus />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <a
          href="https://wa.me/994555973923"
          target="_blank"
          rel="noopener noreferrer"
          className={primary}
        >
          <span className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5" />
            {t('home.whatsapp')}
          </span>
          <ArrowRight className="w-5 h-5" />
        </a>
        <button type="button" onClick={() => onOpenBooking?.()} className={secondary + ' text-left'}>
          <span className="flex items-center gap-3">
            <CalendarCheck className="w-5 h-5 text-primary-600" />
            {t('home.request')}
          </span>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </button>
        <a href="mailto:ibrahim.abdullayev1@gmail.com" className={secondary}>
          <span className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary-600" />
            {t('home.email')}
          </span>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </a>
      </div>
    </section>
  )
}
