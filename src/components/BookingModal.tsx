import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Plane, Hotel, Car, Shield, Building2 } from 'lucide-react'

type BookingType = 'flight' | 'hotel' | 'transfer' | 'insurance' | 'embassy'

interface BookingFormData {
  type: BookingType
  name: string
  email: string
  phone: string
  from?: string
  to?: string
  date?: string
  passengers?: string
  destination?: string
  checkIn?: string
  checkOut?: string
  rooms?: string
  guests?: string
  time?: string
  insuranceType?: string
  package?: string
  startDate?: string
  endDate?: string
  embassyCountry?: string
  visaType?: string
  urgent?: boolean
  notes?: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  initialType?: BookingType
}

export default function BookingModal({ isOpen, onClose, initialType = 'flight' }: BookingModalProps) {
  const [bookingType, setBookingType] = useState<BookingType>(initialType)
  const [formData, setFormData] = useState<BookingFormData>({
    type: initialType,
    name: '',
    email: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  useEffect(() => {
    if (isOpen) {
      setBookingType(initialType)
      setFormData({
        type: initialType,
        name: '',
        email: '',
        phone: '',
      })
      setSubmitStatus({ type: null, message: '' })
    }
  }, [isOpen, initialType])

  const bookingTypes = [
    { id: 'flight' as BookingType, label: 'Aviabilet', icon: Plane },
    { id: 'hotel' as BookingType, label: 'Otel', icon: Hotel },
    { id: 'transfer' as BookingType, label: 'Transfer', icon: Car },
    { id: 'insurance' as BookingType, label: 'Sığorta', icon: Shield },
    { id: 'embassy' as BookingType, label: 'Səfirlik', icon: Building2 },
  ]

  const handleTypeChange = (type: BookingType) => {
    setBookingType(type)
    setFormData({ ...formData, type })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, type: bookingType }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Sorğunuz uğurla göndərildi!',
        })
        setFormData({
          type: bookingType,
          name: '',
          email: '',
          phone: '',
        })
        // Close modal after 2 seconds on success
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
      })
    } finally {
      setIsSubmitting(false)
    }
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
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full shadow-md"
            aria-label="Bağla"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-5 sm:p-6 lg:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Rezervasiya Sorğusu
              </h2>
              <div className="w-24 h-1 bg-primary-600 mx-auto mb-4"></div>
              <p className="text-lg sm:text-xl text-gray-600">
                Xidmətlərimiz üçün sorğu göndərin
              </p>
            </div>

            {/* Booking Type Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
              {bookingTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeChange(type.id)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                      bookingType === type.id
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 hover:border-primary-300 active:border-primary-400 text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm font-medium">{type.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="bg-gray-50 p-5 sm:p-6 lg:p-8 rounded-lg">
              <div className="space-y-5 sm:space-y-6">
                {/* Common Fields */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                      placeholder="Adınız"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                    placeholder="+994 50 123 45 67"
                  />
                </div>

                {/* Flight Fields */}
                {bookingType === 'flight' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Haradan
                        </label>
                        <input
                          type="text"
                          name="from"
                          value={formData.from || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                          placeholder="Bakı"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hara
                        </label>
                        <input
                          type="text"
                          name="to"
                          value={formData.to || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                          placeholder="İstanbul"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tarix
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nəfər sayı
                        </label>
                        <input
                          type="number"
                          name="passengers"
                          value={formData.passengers || ''}
                          onChange={handleChange}
                          min="1"
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Hotel Fields */}
                {bookingType === 'hotel' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Məkan
                      </label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                        placeholder="İstanbul, Türkiyə"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giriş tarixi
                        </label>
                        <input
                          type="date"
                          name="checkIn"
                          value={formData.checkIn || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Çıxış tarixi
                        </label>
                        <input
                          type="date"
                          name="checkOut"
                          value={formData.checkOut || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Otaq sayı
                        </label>
                        <input
                          type="number"
                          name="rooms"
                          value={formData.rooms || ''}
                          onChange={handleChange}
                          min="1"
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Qonaq sayı
                        </label>
                        <input
                          type="number"
                          name="guests"
                          value={formData.guests || ''}
                          onChange={handleChange}
                          min="1"
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                          placeholder="2"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Transfer Fields */}
                {bookingType === 'transfer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarix və vaxt
                    </label>
                    <input
                      type="datetime-local"
                      name="time"
                      value={formData.time || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  </div>
                )}

                {/* Insurance Fields */}
                {bookingType === 'insurance' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sığorta növü
                      </label>
                      <select
                        name="insuranceType"
                        value={formData.insuranceType || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                      >
                        <option value="">Seçin</option>
                        <option value="travel">Səyahət sığortası</option>
                        <option value="health">Sağlamlıq sığortası</option>
                        <option value="life">Həyat sığortası</option>
                      </select>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Başlama tarixi
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bitmə tarixi
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Embassy Fields */}
                {bookingType === 'embassy' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ölkə
                        </label>
                        <input
                          type="text"
                          name="embassyCountry"
                          value={formData.embassyCountry || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                          placeholder="Türkiyə"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Viza növü
                        </label>
                        <select
                          name="visaType"
                          value={formData.visaType || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm sm:text-base"
                        >
                          <option value="">Seçin</option>
                          <option value="tourist">Turist viza</option>
                          <option value="business">Biznes viza</option>
                          <option value="transit">Tranzit viza</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="urgent"
                        checked={formData.urgent || false}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Təcili xidmət
                      </label>
                    </div>
                  </>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Əlavə məlumat
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none text-sm sm:text-base"
                    placeholder="Əlavə məlumat və ya tələbləriniz..."
                  />
                </div>

                {submitStatus.type && (
                  <div
                    className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
                      submitStatus.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                >
                  {isSubmitting ? (
                    'Göndərilir...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      Sorğu Göndər
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

