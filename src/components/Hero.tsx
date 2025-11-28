import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Linkedin, Mail, Loader2, Instagram, MessageCircle } from 'lucide-react'

interface HeroContent {
  title: string
  subtitle: string
  description: string
  image: string
}

const PROFILE_IMAGE = 'https://i.imgur.com/64oQNiZ.jpeg'

interface HeroProps {
  onOpenBooking?: () => void
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const [content, setContent] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.hero) {
          setContent(data.hero)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Content yüklənərkən xəta:', err)
        setContent({
          title: 'Salam, mən İbrahim Abdullayev',
          subtitle: 'Turizm Sahəsində Aparıcı Mütəxəssis',
          description: 'Aviabilet rezervasiyası, otel booking, transfer xidmətləri, sığorta və səfirlik işləri üzrə peşəkar məsləhətçi',
          image: '',
        })
        setLoading(false)
      })
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading || !content) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </section>
    )
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden"
    >
      {/* Minimal background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
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
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur-2xl opacity-30 animate-blob"></div>
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src={PROFILE_IMAGE}
                  alt="İbrahim Abdullayev"
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/400x400/0ea5e9/ffffff?text=IA'
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
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            {content.title.includes('İbrahim Abdullayev') ? (
              <>
                {content.title.split('İbrahim Abdullayev')[0]}
                <span className="text-primary-600">İbrahim Abdullayev</span>
                {content.title.split('İbrahim Abdullayev')[1]}
              </>
            ) : (
              content.title
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            {content.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16"
          >
            <button
              onClick={() => scrollToSection('services')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all shadow-lg hover:shadow-xl active:scale-95 touch-manipulation text-sm sm:text-base"
            >
              Xidmətlərimə Bax
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 active:bg-primary-100 transition-all active:scale-95 touch-manipulation text-sm sm:text-base"
            >
              Əlaqə Saxla
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
            aria-label="Aşağı scroll et"
          >
            <ChevronDown className="w-8 h-8 text-primary-600" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

