import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import BookingForm from './BookingForm'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  initialType?: 'flight' | 'hotel' | 'transfer' | 'insurance' | 'embassy'
}

export default function BookingModal({ isOpen, onClose, initialType = 'flight' }: BookingModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false)
    }
  }, [isOpen])

  const handleClose = () => {
    onClose()
  }

  const handleBookingSuccess = () => {
    setShowSuccess(true)
    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
          className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto my-8"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full shadow-md hover:bg-gray-50"
            aria-label="Bağla"
          >
            <X className="w-5 h-5" />
          </button>

          {showSuccess ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center px-8">
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-20 h-20 text-green-500 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></motion.path>
              </motion.svg>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Sorğunuz Uğurla Göndərildi!
              </h2>
              <p className="text-lg text-gray-600">
                Tezliklə sizinlə əlaqə saxlayacağıq.
              </p>
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <BookingForm onBookingSuccess={handleBookingSuccess} />
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
