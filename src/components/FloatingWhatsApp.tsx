import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const WHATSAPP_NUMBER = '994555973923'

export default function FloatingWhatsApp() {
  const { t, i18n } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [labelVisible, setLabelVisible] = useState(true)
  
  const WHATSAPP_MESSAGES: Record<string, string> = {
    az: 'Salam! Turizm xidmətləriniz haqqında məlumat almaq istərdim.',
    en: 'Hello! I would like to get information about your tourism services.',
    ru: 'Здравствуйте! Я хотел бы получить информацию о ваших туристических услугах.',
  }
  
  const WHATSAPP_MESSAGE = WHATSAPP_MESSAGES[i18n.language || 'az'] || WHATSAPP_MESSAGES.az

  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex items-center gap-3">
        {/* Label (desktop və böyük ekranlar üçün) */}
        <AnimatePresence>
          {labelVisible && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              onClick={handleWhatsApp}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="hidden sm:inline-flex items-center px-4 py-2 bg-white/95 backdrop-blur rounded-full shadow-lg hover:shadow-xl border border-green-100 text-sm font-medium text-gray-800 hover:bg-white transition-all"
            >
              <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>{t('welcome.whatsappLabel')}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLabelVisible(false)
                }}
                className="ml-3 text-gray-400 hover:text-gray-600"
                aria-label="Bağla"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp Button */}
        <motion.button
          onClick={handleWhatsApp}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="WhatsApp-dan əlaqə saxla"
        >
          <MessageCircle className="w-7 h-7 text-white relative z-10" />
          
          {/* Pulse Animation */}
          <motion.span
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-green-500"
          />
        </motion.button>
      </div>
    </div>
  )
}

