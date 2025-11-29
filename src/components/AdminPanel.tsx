import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Save, Upload, Image as ImageIcon, FileText, Mail, Phone, MapPin, BarChart3, Eye, MousePointer, TrendingUp, Download } from 'lucide-react'

interface Content {
  hero: {
    title: string
    subtitle: string
    description: string
    image: string
  }
  about: {
    title: string
    content: string
  }
  contact: {
    email: string
    phone: string
    address: string
    linkedin?: string
    instagram?: string
    whatsapp?: string
  }
}

interface AnalyticsStats {
  pageViews: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
    byPath: Record<string, number>
  }
  clicks: {
    total: number
    byElement: Record<string, number>
    topElements: Array<{ element: string; count: number }>
  }
  scrolls: {
    averageDepth: number
    byDepth: {
      25: number
      50: number
      75: number
      100: number
    }
  }
  users: {
    unique: number
    returning: number
    new: number
  }
  devices: {
    desktop: number
    mobile: number
    tablet: number
  }
  referrers: Record<string, number>
}

export default function AdminPanel() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'stats'>('content')
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
      loadContent()
      loadStats()
    }
  }, [])

  const loadStats = async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      const response = await fetch('/api/analytics/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Stats yüklənərkən xəta:', error)
    }
  }

  const downloadStats = () => {
    if (!stats) return

    // Convert stats to CSV format
    const csvRows: string[] = []
    
    // Header
    csvRows.push('Statistika Növü,Metrik,Dəyər')
    
    // Page Views
    csvRows.push(`Page Views,Ümumi,${stats.pageViews.total}`)
    csvRows.push(`Page Views,Bu Gün,${stats.pageViews.today}`)
    csvRows.push(`Page Views,Bu Həftə,${stats.pageViews.thisWeek}`)
    csvRows.push(`Page Views,Bu Ay,${stats.pageViews.thisMonth}`)
    
    // Clicks
    csvRows.push(`Clicks,Ümumi,${stats.clicks.total}`)
    stats.clicks.topElements.forEach(item => {
      csvRows.push(`Clicks,"${item.element}",${item.count}`)
    })
    
    // Scrolls
    csvRows.push(`Scrolls,25%,${stats.scrolls.byDepth[25]}`)
    csvRows.push(`Scrolls,50%,${stats.scrolls.byDepth[50]}`)
    csvRows.push(`Scrolls,75%,${stats.scrolls.byDepth[75]}`)
    csvRows.push(`Scrolls,100%,${stats.scrolls.byDepth[100]}`)
    
    // Users
    csvRows.push(`Users,Unikal,${stats.users.unique}`)
    csvRows.push(`Users,Yeni,${stats.users.new}`)
    csvRows.push(`Users,Qayıdan,${stats.users.returning}`)
    
    // Devices
    csvRows.push(`Devices,Desktop,${stats.devices.desktop}`)
    csvRows.push(`Devices,Mobil,${stats.devices.mobile}`)
    csvRows.push(`Devices,Tablet,${stats.devices.tablet}`)

    // Create CSV content
    const csvContent = csvRows.join('\n')
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `statistikalar_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setMessage({ type: 'success', text: 'Statistikalar yükləndi!' })
  }

  const loadContent = async () => {
    try {
      const response = await fetch('/api/content')
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error('Content yüklənərkən xəta:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        setIsAuthenticated(true)
        loadContent()
        setMessage({ type: 'success', text: 'Giriş uğurlu!' })
      } else {
        setMessage({ type: 'error', text: data.message || 'Giriş uğursuz oldu' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Xəta baş verdi' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    navigate('/')
  }

  const handleSave = async () => {
    if (!content) return

    setLoading(true)
    const token = localStorage.getItem('adminToken')

    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Məzmun uğurla yeniləndi!' })
      } else {
        setMessage({ type: 'error', text: data.message || 'Xəta baş verdi' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Xəta baş verdi' })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      if (content) {
        setContent({
          ...content,
          hero: {
            ...content.hero,
            image: base64String,
          },
        })
      }
    }
    reader.readAsDataURL(file)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Admin Girişi
          </h2>

          {message.type && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İstifadəçi adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="ibrahim.abdullayev1@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifrə
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş edilir...' : 'Giriş'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Çıxış
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message.type && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-5 h-5 inline-block mr-2" />
              Kontent
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline-block mr-2" />
              Statistikalar
            </button>
          </nav>
        </div>

        {activeTab === 'stats' ? (
          <div className="space-y-6">
            {/* Download Button */}
            <div className="flex justify-end">
              <button
                onClick={downloadStats}
                disabled={!stats}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                CSV Yüklə
              </button>
            </div>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ümumi Baxış</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.pageViews.total || 0}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Bu Gün</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.pageViews.today || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Kliklər</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.clicks.total || 0}
                    </p>
                  </div>
                  <MousePointer className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Unikal İstifadəçilər</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.users.unique || 0}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Səhifə Baxışları</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bu Həftə</span>
                    <span className="font-semibold">{stats?.pageViews.thisWeek || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bu Ay</span>
                    <span className="font-semibold">{stats?.pageViews.thisMonth || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scroll Dərinliyi</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">25%</span>
                    <span className="font-semibold">{stats?.scrolls.byDepth[25] || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">50%</span>
                    <span className="font-semibold">{stats?.scrolls.byDepth[50] || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">75%</span>
                    <span className="font-semibold">{stats?.scrolls.byDepth[75] || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">100%</span>
                    <span className="font-semibold">{stats?.scrolls.byDepth[100] || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ən Çox Kliklənən Elementlər</h3>
              <div className="space-y-2">
                {stats?.clicks.topElements && stats.clicks.topElements.length > 0 ? (
                  stats.clicks.topElements.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="text-gray-700">{item.element}</span>
                      <span className="font-semibold text-primary-600">{item.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Hələ məlumat yoxdur</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Hero Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Hero Bölməsi
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlıq
                </label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt başlıq
                </label>
                <input
                  type="text"
                  value={content.hero.subtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Təsvir
                </label>
                <textarea
                  value={content.hero.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, description: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şəkil (Base64 və ya URL)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('hero', e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                {content.hero.image && (
                  <div className="mt-2 relative">
                    <img
                      src={content.hero.image}
                      alt="Hero"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (content) {
                          setContent({
                            ...content,
                            hero: { ...content.hero, image: '' },
                          })
                        }
                      }}
                      className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Haqqımda Bölməsi
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlıq
                </label>
                <input
                  type="text"
                  value={content.about.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Məzmun
                </label>
                <textarea
                  value={content.about.content}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, content: e.target.value },
                    })
                  }
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Əlaqə Məlumatları
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, email: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefon
                </label>
                <input
                  type="tel"
                  value={content.contact.phone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, phone: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Ünvan
                </label>
                <input
                  type="text"
                  value={content.contact.address}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, address: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Sosial Media Linkləri
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={content.contact.linkedin || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, linkedin: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://linkedin.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={content.contact.instagram || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, instagram: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="url"
                  value={content.contact.whatsapp || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, whatsapp: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://wa.me/..."
                />
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Save Button - Only show in content tab */}
        {activeTab === 'content' && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saxlanılır...' : 'Saxla'}
              </button>
            </div>
          )}
      </div>
    </div>
  )
}


