import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Calendar, ArrowRight } from 'lucide-react'

const WHATSAPP_NUMBER = '994555973923'
const WHATSAPP_MESSAGE = 'Salam! Turizm xidmətləriniz haqqında məlumat almaq istərdim.'

interface WelcomeModalProps {
  onClose: () => void
  onOpenBooking?: () => void
}

export default function WelcomeModal({ onClose, onOpenBooking }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if modal was shown before
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal')
    if (!hasSeenModal) {
      // Show modal after a short delay
      setTimeout(() => setIsVisible(true), 500)
    }
  }, [])

  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    window.open(url, '_blank')
    handleClose()
  }

  const handleBooking = () => {
    handleClose()
    // Open booking modal after welcome modal closes
    setTimeout(() => {
      onOpenBooking?.()
    }, 300)
  }

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('hasSeenWelcomeModal', 'true')
    setTimeout(() => onClose(), 300)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Bağla"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Xoş Gəlmisiniz!
              </h2>
              <p className="text-gray-600 mb-8">
                Sizə necə kömək edə bilərəm?
              </p>
            </motion.div>

            {/* Options */}
            <div className="space-y-4">
              {/* WhatsApp Option */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={handleWhatsApp}
                className="w-full p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">
                      Dərhal Əlaqə Saxla
                    </h3>
                    <p className="text-sm text-gray-600">
                      WhatsApp-dan birbaşa mesaj göndər
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Booking Option */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onClick={handleBooking}
                className="w-full p-6 bg-primary-50 border-2 border-primary-200 rounded-xl hover:bg-primary-100 transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">
                      İndi Rezerv Et
                    </h3>
                    <p className="text-sm text-gray-600">
                      Birbaşa rezervasiya formunu doldur
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            </div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-xs text-gray-500"
            >
              Bu mesaj yalnız bir dəfə göstəriləcək
            </motion.p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

