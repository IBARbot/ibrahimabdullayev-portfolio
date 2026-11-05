import { Plane, Hotel, Car, Shield, Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type BookingType = 'flight' | 'hotel' | 'transfer' | 'insurance' | 'embassy'

interface HomeServicesProps {
  onOpenBooking?: (type: BookingType) => void
}

export default function HomeServices({ onOpenBooking }: HomeServicesProps) {
  const { t } = useTranslation()

  const items: { type: BookingType; icon: React.ElementType; title: string }[] = [
    { type: 'flight', icon: Plane, title: t('services.flight.title') },
    { type: 'hotel', icon: Hotel, title: t('services.hotel.title') },
    { type: 'transfer', icon: Car, title: t('services.transfer.title') },
    { type: 'insurance', icon: Shield, title: t('services.insurance.title') },
    { type: 'embassy', icon: Building2, title: t('services.embassy.title') },
  ]

  return (
    <section id="services" className="max-w-xl mx-auto px-5 pt-10">
      <h2 className="text-xs font-semibold tracking-wider uppercase text-gray-500 mb-3">
        {t('home.servicesTitle')}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onOpenBooking?.(item.type)}
              className={`flex items-center gap-3 text-left px-4 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 font-medium hover:border-primary-300 transition-colors touch-manipulation ${
                i === items.length - 1 && items.length % 2 === 1 ? 'col-span-2' : ''
              }`}
            >
              <Icon className="w-5 h-5 text-primary-600 shrink-0" />
              <span className="text-sm sm:text-base">{item.title}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
