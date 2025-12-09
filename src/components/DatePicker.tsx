import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  min?: string
  max?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export default function DatePicker({
  value,
  onChange,
  min,
  max,
  label,
  placeholder,
  required = false,
  disabled = false,
  className = '',
}: DatePickerProps) {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Update selectedDate when value prop changes
  useEffect(() => {
    if (value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setSelectedDate(date)
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
      }
    } else {
      setSelectedDate(null)
    }
  }, [value])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateDisabled = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    if (min && dateStr < min) return true
    if (max && dateStr > max) return true
    return false
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (!isDateDisabled(newDate)) {
      setSelectedDate(newDate)
      onChange(newDate.toISOString().split('T')[0])
      setIsOpen(false)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    // Use locale from i18n
    const locale = i18n.language === 'az' ? 'az-AZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US'
    return date.toLocaleDateString(locale, options)
  }

  const monthNames = [
    t('datePicker.months.january'),
    t('datePicker.months.february'),
    t('datePicker.months.march'),
    t('datePicker.months.april'),
    t('datePicker.months.may'),
    t('datePicker.months.june'),
    t('datePicker.months.july'),
    t('datePicker.months.august'),
    t('datePicker.months.september'),
    t('datePicker.months.october'),
    t('datePicker.months.november'),
    t('datePicker.months.december'),
  ]

  const weekDays = [
    t('datePicker.weekDays.monday'),
    t('datePicker.weekDays.tuesday'),
    t('datePicker.weekDays.wednesday'),
    t('datePicker.weekDays.thursday'),
    t('datePicker.weekDays.friday'),
    t('datePicker.weekDays.saturday'),
    t('datePicker.weekDays.sunday'),
  ]

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days: (number | null)[] = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const minDate = min ? new Date(min) : null
  const canGoPrev = !minDate || currentMonth > new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  const maxDate = max ? new Date(max) : null
  const canGoNext = !maxDate || currentMonth < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={formatDisplayDate(value)}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          placeholder={placeholder || t('datePicker.selectDate')}
          disabled={disabled}
          required={required}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={!canGoNext}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-xs font-medium text-gray-500 py-2">
                {day.substring(0, 2)}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="aspect-square" />
              }

              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
              const dateStr = date.toISOString().split('T')[0]
              const disabled = isDateDisabled(date)
              const selected = isDateSelected(date)
              const today = isToday(date)

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  disabled={disabled}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all
                    ${disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : selected
                      ? 'bg-primary-600 text-white'
                      : today
                      ? 'bg-primary-50 text-primary-600 border-2 border-primary-300'
                      : 'text-gray-700 hover:bg-gray-100'}
                    ${selected ? 'ring-2 ring-primary-300' : ''}
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Today button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                const today = new Date()
                const todayStr = today.toISOString().split('T')[0]
                if (!isDateDisabled(today)) {
                  setSelectedDate(today)
                  onChange(todayStr)
                  setIsOpen(false)
                }
              }}
              className="w-full px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              {t('datePicker.today')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}








