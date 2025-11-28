import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'

const WHATSAPP_NUMBER = '994555973923'
const WHATSAPP_MESSAGE = 'Salam! Turizm xidmətləriniz haqqında məlumat almaq istərdim.'

export default function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false)

  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute bottom-20 right-0 mb-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap"
          >
            <p className="text-sm font-medium">WhatsApp-dan yazın</p>
            <div className="absolute bottom-0 right-4 transform translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </motion.div>
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
  )
}

