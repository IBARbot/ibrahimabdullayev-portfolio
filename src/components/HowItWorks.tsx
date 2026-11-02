import { motion } from 'framer-motion'
import { MessageSquare, Search, Plane } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Step {
  title: string
  text: string
}

const ICONS = [MessageSquare, Search, Plane]

export default function HowItWorks() {
  const { t } = useTranslation()
  const raw = t('howItWorks.steps', { returnObjects: true }) as unknown
  const steps: Step[] = Array.isArray(raw) ? (raw as Step[]) : []

  if (steps.length === 0) return null

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-balance">
            {t('howItWorks.title')}
          </h2>
          <p className="text-gray-600">{t('howItWorks.subtitle')}</p>
        </div>

        <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Addımları birləşdirən qırıq xətt (yalnız geniş ekranda) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-8 left-[16%] right-[16%] border-t-2 border-dashed border-primary-200"
          />
          {steps.map((step, index) => {
            const Icon = ICONS[index % ICONS.length]
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-primary-200 shadow-md text-primary-600">
                  <Icon className="w-7 h-7" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600 max-w-xs">{step.text}</p>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
