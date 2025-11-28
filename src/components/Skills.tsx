import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Skill {
  name: string
  level: number
  category: string
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        setSkills(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Skills yüklənərkən xəta:', err)
        setSkills([
          { name: 'Aviabilet Rezervasiyası', level: 95, category: 'Xidmətlər' },
          { name: 'Otel Booking', level: 90, category: 'Xidmətlər' },
          { name: 'Transfer Xidmətləri', level: 88, category: 'Xidmətlər' },
          { name: 'Sığorta Məsləhəti', level: 85, category: 'Xidmətlər' },
        ])
        setLoading(false)
      })
  }, [])

  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <section
      id="skills"
      className="py-20 bg-white"
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
            Bacarıqlarım
          </h2>
          <div className="w-16 h-0.5 bg-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Təqdim etdiyim xidmətlər və bacarıqlarım
          </p>
        </motion.div>

        {loading && skills.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Bacarıqlar yüklənir...
          </div>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center md:text-left">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills
                    .filter((skill) => skill.category === category)
                    .map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-gray-50 p-5 rounded-lg border border-gray-100 hover:border-primary-200 transition-colors"
                      >
                        <span className="font-medium text-gray-900 text-base">
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
