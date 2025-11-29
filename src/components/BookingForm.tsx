import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Plane, Hotel, Car, Shield, Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type BookingType = 'flight' | 'hotel' | 'transfer' | 'insurance' | 'embassy'
type TripType = 'one-way' | 'round-trip' | 'multi-city'

interface BookingFormData {
  type: BookingType
  name: string
  email: string
  phone: string
  // Flight
  tripType?: TripType
  from?: string
  to?: string
  returnFrom?: string
  returnTo?: string
  departureDate?: string
  returnDate?: string
  passengers?: string
  class?: string
  stops?: string
  // Multi-city
  segments?: Array<{ from: string; to: string; date: string }>
  // Hotel
  destination?: string
  checkIn?: string
  checkOut?: string
  rooms?: string
  guests?: string
  hotelType?: string
  // Transfer
  transferType?: string
  time?: string
  vehicleType?: string
  // Insurance
  insuranceType?: string
  package?: string
  startDate?: string
  endDate?: string
  coverage?: string
  // Embassy
  embassyCountry?: string
  visaType?: string
  urgent?: boolean
  // Common
  notes?: string
}

export default function BookingForm({ onBookingSuccess }: { onBookingSuccess?: () => void }) {
  const { t } = useTranslation()
  const [bookingType, setBookingType] = useState<BookingType>('flight')
  const [tripType, setTripType] = useState<TripType>('one-way')
  const [formData, setFormData] = useState<BookingFormData>({
    type: 'flight',
    name: '',
    email: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const [multiCitySegments, setMultiCitySegments] = useState([{ from: '', to: '', date: '' }])

  const bookingTypes = [
    { id: 'flight' as BookingType, label: t('booking.types.flight'), icon: Plane },
    { id: 'hotel' as BookingType, label: t('booking.types.hotel'), icon: Hotel },
    { id: 'transfer' as BookingType, label: t('booking.types.transfer'), icon: Car },
    { id: 'insurance' as BookingType, label: t('booking.types.insurance'), icon: Shield },
    { id: 'embassy' as BookingType, label: t('booking.types.embassy'), icon: Building2 },
  ]

  const handleTypeChange = (type: BookingType) => {
    setBookingType(type)
    setFormData({ ...formData, type })
    if (type !== 'flight') {
      setTripType('one-way')
    }
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

  const addMultiCitySegment = () => {
    setMultiCitySegments([...multiCitySegments, { from: '', to: '', date: '' }])
  }

  const removeMultiCitySegment = (index: number) => {
    setMultiCitySegments(multiCitySegments.filter((_, i) => i !== index))
  }

  const updateMultiCitySegment = (index: number, field: 'from' | 'to' | 'date', value: string) => {
    const updated = [...multiCitySegments]
    updated[index][field] = value
    setMultiCitySegments(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation: Email və ya telefon-dan ən azı biri mütləq olmalıdır
    if (!formData.email && !formData.phone) {
      setSubmitStatus({
        type: 'error',
        message: t('booking.validationError'),
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const submitData = { ...formData, type: bookingType }
      
      // Add trip type and multi-city segments for flights
      if (bookingType === 'flight') {
        submitData.tripType = tripType
        if (tripType === 'multi-city') {
          submitData.segments = multiCitySegments
        }
      }

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || t('booking.success'),
        })
        setFormData({
          type: bookingType,
          name: '',
          email: '',
          phone: '',
        })
        setMultiCitySegments([{ from: '', to: '', date: '' }])
        if (onBookingSuccess) {
          setTimeout(() => onBookingSuccess(), 2000)
        }
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || t('booking.error'),
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: t('booking.error'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('booking.title')}
        </h2>
        <div className="w-24 h-1 bg-primary-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">
          {t('booking.subtitle')}
        </p>
      </motion.div>

      {/* Booking Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {bookingTypes.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                bookingType === type.id
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-200 hover:border-primary-300 text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" />
              <span className="text-xs sm:text-sm font-medium block">{type.label}</span>
            </button>
          )
        })}
      </div>

      {/* Booking Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="bg-gray-50 p-6 lg:p-8 rounded-lg shadow-lg"
      >
        <div className="space-y-6">
          {/* Common Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder={t('booking.namePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.email')} <span className="text-gray-500 text-xs">({t('booking.emailOrPhone')})</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder={t('booking.emailPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('booking.phone')} <span className="text-gray-500 text-xs">({t('booking.phoneOrEmail')})</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder={t('booking.phonePlaceholder')}
            />
          </div>

          {/* Flight Fields */}
          {bookingType === 'flight' && (
            <>
              {/* Trip Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('booking.flight.tripType')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTripType('one-way')}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      tripType === 'one-way'
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {t('booking.flight.oneWay')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType('round-trip')}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      tripType === 'round-trip'
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {t('booking.flight.roundTrip')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType('multi-city')}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      tripType === 'multi-city'
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {t('booking.flight.multiCity')}
                  </button>
                </div>
              </div>

              {/* One-way or Round-trip */}
              {(tripType === 'one-way' || tripType === 'round-trip') && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('booking.flight.from')}
                      </label>
                      <input
                        type="text"
                        name="from"
                        value={formData.from || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder={t('booking.flight.fromPlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('booking.flight.to')}
                      </label>
                      <input
                        type="text"
                        name="to"
                        value={formData.to || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder={t('booking.flight.toPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('booking.flight.departureDate')}
                      </label>
                      <input
                        type="date"
                        name="departureDate"
                        value={formData.departureDate || ''}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                    {tripType === 'round-trip' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('booking.flight.returnDate')}
                        </label>
                        <input
                          type="date"
                          name="returnDate"
                          value={formData.returnDate || ''}
                          onChange={handleChange}
                          min={formData.departureDate || new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Multi-city */}
              {tripType === 'multi-city' && (
                <div className="space-y-4">
                  {multiCitySegments.map((segment, index) => (
                    <div key={index} className="grid md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {t('booking.flight.from')}
                        </label>
                        <input
                          type="text"
                          value={segment.from}
                          onChange={(e) => updateMultiCitySegment(index, 'from', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                          placeholder="Bakı"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {t('booking.flight.to')}
                        </label>
                        <input
                          type="text"
                          value={segment.to}
                          onChange={(e) => updateMultiCitySegment(index, 'to', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                          placeholder="İstanbul"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {t('booking.transfer.date')}
                        </label>
                        <input
                          type="date"
                          value={segment.date}
                          onChange={(e) => updateMultiCitySegment(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        {multiCitySegments.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMultiCitySegment(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                          >
                            {t('booking.flight.removeSegment')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMultiCitySegment}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    + {t('booking.flight.addSegment')} {t('booking.flight.segment')}
                  </button>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.hotel.guests')}
                  </label>
                  <input
                    type="number"
                    name="passengers"
                    value={formData.passengers || ''}
                    onChange={handleChange}
                    min="1"
                    max="9"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.flight.class')}
                  </label>
                  <select
                    name="class"
                    value={formData.class || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Seçin</option>
                    <option value="economy">Economy</option>
                    <option value="premium-economy">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.flight.stops')}
                  </label>
                  <select
                    name="stops"
                    value={formData.stops || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Fərq etmir</option>
                    <option value="nonstop">Birbaşa</option>
                    <option value="1-stop">1 stop</option>
                    <option value="2-stops">2+ stops</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Hotel Fields - Enhanced */}
          {bookingType === 'hotel' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.hotel.destination')}
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="İstanbul, Türkiyə"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.hotel.checkIn')}
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn || ''}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.hotel.checkOut')}
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut || ''}
                    onChange={handleChange}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.hotel.rooms')}
                  </label>
                  <input
                    type="number"
                    name="rooms"
                    value={formData.rooms || ''}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.hotel.guests')}
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests || ''}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.hotel.hotelType')}
                  </label>
                  <select
                    name="hotelType"
                    value={formData.hotelType || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Seçin</option>
                    <option value="budget">Budget</option>
                    <option value="3-star">3 Ulduz</option>
                    <option value="4-star">4 Ulduz</option>
                    <option value="5-star">5 Ulduz</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Transfer Fields - Enhanced */}
          {bookingType === 'transfer' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.transfer.transferType')}
                </label>
                <select
                  name="transferType"
                  value={formData.transferType || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">Seçin</option>
                  <option value="airport-hotel">Hava limanı → Otel</option>
                  <option value="hotel-airport">Otel → Hava limanı</option>
                  <option value="airport-airport">Hava limanı → Hava limanı</option>
                  <option value="city">Şəhər daxili</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.flight.from')}
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={formData.from || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Hava limanı və ya ünvan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.flight.to')}
                  </label>
                  <input
                    type="text"
                    name="to"
                    value={formData.to || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Otel və ya ünvan"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.transfer.date')}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ''}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.transfer.time')}
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.transfer.vehicleType')}
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Seçin</option>
                    <option value="sedan">Sedan (1-3 nəfər)</option>
                    <option value="suv">SUV (4-6 nəfər)</option>
                    <option value="van">Van (7-8 nəfər)</option>
                    <option value="bus">Avtobus (9+ nəfər)</option>
                  </select>
                </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="1"
                />
              </div>
            </>
          )}

          {/* Insurance Fields - Enhanced */}
          {bookingType === 'insurance' && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.insurance.insuranceType')}
                  </label>
                  <select
                    name="insuranceType"
                    value={formData.insuranceType || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Seçin</option>
                    <option value="travel">Səyahət sığortası</option>
                    <option value="health">Sağlamlıq sığortası</option>
                    <option value="life">Həyat sığortası</option>
                    <option value="baggage">Baqaj sığortası</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.insurance.package')}
                  </label>
                  <select
                    name="package"
                    value={formData.package || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Seçin</option>
                    <option value="basic">Əsas</option>
                    <option value="standard">Standart</option>
                    <option value="premium">Premium</option>
                    <option value="custom">Fərdi</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.insurance.startDate')}
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.insurance.endDate')}
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ''}
                    onChange={handleChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('booking.insurance.coverage')}
                </label>
                <select
                  name="coverage"
                  value={formData.coverage || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">Seçin</option>
                  <option value="europe">Avropa</option>
                  <option value="worldwide">Dünya üzrə</option>
                  <option value="schengen">Şengen</option>
                  <option value="custom">Fərdi</option>
                </select>
              </div>
            </>
          )}

          {/* Embassy Fields - Enhanced */}
          {bookingType === 'embassy' && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.embassy.country')}
                  </label>
                  <input
                    type="text"
                    name="embassyCountry"
                    value={formData.embassyCountry || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Türkiyə"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking.embassy.visaType')}
                  </label>
                  <select
                    name="visaType"
                    value={formData.visaType || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Seçin</option>
                    <option value="tourist">Turist viza</option>
                    <option value="business">Biznes viza</option>
                    <option value="student">Tələbə viza</option>
                    <option value="work">İş viza</option>
                    <option value="transit">Tranzit viza</option>
                    <option value="medical">Tibbi viza</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="urgent"
                    checked={formData.urgent || false}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{t('booking.embassy.urgent')}</span>
                </label>
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('booking.notes')}
            </label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              placeholder={t('booking.notes')}
            />
          </div>

          {submitStatus.type && (
            <div
              className={`p-4 rounded-lg ${
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
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              t('contactInfo.sending')
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('booking.submit')}
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
