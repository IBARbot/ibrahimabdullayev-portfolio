import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SocialLink {
  id: string
  platform: string
  label: string
  url: string
}

const DEFAULTS: SocialLink[] = [
  { id: 'instagram', platform: 'Instagram', label: 'Instagram', url: 'https://instagram.com/ibrahim_abdullar' },
  { id: 'linkedin', platform: 'LinkedIn', label: 'LinkedIn', url: 'https://linkedin.com/in/ibrahim-abdullayev-7bb887152' },
]

export default function SimpleFooter() {
  const { t } = useTranslation()
  const [links, setLinks] = useState<SocialLink[]>(DEFAULTS)

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        const all = (data.socialLinks || []) as SocialLink[]
        // WhatsApp və e-poçt yuxarıda düymə kimi var
        const rest = all.filter((l) => !/whatsapp|mail/i.test(`${l.platform} ${l.id}`))
        if (rest.length > 0) setLinks(rest)
      })
      .catch(() => {
        // Standart linklər qalır
      })
  }, [])

  return (
    <footer className="max-w-xl mx-auto px-5 pt-12 pb-10 text-center">
      <div className="flex justify-center gap-6 text-sm text-gray-500">
        {links.map((l) => (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-600 transition-colors"
          >
            {l.label || l.platform}
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-400">
        © {new Date().getFullYear()} İbrahim Abdullayev · {t('home.location')}
      </p>
    </footer>
  )
}
