import { motion } from 'framer-motion'
import { Award, Coffee, Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const PROFILE_IMAGE = 'https://i.imgur.com/64oQNiZ.jpeg'

export default function About() {
  const { t } = useTranslation()

  // Use translations directly instead of backend content
  const aboutTitle = t('about.title')
  const aboutContent = t('about.content')
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="about"
      className="py-24 bg-white"
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
            {aboutTitle}
          </h2>
          <div className="w-16 h-0.5 bg-primary-600 mx-auto mb-4"></div>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-start order-2 md:order-1"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-primary-100 shadow-xl">
                <img
                  src={PROFILE_IMAGE}
                  alt="İbrahim Abdullayev"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/400x400/0ea5e9/ffffff?text=IA'
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2 space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t('about.specialist')}
            </h3>
            <div className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
              {aboutContent}
            </div>
            {/* Expertise & Certifications */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-5 rounded-lg border border-gray-100 bg-gray-50">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  {t('about.expertise.title')}
                </h4>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>{t('about.expertise.items.ticketing')}</li>
                  <li>{t('about.expertise.items.gds')}</li>
                  <li>{t('about.expertise.items.cargo')}</li>
                  <li>{t('about.expertise.items.mentoring')}</li>
                </ul>
              </div>
              <div className="p-4 sm:p-5 rounded-lg border border-gray-100 bg-gray-50">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                  {t('about.certifications.title')}
                </h4>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>{t('about.certifications.fareTicketing')}</li>
                  <li>{t('about.certifications.dgr')}</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 md:mt-0 md:col-span-2"
          >
            <motion.div
              variants={itemVariants}
              className="p-5 sm:p-6 bg-primary-50 rounded-lg border border-primary-100"
            >
              <Award className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 mb-3 sm:mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {t('about.professional')}
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                {t('about.professionalDesc')}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="p-5 sm:p-6 bg-primary-50 rounded-lg border border-primary-100"
            >
              <Coffee className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 mb-3 sm:mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {t('about.experience')}
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                {t('about.experienceDesc')}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="p-5 sm:p-6 bg-primary-50 rounded-lg border border-primary-100"
            >
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 mb-3 sm:mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {t('about.satisfaction')}
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                {t('about.satisfactionDesc')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

