import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, PlayCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ProjectsProps {
  onOpenBooking?: () => void
}

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  image: string
  link: string
  github: string
}

interface VideoItem {
  id: string
  title: string
  url: string
  platform?: string
}

export default function Projects({ onOpenBooking }: ProjectsProps) {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Public content endpoint (shared with admin content storage)
    fetch('/api/admin/content')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        setProjects((data.portfolio || []) as Project[])
        setVideos((data.videos || []) as VideoItem[])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Projects yüklənərkən xəta:', err)
        setLoading(false)
      })
  }, [])

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      if (!url) return ''
      const ytMatch =
        url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/) ||
        url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/)
      if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}`
      }
      return url
    } catch {
      return url
    }
  }

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
            {t('projects.title')}
          </h2>
          <div className="w-16 h-0.5 bg-primary-600 mx-auto mb-4"></div>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        {loading && projects.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {t('projects.loading')}
          </div>
        ) : (
          <div className="space-y-12">
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
                    {t('nav.bookNow')}
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

            {videos.length > 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('projects.videosTitle')}
                  </h3>
                  <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                    {t('projects.videosSubtitle')}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((video, index) => (
                    <motion.div
                      key={video.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-gray-900 rounded-xl overflow-hidden shadow-md"
                    >
                      <div className="relative pt-[56.25%]">
                        <iframe
                          src={getYoutubeEmbedUrl(video.url)}
                          title={video.title}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <PlayCircle className="w-16 h-16 text-white/70 drop-shadow-lg" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-white font-semibold mb-1">{video.title}</h4>
                        {video.platform && (
                          <p className="text-xs text-gray-400">
                            {video.platform}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

