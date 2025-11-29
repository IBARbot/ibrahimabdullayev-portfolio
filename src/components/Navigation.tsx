import { useState, useEffect } from 'react'
import { Menu, X, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

interface NavigationProps {
  isScrolled: boolean
  onOpenBooking?: () => void
}

const PROFILE_IMAGE = 'https://i.imgur.com/64oQNiZ.jpeg'

export default function Navigation({ isScrolled, onOpenBooking }: NavigationProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'projects', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'services', label: t('nav.services') },
    { id: 'projects', label: t('nav.portfolio') },
    { id: 'contact', label: t('nav.contact') },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-3">
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-600">
                <img
                  src={PROFILE_IMAGE}
                  alt="İbrahim Abdullayev"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/40x40/0ea5e9/ffffff?text=IA'
                  }}
                />
              </div>
              <span className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors hidden sm:block">
                İbrahim Abdullayev
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
                aria-label={`${item.label} bölməsinə keç`}
              >
                {item.label}
              </button>
            ))}
            <LanguageSwitcher />
            <button
              onClick={() => onOpenBooking?.()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors flex items-center gap-2 text-sm touch-manipulation"
            >
              <Calendar className="w-4 h-4" />
              {t('nav.bookNow')}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block px-3 py-2 text-base font-medium w-full text-left ${
                  activeSection === item.id
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => onOpenBooking?.()}
              className="w-full mt-2 px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors flex items-center justify-center gap-2 text-base touch-manipulation"
            >
              <Calendar className="w-5 h-5" />
              {t('nav.bookNow')}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

