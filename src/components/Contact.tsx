import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MapPin, Phone, Linkedin, Instagram, MessageCircle, FileText, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import BookingForm from './BookingForm'

export default function Contact() {
  const { t } = useTranslation()
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || t('contact.success'),
        })
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => {
          const messageElement = document.querySelector('[data-success-message]')
          if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 100)
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || t('contact.error'),
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: t('contact.error'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className="py-24 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t('contact.title')}
          </h2>
          <div className="w-16 h-0.5 bg-primary-600 mx-auto mb-4"></div>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contactInfo.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                {t('contactInfo.description')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-primary-100 rounded-lg flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{t('contact.email')}</h4>
                  <a
                    href="mailto:ibrahim.abdullayev1@gmail.com"
                    className="text-sm sm:text-base text-primary-600 hover:text-primary-700 break-all"
                  >
                    ibrahim.abdullayev1@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-primary-100 rounded-lg flex-shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{t('contact.phone')}</h4>
                  <a
                    href="tel:+994555973923"
                    className="text-sm sm:text-base text-primary-600 hover:text-primary-700"
                  >
                    +994 55 597 39 23
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-primary-100 rounded-lg flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{t('contact.address')}</h4>
                  <p className="text-sm sm:text-base text-gray-600">Baku, Rashid Behbudov str, Azerbaijan</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6 sm:mt-8">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                {t('contactInfo.socialMedia')}
              </h4>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <a
                  href="https://linkedin.com/in/ibrahim-abdullayev-7bb887152"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 rounded-lg hover:bg-primary-50 active:bg-primary-100 transition-colors touch-manipulation"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  <span className="text-xs sm:text-sm text-gray-700">LinkedIn</span>
                </a>
                <a
                  href="https://instagram.com/ibrahim_abdullar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 rounded-lg hover:bg-primary-50 active:bg-primary-100 transition-colors touch-manipulation"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  <span className="text-xs sm:text-sm text-gray-700">Instagram</span>
                </a>
                <a
                  href="https://wa.me/994555973923"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 rounded-lg hover:bg-primary-50 active:bg-primary-100 transition-colors touch-manipulation"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  <span className="text-xs sm:text-sm text-gray-700">WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Toggle Button */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setShowContactForm(false)}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  !showContactForm
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                {t('contact.bookingRequest')}
              </button>
              <button
                onClick={() => setShowContactForm(true)}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  showContactForm
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                {t('contact.sendMessage')}
              </button>
            </div>

            {/* Booking Form (Default) */}
            {!showContactForm && (
              <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-lg border border-gray-100">
                <BookingForm />
              </div>
            )}

            {/* Contact Form */}
            {showContactForm && (
              <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 lg:p-8 rounded-lg border border-gray-100">
                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t('contactInfo.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                      placeholder={t('contactInfo.namePlaceholder')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t('contact.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                      placeholder={t('contact.emailPlaceholder')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t('contactInfo.subject')}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                      placeholder={t('contactInfo.subjectPlaceholder')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t('contactInfo.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none text-sm sm:text-base"
                      placeholder={t('contactInfo.messagePlaceholder')}
                    />
                  </div>

                  {submitStatus.type && (
                    <div
                      data-success-message
                      role="alert"
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
                      t('contactInfo.sending')
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        {t('contactInfo.send')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
