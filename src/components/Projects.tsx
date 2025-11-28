import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface ProjectsProps {
  onOpenBooking?: () => void
}

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  image: string
  link: string
  github: string
}

export default function Projects({ onOpenBooking }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        setProjects(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Projects yüklənərkən xəta:', err)
        // Fallback data - Tourism services
        setProjects([
          {
            id: 1,
            title: 'Aviabilet Rezervasiya Xidməti',
            description: 'Dünyanın istənilən nöqtəsinə ən sərfəli aviabiletlərin tapılması və rezervasiyası',
            technologies: ['Aviabilet', 'Rezervasiya', 'Səyahət Planlaşdırması'],
            image: 'https://via.placeholder.com/400x300/0ea5e9/ffffff?text=Aviabilet',
            link: '#booking',
            github: '',
          },
        ])
        setLoading(false)
      })
  }, [])

  return (
    <section
      id="projects"
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
            Portfolio
          </h2>
          <div className="w-16 h-0.5 bg-primary-600 mx-auto mb-4"></div>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Təqdim etdiyim xidmətlər və müştəri uğur hekayələri
          </p>
        </motion.div>

        {loading && projects.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Layihələr yüklənir...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-primary-200 hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-48 sm:h-56 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden group">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/400x300/0ea5e9/ffffff?text=' + encodeURIComponent(project.title)
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 sm:p-4">
                  <button
                    onClick={() => onOpenBooking?.()}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white rounded-lg hover:bg-primary-50 active:bg-primary-100 transition-all flex items-center gap-2 text-sm font-semibold text-gray-900 shadow-lg touch-manipulation"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Sifariş Ver
                  </button>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 sm:px-3 py-1 bg-primary-100 text-primary-700 text-xs sm:text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </section>
  )
}

