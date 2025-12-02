import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Plane, Hotel, Car, Shield, Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import DatePicker from './DatePicker'

type BookingType = 'flight' | 'hotel' | 'transfer' | 'insurance' | 'embassy'
type TripType = 'one-way' | 'round-trip' | 'multi-city'

interface PassengerInfo {
  adults: number
  children: number
  infants: number
  seniors?: number
  childAges?: (number | string | undefined)[] // Array of ages for children (can be string during editing, undefined for empty)
  infantAges?: number[] // Array of ages for infants (months)
}

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
  passengerInfo?: PassengerInfo
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
  guestInfo?: PassengerInfo
  hotelType?: string
  // Transfer
  transferType?: string
  date?: string
  time?: string
  vehicleType?: string
  transferPassengers?: string
  transferPassengerInfo?: PassengerInfo
  // Insurance
  insuranceType?: string
  package?: string
  startDate?: string
  endDate?: string
  coverage?: string
  insuranceTravelers?: string
  insuranceTravelerInfo?: PassengerInfo
  // Embassy
  embassyCountry?: string
  visaType?: string
  urgent?: boolean
  embassyTravelers?: string
  embassyTravelerInfo?: PassengerInfo
  // Common
  notes?: string
}

export default function BookingForm({ initialType = 'flight', onBookingSuccess }: { initialType?: BookingType; onBookingSuccess?: () => void }) {
  const { t } = useTranslation()
  const [bookingType, setBookingType] = useState<BookingType>(initialType)
  const [tripType, setTripType] = useState<TripType>('one-way')
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
  const [multiCitySegments, setMultiCitySegments] = useState([{ from: '', to: '', date: '' }])
  
  // Passenger info state
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo>({
    adults: 1,
    children: 0,
    infants: 0,
    seniors: 0,
    childAges: [],
    infantAges: [],
  })
  
  const [guestInfo, setGuestInfo] = useState<PassengerInfo>({
    adults: 1,
    children: 0,
    infants: 0,
    seniors: 0,
    childAges: [],
    infantAges: [],
  })
  
  const [transferPassengerInfo, setTransferPassengerInfo] = useState<PassengerInfo>({
    adults: 1,
    children: 0,
    infants: 0,
    seniors: 0,
    childAges: [],
    infantAges: [],
  })

  const [insuranceTravelerInfo, setInsuranceTravelerInfo] = useState<PassengerInfo>({
    adults: 1,
    children: 0,
    infants: 0,
    seniors: 0,
    childAges: [],
    infantAges: [],
  })

  const [embassyTravelerInfo, setEmbassyTravelerInfo] = useState<PassengerInfo>({
    adults: 1,
    children: 0,
    infants: 0,
    seniors: 0,
    childAges: [],
    infantAges: [],
  })

  // Update bookingType when initialType changes (e.g., when modal opens with different service)
  useEffect(() => {
    setBookingType(initialType)
    setFormData(prev => ({ ...prev, type: initialType }))
    // Reset trip type when switching to flight
    if (initialType === 'flight') {
      setTripType('one-way')
    }
  }, [initialType])

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

    // Date validation - kronologiya yoxlaması
    if (bookingType === 'flight' && tripType === 'round-trip') {
      if (formData.departureDate && formData.returnDate && formData.returnDate < formData.departureDate) {
        setSubmitStatus({
          type: 'error',
          message: t('booking.dateValidation.returnBeforeDeparture'),
        })
        return
      }
    }

    if (bookingType === 'hotel') {
      if (formData.checkIn && formData.checkOut && formData.checkOut <= formData.checkIn) {
        setSubmitStatus({
          type: 'error',
          message: t('booking.dateValidation.checkOutBeforeCheckIn'),
        })
        return
      }
    }

    if (bookingType === 'insurance') {
      if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
        setSubmitStatus({
          type: 'error',
          message: t('booking.dateValidation.endBeforeStart'),
        })
        return
      }
    }

    // Multi-city date validation
    if (bookingType === 'flight' && tripType === 'multi-city') {
      for (let i = 1; i < multiCitySegments.length; i++) {
        const prevDate = multiCitySegments[i - 1].date
        const currDate = multiCitySegments[i].date
        if (prevDate && currDate && currDate < prevDate) {
          setSubmitStatus({
            type: 'error',
            message: t('booking.dateValidation.multiCityChronology'),
          })
          return
        }
      }
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const submitData = { ...formData, type: bookingType }
      
      // Helper function to clean childAges array (remove undefined values)
      const cleanChildAges = (ages?: (number | undefined)[]): number[] | undefined => {
        if (!ages || ages.length === 0) return undefined
        const cleaned = ages.filter((age): age is number => age !== undefined && age !== null)
        return cleaned.length > 0 ? cleaned : undefined
      }

      // Add trip type and multi-city segments for flights
      if (bookingType === 'flight') {
        submitData.tripType = tripType
        submitData.passengerInfo = {
          ...passengerInfo,
          childAges: cleanChildAges(passengerInfo.childAges)
        }
        if (tripType === 'multi-city') {
          submitData.segments = multiCitySegments
        }
      }
      
      // Add guest info for hotels
      if (bookingType === 'hotel') {
        submitData.guestInfo = {
          ...guestInfo,
          childAges: cleanChildAges(guestInfo.childAges)
        }
      }
      
      // Add passenger info for transfers
      if (bookingType === 'transfer') {
        submitData.transferPassengerInfo = {
          ...transferPassengerInfo,
          childAges: cleanChildAges(transferPassengerInfo.childAges)
        }
      }
      
      // Add traveler info for insurance
      if (bookingType === 'insurance') {
        submitData.insuranceTravelerInfo = {
          ...insuranceTravelerInfo,
          childAges: cleanChildAges(insuranceTravelerInfo.childAges)
        }
      }
      
      // Add traveler info for embassy
      if (bookingType === 'embassy') {
        submitData.embassyTravelerInfo = {
          ...embassyTravelerInfo,
          childAges: cleanChildAges(embassyTravelerInfo.childAges)
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
        // Log API error response
        try {
          await fetch('/api/error-logger', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'API_ERROR_RESPONSE',
              endpoint: '/api/booking',
              message: data.message || 'Booking submission failed',
              data: {
                bookingType,
                responseStatus: response.status,
                responseData: data,
              },
            }),
          }).catch(err => console.error('Failed to log error:', err));
        } catch (logError) {
          console.error('Error logging failed:', logError);
        }
        
        setSubmitStatus({
          type: 'error',
          message: data.message || t('booking.error'),
        })
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      // Log error to Google Sheets
      try {
        await fetch('/api/error-logger', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'FRONTEND_ERROR',
            endpoint: 'BookingForm',
            message: error.message || String(error),
            stack: error.stack || '',
            data: {
              bookingType,
              formData: {
                ...formData,
                // Don't log sensitive data
                email: formData.email ? '***' : '',
                phone: formData.phone ? '***' : '',
              },
            },
          }),
        }).catch(err => console.error('Failed to log error:', err));
      } catch (logError) {
        console.error('Error logging failed:', logError);
      }
      
      setSubmitStatus({
        type: 'error',
        message: data?.message || t('booking.error'),
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
                    <DatePicker
                      value={formData.departureDate || ''}
                      onChange={(date) => {
                        setFormData({ ...formData, departureDate: date })
                        // If return date is before new departure date, clear it
                        if (formData.returnDate && date && formData.returnDate < date) {
                          setFormData(prev => ({ ...prev, returnDate: '' }))
                        }
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      label={t('booking.flight.departureDate')}
                      required
                    />
                    {tripType === 'round-trip' && (
                      <DatePicker
                        value={formData.returnDate || ''}
                        onChange={(date) => setFormData({ ...formData, returnDate: date })}
                        min={formData.departureDate || new Date().toISOString().split('T')[0]}
                        label={t('booking.flight.returnDate')}
                        required
                      />
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
                          placeholder={t('booking.flight.fromPlaceholder')}
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
                          placeholder={t('booking.flight.toPlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {t('booking.transfer.date')}
                        </label>
                        <DatePicker
                          value={segment.date}
                          onChange={(date) => updateMultiCitySegment(index, 'date', date)}
                          min={index > 0 && multiCitySegments[index - 1].date ? multiCitySegments[index - 1].date : new Date().toISOString().split('T')[0]}
                          className="text-sm"
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

              {/* Passenger Details */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">{t('booking.flight.passengerDetails')}</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.flight.adults')} (12+)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="9"
                      value={passengerInfo.adults}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setPassengerInfo({ ...passengerInfo, adults: val })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.flight.children')} (2-11)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="9"
                      value={passengerInfo.children}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        const newAges = Array(val).fill(0).map((_, i) => passengerInfo.childAges?.[i] ?? 5)
                        setPassengerInfo({ ...passengerInfo, children: val, childAges: newAges })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.flight.infants')} (0-23 ay)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="9"
                      value={passengerInfo.infants}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        const newAges = Array(val).fill(0).map((_, i) => passengerInfo.infantAges?.[i] || 6)
                        setPassengerInfo({ ...passengerInfo, infants: val, infantAges: newAges })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.flight.seniors')} (65+)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="9"
                      value={passengerInfo.seniors || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setPassengerInfo({ ...passengerInfo, seniors: val })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                </div>
                {passengerInfo.children > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.flight.childAge')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array(passengerInfo.children).fill(0).map((_, i) => (
                        <input
                          key={`child-age-flight-${i}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={(() => {
                            const age = passengerInfo.childAges?.[i]
                            if (age === undefined || age === null) return ''
                            if (typeof age === 'string') return age
                            return String(age)
                          })()}
                          onChange={(e) => {
                            const inputValue = e.target.value
                            const newAges = [...(passengerInfo.childAges || [])]
                            
                            // Allow empty string - store as empty string, not undefined
                            if (inputValue === '') {
                              newAges[i] = ''
                              setPassengerInfo(prev => ({ ...prev, childAges: newAges }))
                              return
                            }
                            
                            // Only allow digits
                            const numericValue = inputValue.replace(/[^\d]/g, '')
                            
                            if (numericValue === '') {
                              newAges[i] = ''
                              setPassengerInfo(prev => ({ ...prev, childAges: newAges }))
                              return
                            }
                            
                            // Store as string while typing, validate on blur
                            const numVal = parseInt(numericValue, 10)
                            if (!isNaN(numVal) && numVal >= 2 && numVal <= 11) {
                              newAges[i] = numericValue // Store as string
                              setPassengerInfo(prev => ({ ...prev, childAges: newAges }))
                            } else {
                              // Invalid number, but allow typing
                              newAges[i] = numericValue
                              setPassengerInfo(prev => ({ ...prev, childAges: newAges }))
                            }
                          }}
                          onBlur={(e) => {
                            const val = e.target.value.trim()
                            const newAges = [...(passengerInfo.childAges || [])]
                            
                            if (val === '') {
                              newAges[i] = undefined
                            } else {
                              const numVal = parseInt(val, 10)
                              if (!isNaN(numVal) && numVal >= 2 && numVal <= 11) {
                                newAges[i] = numVal // Convert to number on blur
                              } else {
                                newAges[i] = undefined // Invalid, clear it
                              }
                            }
                            setPassengerInfo(prev => ({ ...prev, childAges: newAges }))
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-xs transition-colors"
                          placeholder={`Uşaq ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {passengerInfo.infants > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.flight.infantAge')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array(passengerInfo.infants).fill(0).map((_, i) => (
                        <input
                          key={i}
                          type="number"
                          min="0"
                          max="23"
                          value={passengerInfo.infantAges?.[i] || 6}
                          onChange={(e) => {
                            const newAges = [...(passengerInfo.infantAges || [])]
                            newAges[i] = parseInt(e.target.value) || 6
                            setPassengerInfo({ ...passengerInfo, infantAges: newAges })
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-xs"
                          placeholder={`Körpə ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {t('booking.flight.totalPassengers')}: {passengerInfo.adults + passengerInfo.children + passengerInfo.infants + (passengerInfo.seniors || 0)}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
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
                    <option value="">{t('booking.flight.select')}</option>
                    <option value="economy">{t('booking.flight.classOptions.economy')}</option>
                    <option value="premium-economy">{t('booking.flight.classOptions.premiumEconomy')}</option>
                    <option value="business">{t('booking.flight.classOptions.business')}</option>
                    <option value="first">{t('booking.flight.classOptions.first')}</option>
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
                    <option value="">{t('booking.flight.stopsOptions.any')}</option>
                    <option value="nonstop">{t('booking.flight.stopsOptions.nonstop')}</option>
                    <option value="1-stop">{t('booking.flight.stopsOptions.1stop')}</option>
                    <option value="2-stops">{t('booking.flight.stopsOptions.2stops')}</option>
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
                  placeholder={t('booking.hotel.destination')}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <DatePicker
                  value={formData.checkIn || ''}
                  onChange={(date) => {
                    setFormData({ ...formData, checkIn: date })
                    // If check-out is before new check-in, clear it
                    if (formData.checkOut && date && formData.checkOut < date) {
                      setFormData(prev => ({ ...prev, checkOut: '' }))
                    }
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  label={t('booking.hotel.checkIn')}
                  required
                />
                <DatePicker
                  value={formData.checkOut || ''}
                  onChange={(date) => setFormData({ ...formData, checkOut: date })}
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  label={t('booking.hotel.checkOut')}
                  required
                />
              </div>
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

              {/* Guest Details */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">{t('booking.hotel.guestDetails')}</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.hotel.adults')} (18+)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={guestInfo.adults}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setGuestInfo({ ...guestInfo, adults: val })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.hotel.children')} (2-17)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={guestInfo.children}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        const newAges = Array(val).fill(0).map((_, i) => guestInfo.childAges?.[i] ?? 5)
                        setGuestInfo({ ...guestInfo, children: val, childAges: newAges })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.hotel.infants')} (0-23 ay)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={guestInfo.infants}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        const newAges = Array(val).fill(0).map((_, i) => guestInfo.infantAges?.[i] || 6)
                        setGuestInfo({ ...guestInfo, infants: val, infantAges: newAges })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.hotel.seniors')} (65+)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={guestInfo.seniors || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setGuestInfo({ ...guestInfo, seniors: val })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                </div>
                {guestInfo.children > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.hotel.childAge')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array(guestInfo.children).fill(0).map((_, i) => (
                        <input
                          key={`child-age-hotel-${i}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={(() => {
                            const age = guestInfo.childAges?.[i]
                            if (age === undefined || age === null) return ''
                            if (typeof age === 'string') return age
                            return String(age)
                          })()}
                          onChange={(e) => {
                            const inputValue = e.target.value
                            const newAges = [...(guestInfo.childAges || [])]
                            
                            if (inputValue === '') {
                              newAges[i] = ''
                              setGuestInfo(prev => ({ ...prev, childAges: newAges }))
                              return
                            }
                            
                            const numericValue = inputValue.replace(/[^\d]/g, '')
                            
                            if (numericValue === '') {
                              newAges[i] = ''
                              setGuestInfo(prev => ({ ...prev, childAges: newAges }))
                              return
                            }
                            
                            const numVal = parseInt(numericValue, 10)
                            if (!isNaN(numVal) && numVal >= 2 && numVal <= 17) {
                              newAges[i] = numericValue
                              setGuestInfo(prev => ({ ...prev, childAges: newAges }))
                            } else {
                              newAges[i] = numericValue
                              setGuestInfo(prev => ({ ...prev, childAges: newAges }))
                            }
                          }}
                          onBlur={(e) => {
                            const val = e.target.value.trim()
                            const newAges = [...(guestInfo.childAges || [])]
                            
                            if (val === '') {
                              newAges[i] = undefined
                            } else {
                              const numVal = parseInt(val, 10)
                              if (!isNaN(numVal) && numVal >= 2 && numVal <= 17) {
                                newAges[i] = numVal
                              } else {
                                newAges[i] = undefined
                              }
                            }
                            setGuestInfo(prev => ({ ...prev, childAges: newAges }))
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-xs transition-colors"
                          placeholder={`${t('booking.hotel.child')} ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {guestInfo.infants > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.hotel.infantAge')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array(guestInfo.infants).fill(0).map((_, i) => (
                        <input
                          key={i}
                          type="number"
                          min="0"
                          max="23"
                          value={guestInfo.infantAges?.[i] || 6}
                          onChange={(e) => {
                            const newAges = [...(guestInfo.infantAges || [])]
                            newAges[i] = parseInt(e.target.value) || 6
                            setGuestInfo({ ...guestInfo, infantAges: newAges })
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-xs"
                          placeholder={`${t('booking.hotel.infant')} ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {t('booking.hotel.totalGuests')}: {guestInfo.adults + guestInfo.children + guestInfo.infants + (guestInfo.seniors || 0)}
                  </p>
                </div>
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
                  <option value="">{t('booking.flight.select')}</option>
                  <option value="budget">{t('booking.hotel.hotelTypeOptions.budget')}</option>
                  <option value="3-star">{t('booking.hotel.hotelTypeOptions.3star')}</option>
                  <option value="4-star">{t('booking.hotel.hotelTypeOptions.4star')}</option>
                  <option value="5-star">{t('booking.hotel.hotelTypeOptions.5star')}</option>
                  <option value="luxury">{t('booking.hotel.hotelTypeOptions.luxury')}</option>
                </select>
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
                  <option value="">{t('booking.flight.select')}</option>
                  <option value="airport-hotel">{t('booking.transfer.transferTypeOptions.airportHotel')}</option>
                  <option value="hotel-airport">{t('booking.transfer.transferTypeOptions.hotelAirport')}</option>
                  <option value="airport-airport">{t('booking.transfer.transferTypeOptions.airportAirport')}</option>
                  <option value="city">{t('booking.transfer.transferTypeOptions.city')}</option>
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
                    placeholder={t('booking.flight.airportPlaceholder')}
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
                    placeholder={t('booking.flight.hotelPlaceholder')}
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
                    <option value="">{t('booking.flight.select')}</option>
                    <option value="sedan">{t('booking.transfer.vehicleTypeOptions.sedan')}</option>
                    <option value="suv">{t('booking.transfer.vehicleTypeOptions.suv')}</option>
                    <option value="van">{t('booking.transfer.vehicleTypeOptions.van')}</option>
                    <option value="bus">{t('booking.transfer.vehicleTypeOptions.bus')}</option>
                  </select>
                </div>
              </div>

              {/* Transfer Passenger Details */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">{t('booking.transfer.passengerDetails')}</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.transfer.adults')} (18+)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={transferPassengerInfo.adults}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setTransferPassengerInfo({ ...transferPassengerInfo, adults: val })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.transfer.children')} (2-17)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={transferPassengerInfo.children}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        const newAges = Array(val).fill(0).map((_, i) => transferPassengerInfo.childAges?.[i] ?? 5)
                        setTransferPassengerInfo({ ...transferPassengerInfo, children: val, childAges: newAges })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.transfer.infants')} (0-23 ay)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={transferPassengerInfo.infants}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        const newAges = Array(val).fill(0).map((_, i) => transferPassengerInfo.infantAges?.[i] || 6)
                        setTransferPassengerInfo({ ...transferPassengerInfo, infants: val, infantAges: newAges })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.transfer.seniors')} (65+)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={transferPassengerInfo.seniors || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setTransferPassengerInfo({ ...transferPassengerInfo, seniors: val })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                </div>
                {transferPassengerInfo.children > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.transfer.childAge')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array(transferPassengerInfo.children).fill(0).map((_, i) => (
                        <input
                          key={`child-age-transfer-${i}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={(() => {
                            const age = transferPassengerInfo.childAges?.[i]
                            if (age === undefined || age === null) return ''
                            if (typeof age === 'string') return age
                            return String(age)
                          })()}
                          onChange={(e) => {
                            const inputValue = e.target.value
                            const newAges = [...(transferPassengerInfo.childAges || [])]
                            
                            if (inputValue === '') {
                              newAges[i] = ''
                              setTransferPassengerInfo(prev => ({ ...prev, childAges: newAges }))
                              return
                            }
                            
                            const numericValue = inputValue.replace(/[^\d]/g, '')
                            
                            if (numericValue === '') {
                              newAges[i] = ''
                              setTransferPassengerInfo(prev => ({ ...prev, childAges: newAges }))
                              return
                            }
                            
                            const numVal = parseInt(numericValue, 10)
                            if (!isNaN(numVal) && numVal >= 2 && numVal <= 17) {
                              newAges[i] = numericValue
                              setTransferPassengerInfo(prev => ({ ...prev, childAges: newAges }))
                            } else {
                              newAges[i] = numericValue
                              setTransferPassengerInfo(prev => ({ ...prev, childAges: newAges }))
                            }
                          }}
                          onBlur={(e) => {
                            const val = e.target.value.trim()
                            const newAges = [...(transferPassengerInfo.childAges || [])]
                            
                            if (val === '') {
                              newAges[i] = undefined
                            } else {
                              const numVal = parseInt(val, 10)
                              if (!isNaN(numVal) && numVal >= 2 && numVal <= 17) {
                                newAges[i] = numVal
                              } else {
                                newAges[i] = undefined
                              }
                            }
                            setTransferPassengerInfo(prev => ({ ...prev, childAges: newAges }))
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-xs transition-colors"
                          placeholder={`${t('booking.transfer.child')} ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {transferPassengerInfo.infants > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.transfer.infantAge')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array(transferPassengerInfo.infants).fill(0).map((_, i) => (
                        <input
                          key={i}
                          type="number"
                          min="0"
                          max="23"
                          value={transferPassengerInfo.infantAges?.[i] || 6}
                          onChange={(e) => {
                            const newAges = [...(transferPassengerInfo.infantAges || [])]
                            newAges[i] = parseInt(e.target.value) || 6
                            setTransferPassengerInfo({ ...transferPassengerInfo, infantAges: newAges })
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-xs"
                          placeholder={`${t('booking.transfer.infant')} ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {t('booking.transfer.totalPassengers')}: {transferPassengerInfo.adults + transferPassengerInfo.children + transferPassengerInfo.infants + (transferPassengerInfo.seniors || 0)}
                  </p>
                </div>
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
                    <option value="">{t('booking.flight.select')}</option>
                    <option value="travel">{t('booking.insurance.insuranceTypeOptions.travel')}</option>
                    <option value="health">{t('booking.insurance.insuranceTypeOptions.health')}</option>
                    <option value="life">{t('booking.insurance.insuranceTypeOptions.life')}</option>
                    <option value="baggage">{t('booking.insurance.insuranceTypeOptions.baggage')}</option>
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
                    <option value="">{t('booking.flight.select')}</option>
                    <option value="basic">{t('booking.insurance.packageOptions.basic')}</option>
                    <option value="standard">{t('booking.insurance.packageOptions.standard')}</option>
                    <option value="premium">{t('booking.insurance.packageOptions.premium')}</option>
                    <option value="custom">{t('booking.insurance.packageOptions.custom')}</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <DatePicker
                  value={formData.startDate || ''}
                  onChange={(date) => {
                    setFormData({ ...formData, startDate: date })
                    // If end date is before new start date, clear it
                    if (formData.endDate && date && formData.endDate < date) {
                      setFormData(prev => ({ ...prev, endDate: '' }))
                    }
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  label={t('booking.insurance.startDate')}
                  required
                />
                <DatePicker
                  value={formData.endDate || ''}
                  onChange={(date) => setFormData({ ...formData, endDate: date })}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  label={t('booking.insurance.endDate')}
                  required
                />
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
                  <option value="">{t('booking.flight.select')}</option>
                  <option value="europe">{t('booking.insurance.coverageOptions.europe')}</option>
                  <option value="worldwide">{t('booking.insurance.coverageOptions.worldwide')}</option>
                  <option value="schengen">{t('booking.insurance.coverageOptions.schengen')}</option>
                  <option value="custom">{t('booking.insurance.coverageOptions.custom')}</option>
                </select>
              </div>

              {/* Insurance Traveler Details */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">{t('booking.insurance.travelerDetails')}</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.insurance.adults')} (18+)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={insuranceTravelerInfo.adults}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setInsuranceTravelerInfo({ ...insuranceTravelerInfo, adults: val })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.insurance.children')} (2-17)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={insuranceTravelerInfo.children}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        const newAges = Array(val).fill(0).map((_, i) => insuranceTravelerInfo.childAges?.[i] ?? 5)
                        setInsuranceTravelerInfo({ ...insuranceTravelerInfo, children: val, childAges: newAges })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.insurance.infants')} (0-23 ay)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={insuranceTravelerInfo.infants}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        const newAges = Array(val).fill(0).map((_, i) => insuranceTravelerInfo.infantAges?.[i] || 6)
                        setInsuranceTravelerInfo({ ...insuranceTravelerInfo, infants: val, infantAges: newAges })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.insurance.seniors')} (65+)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={insuranceTravelerInfo.seniors || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setInsuranceTravelerInfo({ ...insuranceTravelerInfo, seniors: val })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                </div>
                {insuranceTravelerInfo.children > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.insurance.childAge')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array(insuranceTravelerInfo.children).fill(0).map((_, i) => (
                        <input
                          key={`child-age-insurance-${i}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={(() => {
                            const age = insuranceTravelerInfo.childAges?.[i]
                            if (age === undefined || age === null) return ''
                            if (typeof age === 'string') return age
                            return String(age)
                          })()}
                          onChange={(e) => {
                            const inputValue = e.target.value
                            const newAges = [...(insuranceTravelerInfo.childAges || [])]
                            
                            if (inputValue === '') {
                              newAges[i] = ''
                              setInsuranceTravelerInfo(prev => ({ ...prev, childAges: newAges }))
                              return
                            }
                            
                            const numericValue = inputValue.replace(/[^\d]/g, '')
                            
                            if (numericValue === '') {
                              newAges[i] = ''
                              setInsuranceTravelerInfo(prev => ({ ...prev, childAges: newAges }))
                              return
                            }
                            
                            const numVal = parseInt(numericValue, 10)
                            if (!isNaN(numVal) && numVal >= 2 && numVal <= 17) {
                              newAges[i] = numericValue
                              setInsuranceTravelerInfo(prev => ({ ...prev, childAges: newAges }))
                            } else {
                              newAges[i] = numericValue
                              setInsuranceTravelerInfo(prev => ({ ...prev, childAges: newAges }))
                            }
                          }}
                          onBlur={(e) => {
                            const val = e.target.value.trim()
                            const newAges = [...(insuranceTravelerInfo.childAges || [])]
                            
                            if (val === '') {
                              newAges[i] = undefined
                            } else {
                              const numVal = parseInt(val, 10)
                              if (!isNaN(numVal) && numVal >= 2 && numVal <= 17) {
                                newAges[i] = numVal
                              } else {
                                newAges[i] = undefined
                              }
                            }
                            setInsuranceTravelerInfo(prev => ({ ...prev, childAges: newAges }))
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-xs transition-colors"
                          placeholder={`${t('booking.insurance.child')} ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {insuranceTravelerInfo.infants > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.insurance.infantAge')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array(insuranceTravelerInfo.infants).fill(0).map((_, i) => (
                        <input
                          key={i}
                          type="number"
                          min="0"
                          max="23"
                          value={insuranceTravelerInfo.infantAges?.[i] || 6}
                          onChange={(e) => {
                            const newAges = [...(insuranceTravelerInfo.infantAges || [])]
                            newAges[i] = parseInt(e.target.value) || 6
                            setInsuranceTravelerInfo({ ...insuranceTravelerInfo, infantAges: newAges })
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-xs"
                          placeholder={`${t('booking.insurance.infant')} ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {t('booking.insurance.totalTravelers')}: {insuranceTravelerInfo.adults + insuranceTravelerInfo.children + insuranceTravelerInfo.infants + (insuranceTravelerInfo.seniors || 0)}
                  </p>
                </div>
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
                    placeholder={t('booking.flight.countryPlaceholder')}
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
                    <option value="">{t('booking.flight.select')}</option>
                    <option value="tourist">{t('booking.embassy.visaTypeOptions.tourist')}</option>
                    <option value="business">{t('booking.embassy.visaTypeOptions.business')}</option>
                    <option value="student">{t('booking.embassy.visaTypeOptions.student')}</option>
                    <option value="work">{t('booking.embassy.visaTypeOptions.work')}</option>
                    <option value="transit">{t('booking.embassy.visaTypeOptions.transit')}</option>
                    <option value="medical">{t('booking.embassy.visaTypeOptions.medical')}</option>
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

              {/* Embassy Traveler Details */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">{t('booking.embassy.travelerDetails')}</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.embassy.adults')} (18+)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={embassyTravelerInfo.adults}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setEmbassyTravelerInfo({ ...embassyTravelerInfo, adults: val })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.embassy.children')} (2-17)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={embassyTravelerInfo.children}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        const newAges = Array(val).fill(0).map((_, i) => embassyTravelerInfo.childAges?.[i] ?? 5)
                        setEmbassyTravelerInfo({ ...embassyTravelerInfo, children: val, childAges: newAges })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.embassy.infants')} (0-23 ay)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={embassyTravelerInfo.infants}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        const newAges = Array(val).fill(0).map((_, i) => embassyTravelerInfo.infantAges?.[i] || 6)
                        setEmbassyTravelerInfo({ ...embassyTravelerInfo, infants: val, infantAges: newAges })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.embassy.seniors')} (65+)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={embassyTravelerInfo.seniors || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0
                        setEmbassyTravelerInfo({ ...embassyTravelerInfo, seniors: val })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                </div>
                {embassyTravelerInfo.children > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.embassy.childAge')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array(embassyTravelerInfo.children).fill(0).map((_, i) => (
                        <input
                          key={`child-age-embassy-${i}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={(() => {
                            const age = embassyTravelerInfo.childAges?.[i]
                            if (age === undefined || age === null) return ''
                            if (typeof age === 'string') return age
                            return String(age)
                          })()}
                          onChange={(e) => {
                            const inputValue = e.target.value
                            const newAges = [...(embassyTravelerInfo.childAges || [])]
                            
                            if (inputValue === '') {
                              newAges[i] = ''
                              setEmbassyTravelerInfo(prev => ({ ...prev, childAges: newAges }))
                              return
                            }
                            
                            const numericValue = inputValue.replace(/[^\d]/g, '')
                            
                            if (numericValue === '') {
                              newAges[i] = ''
                              setEmbassyTravelerInfo(prev => ({ ...prev, childAges: newAges }))
                              return
                            }
                            
                            const numVal = parseInt(numericValue, 10)
                            if (!isNaN(numVal) && numVal >= 2 && numVal <= 17) {
                              newAges[i] = numericValue
                              setEmbassyTravelerInfo(prev => ({ ...prev, childAges: newAges }))
                            } else {
                              newAges[i] = numericValue
                              setEmbassyTravelerInfo(prev => ({ ...prev, childAges: newAges }))
                            }
                          }}
                          onBlur={(e) => {
                            const val = e.target.value.trim()
                            const newAges = [...(embassyTravelerInfo.childAges || [])]
                            
                            if (val === '') {
                              newAges[i] = undefined
                            } else {
                              const numVal = parseInt(val, 10)
                              if (!isNaN(numVal) && numVal >= 2 && numVal <= 17) {
                                newAges[i] = numVal
                              } else {
                                newAges[i] = undefined
                              }
                            }
                            setEmbassyTravelerInfo(prev => ({ ...prev, childAges: newAges }))
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-xs transition-colors"
                          placeholder={`${t('booking.embassy.child')} ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {embassyTravelerInfo.infants > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {t('booking.embassy.infantAge')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Array(embassyTravelerInfo.infants).fill(0).map((_, i) => (
                        <input
                          key={i}
                          type="number"
                          min="0"
                          max="23"
                          value={embassyTravelerInfo.infantAges?.[i] || 6}
                          onChange={(e) => {
                            const newAges = [...(embassyTravelerInfo.infantAges || [])]
                            newAges[i] = parseInt(e.target.value) || 6
                            setEmbassyTravelerInfo({ ...embassyTravelerInfo, infantAges: newAges })
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 outline-none text-xs"
                          placeholder={`${t('booking.embassy.infant')} ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {t('booking.embassy.totalTravelers')}: {embassyTravelerInfo.adults + embassyTravelerInfo.children + embassyTravelerInfo.infants + (embassyTravelerInfo.seniors || 0)}
                  </p>
                </div>
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
