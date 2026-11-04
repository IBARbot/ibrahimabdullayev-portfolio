import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Linkedin, Mail, Instagram, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import BakuStatus from './BakuStatus'

const PROFILE_IMAGE = '/profile.jpg'

interface HeroProps {
  onOpenBooking?: () => void
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const { t, i18n } = useTranslation()
  const [heroImage, setHeroImage] = useState<string>(PROFILE_IMAGE)

  useEffect(() => {
    // Public content endpoint (shared with admin content storage)
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.hero?.image) {
          setHeroImage(data.hero.image)
        }
      })
      .catch(() => {
        // Keep default image
      })
  }, [i18n.language])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Use translations for all text content - these will update automatically when language changes
  const heroTitle = t('hero.title')
  const heroSubtitle = t('hero.subtitle')
  const heroDescription = t('hero.description')
  const credentialsRaw = t('hero.credentials', { returnObjects: true }) as unknown
  const credentials: string[] = Array.isArray(credentialsRaw) ? (credentialsRaw as string[]) : []

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden"
    >
      {/* Minimal background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Bakıdan dünyaya: yumşaq uçuş marşrutu */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full text-primary-300 opacity-50 pointer-events-none"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <path
            id="hero-route-a"
            d="M-20 640 C 250 380, 600 340, 880 170 S 1150 60, 1230 40"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 10"
            strokeLinecap="round"
            className="hero-route-dash"
          />
          <path
            d="M-20 760 C 300 620, 700 700, 1000 480 S 1180 380, 1230 360"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 12"
            strokeLinecap="round"
            className="hero-route-dash"
          />
          <circle r="5" fill="currentColor" className="motion-reduce:hidden">
            <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
              <mpath href="#hero-route-a" />
            </animateMotion>
          </circle>
          <circle cx="880" cy="170" r="4" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile Image - First on mobile, second on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center md:justify-start order-1 md:order-2"
          >
            <div className="relative">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src={heroImage}
                  alt={heroTitle}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = PROFILE_IMAGE
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Left Content - Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left order-2 md:order-1"
          >
          <BakuStatus />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight text-balance"
          >
            {i18n.language === 'az' ? 'İbrahim Abdullayev' : i18n.language === 'ru' ? 'Ибрагим Абдуллаев' : 'Ibrahim Abdullayev'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto"
          >
            {heroSubtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base text-gray-500 mb-5 max-w-xl mx-auto"
          >
            {heroDescription}
          </motion.p>

          {credentials.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap justify-center md:justify-start gap-2 mb-10"
            >
              {credentials.map((item) => (
                <li
                  key={item}
                  className="px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-primary-50 text-primary-700 border border-primary-100"
                >
                  {item}
                </li>
              ))}
            </motion.ul>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16"
          >
            <button
              onClick={() => onOpenBooking?.()}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-lg hover:shadow-xl active:scale-95 touch-manipulation text-sm sm:text-base"
            >
              {t('nav.bookNow')}
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 active:bg-primary-100 transition-all active:scale-95 touch-manipulation text-sm sm:text-base"
            >
              {t('hero.viewServices')}
            </button>
          </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex justify-center md:justify-start gap-3 sm:gap-4 mb-8 sm:mb-12 flex-wrap"
            >
              <a
                href="https://linkedin.com/in/ibrahim-abdullayev-7bb887152"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-primary-50 active:bg-primary-100 transition-all touch-manipulation"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </a>
              <a
                href="https://instagram.com/ibrahim_abdullar"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-primary-50 active:bg-primary-100 transition-all touch-manipulation"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </a>
              <a
                href="https://wa.me/994555973923"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-primary-50 active:bg-primary-100 transition-all touch-manipulation"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </a>
              <a
                href="mailto:ibrahim.abdullayev1@gmail.com"
                className="p-2.5 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-primary-50 active:bg-primary-100 transition-all touch-manipulation"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <button
            onClick={() => scrollToSection('about')}
            className="animate-bounce"
            aria-label={t('nav.scrollDown')}
          >
            <ChevronDown className="w-8 h-8 text-primary-600" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

