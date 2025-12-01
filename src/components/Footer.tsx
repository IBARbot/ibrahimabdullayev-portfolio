import { useEffect, useState } from 'react'
import {
  Linkedin,
  Mail,
  Instagram,
  MessageCircle,
  Youtube,
  Globe2,
  MessageCircleMore,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SocialLink {
  id: string
  platform: string
  label: string
  url: string
  icon?: string
}

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])

  useEffect(() => {
    // Public content endpoint (shared with admin content storage)
    fetch('/api/admin/content')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        setSocialLinks((data.socialLinks || []) as SocialLink[])
      })
      .catch(() => {
        // Fallback to default static links
        setSocialLinks([
          {
            id: 'linkedin',
            platform: 'LinkedIn',
            label: 'LinkedIn',
            url: 'https://linkedin.com/in/ibrahim-abdullayev-7bb887152',
            icon: 'linkedin',
          },
          {
            id: 'instagram',
            platform: 'Instagram',
            label: 'Instagram',
            url: 'https://instagram.com/ibrahim_abdullar',
            icon: 'instagram',
          },
          {
            id: 'whatsapp',
            platform: 'WhatsApp',
            label: 'WhatsApp',
            url: 'https://wa.me/994555973923',
            icon: 'whatsapp',
          },
          {
            id: 'email',
            platform: 'Email',
            label: 'Email',
            url: 'mailto:ibrahim.abdullayev1@gmail.com',
            icon: 'mail',
          },
        ])
      })
  }, [])

  const renderIcon = (icon?: string, platform?: string) => {
    const key = (icon || platform || '').toLowerCase()
    if (key.includes('linkedin')) return <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
    if (key.includes('instagram')) return <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
    if (key.includes('whatsapp')) return <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
    if (key.includes('mail') || key.includes('email')) return <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
    if (key.includes('youtube')) return <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
    if (key.includes('wechat')) return <MessageCircleMore className="w-5 h-5 sm:w-6 sm:h-6" />
    if (key.includes('tiktok')) return <Globe2 className="w-5 h-5 sm:w-6 sm:h-6" />
    return <Globe2 className="w-5 h-5 sm:w-6 sm:h-6" />
  }

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              İbrahim Abdullayev
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              {t('hero.description')}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              {t('contactInfo.pages')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t('nav.portfolio')}
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t('nav.services')}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-primary-400 transition-colors"
                >
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              {t('contactInfo.socialMedia')}
            </h4>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 sm:p-3 bg-gray-800 rounded-lg hover:bg-primary-600 active:bg-primary-700 transition-colors touch-manipulation"
                  aria-label={link.label || link.platform}
                >
                  {renderIcon(link.icon, link.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-gray-400 text-sm">
            © {currentYear} İbrahim Abdullayev. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400 justify-center">
            <a href="#privacy" className="hover:text-primary-400 transition-colors">
              {t('footer.privacy')}
            </a>
            <span className="h-3 w-px bg-gray-700" />
            <a href="#terms" className="hover:text-primary-400 transition-colors">
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

