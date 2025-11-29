import { motion } from 'framer-motion'
import { Plane, Hotel, Car, Shield, Building2, MapPin, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Service {
  icon: React.ElementType
  title: string
  description: string
  features: string[]
}

const services: Service[] = [
  {
    icon: Plane,
    title: 'Aviabilet Rezervasiyası',
    description: 'Ən yaxşı qiymətlərlə aviabilet rezervasiyası və məsləhəti',
    features: ['Uçuş axtarışı', 'Multi-city', 'Optimal qiymətlər', '24/7 dəstək'],
  },
  {
    icon: Hotel,
    title: 'Otel Rezervasiyası',
    description: 'Dünyanın hər yerində otel rezervasiyası və booking xidməti',
    features: ['Ən yaxşı otellər', 'Rəqabətli qiymətlər', 'Giriş/çıxış tarixləri', 'Otaq seçimi'],
  },
  {
    icon: Car,
    title: 'Transfer Xidmətləri',
    description: 'Hava limanı, otel və şəhər daxilində transfer xidmətləri',
    features: ['Hava limanı transfer', 'Şəhər daxili', 'Komfortlu nəqliyyat', 'Təhlükəsiz səyahət'],
  },
  {
    icon: Shield,
    title: 'Sığorta Xidmətləri',
    description: 'Səyahət, sağlamlıq və həyat sığortası paketləri',
    features: ['Səyahət sığortası', 'Sağlamlıq sığortası', 'Həyat sığortası', 'Fərdi paketlər'],
  },
  {
    icon: Building2,
    title: 'Səfirlik İşləri',
    description: 'Viza müraciətləri və səfirlik işləri üzrə məsləhət',
    features: ['Viza müraciətləri', 'Sənəd hazırlığı', 'Təcili xidmət', 'Məsləhət'],
  },
  {
    icon: MapPin,
    title: 'Səyahət Planlaşdırması',
    description: 'Kompleks səyahət planları və marşrut optimallaşdırması',
    features: ['Marşrut planlaşdırması', 'Multi-destination', 'Büdcə optimallaşdırması', 'Fərdi planlar'],
  },
]

type BookingType = 'flight' | 'hotel' | 'transfer' | 'insurance' | 'embassy'

interface ServicesProps {
  onOpenBooking?: (type: BookingType) => void
}

export default function Services({ onOpenBooking }: ServicesProps) {
  const { t } = useTranslation()
  
  const services: (Service & { bookingType: BookingType })[] = [
    {
      icon: Plane,
      title: t('services.flight.title'),
      description: t('services.flight.description'),
      features: t('services.flight.features', { returnObjects: true }) as string[],
      bookingType: 'flight',
    },
    {
      icon: Hotel,
      title: t('services.hotel.title'),
      description: t('services.hotel.description'),
      features: t('services.hotel.features', { returnObjects: true }) as string[],
      bookingType: 'hotel',
    },
    {
      icon: Car,
      title: t('services.transfer.title'),
      description: t('services.transfer.description'),
      features: t('services.transfer.features', { returnObjects: true }) as string[],
      bookingType: 'transfer',
    },
    {
      icon: Shield,
      title: t('services.insurance.title'),
      description: t('services.insurance.description'),
      features: t('services.insurance.features', { returnObjects: true }) as string[],
      bookingType: 'insurance',
    },
    {
      icon: Building2,
      title: t('services.embassy.title'),
      description: t('services.embassy.description'),
      features: t('services.embassy.features', { returnObjects: true }) as string[],
      bookingType: 'embassy',
    },
    {
      icon: MapPin,
      title: t('services.planning.title'),
      description: t('services.planning.description'),
      features: t('services.planning.features', { returnObjects: true }) as string[],
      bookingType: 'flight', // Səyahət planlaşdırması üçün default olaraq flight
    },
  ]
  
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t('services.title')}
          </h2>
          <div className="w-16 h-0.5 bg-primary-600 mx-auto mb-4"></div>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-5 sm:p-6 rounded-lg border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="p-2.5 sm:p-3 bg-primary-100 rounded-lg flex-shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => onOpenBooking?.(service.bookingType)}
                  className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                >
                  <Calendar className="w-4 h-4" />
                  {t('services.bookNow')}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

