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
        // Fallback data - Tourism skills
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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bacarıqlarım
          </h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
          <div className="space-y-12">
          {categories.map((category) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                {category}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <div key={skill.name} className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-900">
                          {skill.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                        />
                      </div>
                    </div>
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

