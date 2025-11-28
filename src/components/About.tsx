import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Coffee, Heart, Loader2 } from 'lucide-react'

const PROFILE_IMAGE = 'https://i.imgur.com/64oQNiZ.jpeg'

interface AboutContent {
  title: string
  content: string
}

export default function About() {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.about) {
          setContent(data.about)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Content yüklənərkən xəta:', err)
        setContent({
          title: 'Haqqımda',
          content: 'Mən turizm sahəsində aparıcı mütəxəssisəm və səyahətçilərə ən yaxşı xidməti təqdim etmək üçün çalışıram. İllər boyu hava yolu sistemləri, otel rezervasiyaları, transfer xidmətləri, sığorta və səfirlik işləri üzrə təcrübə toplamışam.',
        })
        setLoading(false)
      })
  }, [])

  if (loading || !content) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        </div>
      </section>
    )
  }
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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {content.title}
          </h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Turizm sahəsində təcrübəli mütəxəssis kimi səyahətçilərə ən yaxşı xidməti təqdim edirəm
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
            className="order-1 md:order-2"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              Turizm Mütəxəssisi
            </h3>
            <div className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
              {content.content}
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
                Peşəkar Xidmət
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Hər müştəriyə fərdi yanaşaraq ən yaxşı həlli təqdim edirəm
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="p-5 sm:p-6 bg-primary-50 rounded-lg border border-primary-100"
            >
              <Coffee className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 mb-3 sm:mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Geniş Təcrübə
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                İllər boyu turizm sahəsində təcrübə toplamışam və daim öyrənirəm
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="p-5 sm:p-6 bg-primary-50 rounded-lg border border-primary-100"
            >
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 mb-3 sm:mb-4" />
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Müştəri Məmnuniyyəti
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Müştərilərin məmnuniyyəti mənim üçün ən vacibdir
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

