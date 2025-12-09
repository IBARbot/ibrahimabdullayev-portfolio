import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  LogOut,
  Save,
  FileText,
  Mail,
  Phone,
  MapPin,
  BarChart3,
  Eye,
  MousePointer,
  TrendingUp,
  Download,
  Plus,
  Trash2,
  Link as LinkIcon,
  Video,
  Globe2,
  Award,
  CheckCircle2,
  XCircle,
  Upload,
} from 'lucide-react'

interface PortfolioItem {
  id: string
  title: string
  description: string
  technologies: string[]
  image: string
  link: string
  github: string
}

interface CertificateItem {
  id: string
  title: string
  subtitle?: string
  provider?: string
  date?: string
  image: string
}

interface VideoItem {
  id: string
  title: string
  url: string
  platform?: string
  thumbnail?: string
}

interface SocialLink {
  id: string
  platform: string
  label: string
  url: string
  icon?: string
}

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
  portfolio?: PortfolioItem[]
  certificates?: CertificateItem[]
  videos?: VideoItem[]
  socialLinks?: SocialLink[]
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
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<
    'pageViews' | 'clicks' | 'users' | 'scrolls' | 'devices' | 'referrers' | null
  >('pageViews')
  const [activeTab, setActiveTab] = useState<'content' | 'stats'>('content')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploadedImages, setUploadedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
      loadContent()
      loadStats()
      // Initialize Errors sheet headers on first load
      initializeErrorsSheetHeaders()
    }
  }, [])

  const initializeErrorsSheetHeaders = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'init' }),
      })
      const data = await response.json()
      if (data.success) {
        console.log('Errors sheet headers initialized')
      }
    } catch (error) {
      console.error('Failed to initialize Errors sheet headers:', error)
    }
  }

  const loadStats = async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) return

    try {
      setStatsLoading(true)
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
    } finally {
      setStatsLoading(false)
    }
  }

  // Stats tab açılarkən avtomatik yüklə (əgər stats yoxdur)
  useEffect(() => {
    if (activeTab === 'stats' && !stats && !statsLoading) {
      loadStats()
    }
  }, [activeTab, stats, statsLoading])

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

    // Create CSV content with UTF-8 BOM for proper encoding
    const BOM = '\uFEFF'
    const csvContent = BOM + csvRows.join('\n')
    
    // Create blob and download with UTF-8 encoding
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `statistikalar_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setMessage({ type: 'success', text: t('admin.stats.downloaded') })
  }

  const loadContent = async () => {
    try {
      const response = await fetch('/api/admin/content')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Validate data structure
      if (data && typeof data === 'object' && data.hero && data.about) {
        setContent(data)
      } else {
        console.error('Invalid content structure received:', data)
        throw new Error('Invalid content structure')
      }
    } catch (error) {
      console.error('Content yüklənərkən xəta:', error)
      // Set a minimal valid content structure to prevent crashes
      setContent({
        hero: {
          title: '',
          subtitle: '',
          description: '',
          image: '',
        },
        about: {
          title: '',
          content: '',
        },
        contact: {
          email: '',
          phone: '',
          address: '',
        },
        portfolio: [],
        certificates: [],
        videos: [],
        socialLinks: [],
      })
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
        loadStats()
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: null, text: '' })

    try {
      const response = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })

      const data = await response.json()

      if (data.success) {
        // Always show success message (security best practice - prevents email enumeration)
        setMessage({ 
          type: 'success', 
          text: data.message || t('admin.forgotPassword.success')
        })
        setShowForgotPassword(false)
        setForgotPasswordEmail('')
      } else {
        // Even on error, show the same message for security
        setMessage({ 
          type: 'success', 
          text: t('admin.forgotPassword.success')
        })
        setShowForgotPassword(false)
        setForgotPasswordEmail('')
      }
    } catch (error) {
      // Even on network error, show the same message for security
      setMessage({ 
        type: 'success', 
        text: t('admin.forgotPassword.success')
      })
      setShowForgotPassword(false)
      setForgotPasswordEmail('')
    } finally {
      setLoading(false)
    }
  }

  const showToastNotification = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text })
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      setTimeout(() => setToastMessage(null), 300)
    }, 3000)
  }

  const handleSave = async () => {
    if (!content) return

    setLoading(true)
    setMessage({ type: null, text: '' })
    const token = localStorage.getItem('adminToken')

    if (!token) {
      const errorText = 'Giriş edilməyib. Zəhmət olmasa yenidən giriş edin.'
      setMessage({ type: 'error', text: errorText })
      showToastNotification('error', errorText)
      setLoading(false)
      return
    }

    try {
      console.log('Saving content...', {
        certificatesCount: content.certificates?.length || 0,
        portfolioCount: content.portfolio?.length || 0,
        hasHeroImage: !!content.hero?.image,
      })

      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      })

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // If JSON parsing fails, use status text
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: t('admin.content.saved') })
        showToastNotification('success', t('admin.content.saved'))
        setUploadedImages(new Set()) // Clear uploaded images indicator
      } else {
        const errorText = data.message || t('admin.content.error')
        setMessage({ type: 'error', text: errorText })
        showToastNotification('error', errorText)
      }
    } catch (error: any) {
      console.error('Save error:', error)
      let errorText = t('admin.content.error')
      
      // More specific error messages
      if (error.message) {
        if (error.message.includes('Unauthorized') || error.message.includes('Invalid token')) {
          errorText = 'Giriş müddəti bitib. Zəhmət olmasa yenidən giriş edin.'
          const shouldRelogin = window.confirm('Giriş müddəti bitib. Yenidən giriş etmək istəyirsiniz?')
          if (shouldRelogin) {
            handleLogout()
            return
          }
        } else if (error.message.includes('Failed to save')) {
          errorText = 'Google Sheets-ə yazıla bilmədi. Zəhmət olmasa yenidən cəhd edin.'
        } else {
          errorText = error.message
        }
      }
      
      setMessage({ type: 'error', text: errorText })
      showToastNotification('error', errorText)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (
    section: 'hero' | 'portfolio' | 'certificates',
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageKey = section === 'hero' ? 'hero' : `${section}-${index}`
    
    // Show loading state
    setUploadedImages((prev) => new Set([...prev, imageKey]))
    setLoading(true)
    setMessage({ type: null, text: '' })

    try {
      // Convert file to base64
      const reader = new FileReader()
      const base64String = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      if (!content) return

      // Upload to API to get URL
      const token = localStorage.getItem('adminToken')
      if (!token) {
        throw new Error('Giriş edilməyib. Zəhmət olmasa yenidən giriş edin.')
      }

      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image: base64String }),
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ 
          message: `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}` 
        }))
        throw new Error(errorData.message || 'Şəkil yüklənərkən xəta baş verdi')
      }

      const uploadData = await uploadResponse.json()
      
      if (!uploadData.success) {
        throw new Error(uploadData.message || 'Şəkil yüklənərkən xəta baş verdi')
      }

      // Use the URL from API (prefer URL over base64)
      let imageUrl = uploadData.url || base64String
      
      // Log what we got
      if (imageUrl.startsWith('http')) {
        console.log('✅ Şəkil URL alındı:', imageUrl.substring(0, 80))
      } else if (imageUrl.startsWith('data:image')) {
        const base64Size = base64String.length
        console.error(`❌ Şəkil base64 formatında qayıdıb (${Math.round(base64Size / 1000)}KB). Cloudinary/Imgur upload uğursuz oldu.`)
        console.error('Upload response:', uploadData)
        
        // Don't use base64 - it will be removed by cleanContentForSheets
        // Instead, show error to user with more details
        const errorDetails = uploadData.message || 'Cloudinary upload uğursuz oldu'
        throw new Error(`Şəkil yüklənə bilmədi: ${errorDetails}. Zəhmət olmasa Cloudinary konfiqurasiyasını yoxlayın və yenidən cəhd edin.`)
      } else {
        // Unknown format
        console.error('❌ Naməlum şəkil formatı:', imageUrl.substring(0, 50))
        throw new Error('Şəkil yüklənə bilmədi. Naməlum format.')
      }

      // Update content with the image URL
      if (section === 'hero') {
        setContent({
          ...content,
          hero: {
            ...content.hero,
            image: imageUrl,
          },
        })
      } else if (section === 'portfolio' && typeof index === 'number') {
        const items = content.portfolio || []
        const updated = items.map((item, idx) =>
          idx === index
            ? {
                ...item,
                image: imageUrl,
              }
            : item,
        )
        setContent({
          ...content,
          portfolio: updated,
        })
      } else if (section === 'certificates' && typeof index === 'number') {
        const items = content.certificates || []
        const updated = items.map((item, idx) =>
          idx === index
            ? {
                ...item,
                image: imageUrl,
              }
            : item,
        )
        setContent({
          ...content,
          certificates: updated,
        })
      }

      setMessage({ type: 'success', text: 'Şəkil yükləndi' })
      showToastNotification('success', 'Şəkil yükləndi')
    } catch (error: any) {
      console.error('Image upload error:', error)
      const errorMessage = error.message || 'Şəkil yüklənərkən xəta baş verdi'
      
      // If authentication error, suggest re-login
      if (errorMessage.includes('İcazə verilmədi') || errorMessage.includes('Token')) {
        const shouldRelogin = window.confirm(
          'Giriş müddəti bitib və ya token etibarsızdır. Yenidən giriş etmək istəyirsiniz?'
        )
        if (shouldRelogin) {
          handleLogout()
          return
        }
      }
      
      setMessage({ type: 'error', text: errorMessage })
      showToastNotification('error', errorMessage)
      // Remove from uploaded images on error
      setUploadedImages((prev) => {
        const next = new Set(prev)
        next.delete(imageKey)
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  const scrollToVideos = () => {
    const videosSection = document.getElementById('videos-section')
    if (videosSection) {
      videosSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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
            {t('admin.login.title')}
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
                {t('admin.login.username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder={t('admin.login.username')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.login.password')}
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
              {loading ? t('admin.loading') : t('admin.login.login')}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                {t('admin.login.forgotPassword')}
              </button>
            </div>
          </form>

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowForgotPassword(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('admin.forgotPassword.title')}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('admin.forgotPassword.success')}
                </p>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.forgotPassword.email')}
                    </label>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder={t('admin.forgotPassword.email')}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false)
                        setForgotPasswordEmail('')
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {t('admin.forgotPassword.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? t('admin.forgotPassword.sending') : t('admin.forgotPassword.send')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('admin.loading')}</p>
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
            <h1 className="text-2xl font-bold text-gray-900">{t('admin.title')}</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {t('admin.logout')}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-1/2 z-50 transform -translate-x-1/2"
            >
              <div
                className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
                  toastMessage.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {toastMessage.type === 'success' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
                <span className="font-semibold">{toastMessage.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              {t('admin.tabs.content')}
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
              {t('admin.tabs.stats')}
            </button>
          </nav>
        </div>

        {/* Quick Navigation for Videos Section */}
        {activeTab === 'content' && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={scrollToVideos}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Video className="w-4 h-4" />
              Video bölməsinə keç
            </button>
          </div>
        )}

        {activeTab === 'stats' ? (
          <div className="space-y-6">
            {/* Download Button */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {statsLoading && <span>{t('admin.stats.loading')}</span>}
                {!statsLoading && !stats && <span>{t('admin.stats.noData')}</span>}
              </div>
              <button
                onClick={downloadStats}
                disabled={!stats}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                {t('admin.stats.download')}
              </button>
            </div>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => setSelectedMetric('pageViews')}
                className={`bg-white p-6 rounded-lg shadow-md text-left transition-all ${
                  selectedMetric === 'pageViews' ? 'ring-2 ring-primary-500 shadow-lg' : 'hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.stats.totalViews')}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.pageViews.total || 0}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-primary-600" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMetric('pageViews')}
                className={`bg-white p-6 rounded-lg shadow-md text-left transition-all ${
                  selectedMetric === 'pageViews' ? 'ring-2 ring-primary-500 shadow-lg' : 'hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.stats.today')}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.pageViews.today || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMetric('clicks')}
                className={`bg-white p-6 rounded-lg shadow-md text-left transition-all ${
                  selectedMetric === 'clicks' ? 'ring-2 ring-primary-500 shadow-lg' : 'hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.stats.clicks')}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.clicks.total || 0}
                    </p>
                  </div>
                  <MousePointer className="w-8 h-8 text-blue-600" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMetric('users')}
                className={`bg-white p-6 rounded-lg shadow-md text-left transition-all ${
                  selectedMetric === 'users' ? 'ring-2 ring-primary-500 shadow-lg' : 'hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.stats.uniqueUsers')}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.users.unique || 0}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </button>
            </div>

            {/* Detailed Stats - Interactive Panel */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left panel */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedMetric
                    ? t(`admin.stats.detailTitle.${selectedMetric}`)
                    : t('admin.stats.detailTitle.default')}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  {t('admin.stats.detailHint')}
                </p>

                {!stats && !statsLoading && (
                  <p className="text-gray-500 text-sm">{t('admin.stats.noData')}</p>
                )}

                {stats && selectedMetric === 'pageViews' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t('admin.stats.thisWeek')}</span>
                        <span className="font-semibold">{stats.pageViews.thisWeek}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t('admin.stats.thisMonth')}</span>
                        <span className="font-semibold">{stats.pageViews.thisMonth}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        {t('admin.stats.pageViewsByPath')}
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-auto">
                        {Object.entries(stats.pageViews.byPath || {})
                          .sort((a, b) => Number(b[1]) - Number(a[1]))
                          .map(([path, count]) => (
                            <div key={path} className="flex items-center justify-between text-xs py-1">
                              <span className="text-gray-600 truncate mr-2">{path}</span>
                              <span className="font-semibold text-primary-600">{count as number}</span>
                            </div>
                          ))}
                        {Object.keys(stats.pageViews.byPath || {}).length === 0 && (
                          <p className="text-gray-400 text-xs">{t('admin.stats.noData')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {stats && selectedMetric === 'clicks' && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('admin.stats.clicks')}</span>
                      <span className="font-semibold">{stats.clicks.total}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        {t('admin.stats.topElements')}
                      </h4>
                      <div className="space-y-1 max-h-48 overflow-auto">
                        {stats.clicks.topElements && stats.clicks.topElements.length > 0 ? (
                          stats.clicks.topElements.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-xs py-1 px-2 rounded hover:bg-gray-50"
                            >
                              <span className="text-gray-700 truncate mr-2">{item.element}</span>
                              <span className="font-semibold text-primary-600">{item.count}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-xs">{t('admin.stats.noData')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {stats && selectedMetric === 'users' && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('admin.stats.uniqueUsers')}</span>
                      <span className="font-semibold">{stats.users.unique}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('admin.stats.newUsers')}</span>
                      <span className="font-semibold">{stats.users.new}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('admin.stats.returningUsers')}</span>
                      <span className="font-semibold">{stats.users.returning}</span>
                    </div>
                  </div>
                )}

                {stats && selectedMetric === 'scrolls' && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{t('admin.stats.averageScroll')}</span>
                      <span className="font-semibold">{stats.scrolls.averageDepth}%</span>
                    </div>
                    {[25, 50, 75, 100].map((depth) => (
                      <div key={depth} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">{depth}%</span>
                          <span className="font-semibold">{stats.scrolls.byDepth[depth as 25 | 50 | 75 | 100]}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-primary-500 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (stats.scrolls.byDepth[depth as 25 | 50 | 75 | 100] /
                                  (stats.pageViews.total || 1)) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {stats && selectedMetric === 'devices' && (
                  <div className="space-y-3">
                    {(['desktop', 'mobile', 'tablet'] as const).map((device) => {
                      const total =
                        stats.devices.desktop + stats.devices.mobile + stats.devices.tablet || 1
                      const value = stats.devices[device]
                      const percent = Math.round((value / total) * 100)
                      return (
                        <div key={device} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">{t(`admin.stats.devices.${device}`)}</span>
                            <span className="font-semibold">
                              {value} ({percent}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-primary-500 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {stats && selectedMetric === 'referrers' && (
                  <div className="space-y-2 max-h-56 overflow-auto">
                    {Object.entries(stats.referrers || {})
                      .sort((a, b) => Number(b[1]) - Number(a[1]))
                      .map(([ref, count]) => (
                        <div
                          key={ref}
                          className="flex justify-between items-center text-xs py-1 px-2 rounded hover:bg-gray-50"
                        >
                          <span className="text-gray-700 truncate mr-2">{ref || '(direct)'}</span>
                          <span className="font-semibold text-primary-600">{count as number}</span>
                        </div>
                      ))}
                    {Object.keys(stats.referrers || {}).length === 0 && (
                      <p className="text-gray-400 text-xs">{t('admin.stats.noData')}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Right panel – quick overview (static as əvvəlki) */}
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('admin.stats.quickOverview')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('admin.stats.totalViews')}</span>
                    <span className="font-semibold">{stats?.pageViews.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('admin.stats.clicks')}</span>
                    <span className="font-semibold">{stats?.clicks.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('admin.stats.uniqueUsers')}</span>
                    <span className="font-semibold">{stats?.users.unique || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Hero Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t('admin.content.hero.title')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.content.hero.titleLabel')}
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
                  {t('admin.content.hero.subtitleLabel')}
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
                  {t('admin.content.hero.descriptionLabel')}
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
                  {t('admin.content.hero.imageLabel')} (Base64 və ya URL)
                  {uploadedImages.has('hero') && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-600">
                      <Upload className="w-3 h-3" />
                      Yüklənib
                    </span>
                  )}
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
                    {uploadedImages.has('hero') && (
                      <div className="absolute top-2 right-12 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (content) {
                          setContent({
                            ...content,
                            hero: { ...content.hero, image: '' },
                          })
                          setUploadedImages((prev) => {
                            const next = new Set(prev)
                            next.delete('hero')
                            return next
                          })
                        }
                      }}
                      className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                    >
                      {t('admin.content.remove')}
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
              {t('admin.content.about.title')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.content.about.titleLabel')}
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
                  {t('admin.content.about.contentLabel')}
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
              {t('admin.content.contact.title')}
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('admin.content.contact.email')}
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
                  {t('admin.content.contact.phone')}
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
                  {t('admin.content.contact.address')}
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

          {/* Portfolio Section */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t('admin.content.portfolio.title')}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('admin.content.portfolio.description')}
            </p>
            <div className="space-y-4">
              {(content.portfolio || []).map((item, index) => (
                <div
                  key={item.id || index}
                  className="border border-gray-200 rounded-lg p-4 grid md:grid-cols-4 gap-4"
                >
                  <div className="md:col-span-3 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.content.portfolio.fields.title')}
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...(content.portfolio || [])]
                          updated[index] = { ...item, title: e.target.value }
                          setContent({ ...content, portfolio: updated })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.content.portfolio.fields.description')}
                      </label>
                      <textarea
                        rows={3}
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...(content.portfolio || [])]
                          updated[index] = { ...item, description: e.target.value }
                          setContent({ ...content, portfolio: updated })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.content.portfolio.fields.technologies')}
                      </label>
                      <input
                        type="text"
                        value={(item.technologies || []).join(', ')}
                        onChange={(e) => {
                          const techs = e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean)
                          const updated = [...(content.portfolio || [])]
                          updated[index] = { ...item, technologies: techs }
                          setContent({ ...content, portfolio: updated })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder={t('admin.content.portfolio.fields.technologiesPlaceholder')}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.content.portfolio.fields.link')}
                        </label>
                        <input
                          type="text"
                          value={item.link}
                          onChange={(e) => {
                            const updated = [...(content.portfolio || [])]
                            updated[index] = { ...item, link: e.target.value }
                            setContent({ ...content, portfolio: updated })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          placeholder="https://"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.content.portfolio.fields.github')}
                        </label>
                        <input
                          type="text"
                          value={item.github}
                          onChange={(e) => {
                            const updated = [...(content.portfolio || [])]
                            updated[index] = { ...item, github: e.target.value }
                            setContent({ ...content, portfolio: updated })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          placeholder="https://"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.content.portfolio.fields.image')}
                        {uploadedImages.has(`portfolio-${index}`) && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-600">
                            <Upload className="w-3 h-3" />
                            Yüklənib
                          </span>
                        )}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('portfolio', e, index)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                      {item.image && (
                        <div className="mt-2 relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-28 object-cover rounded-md border border-gray-200"
                          />
                          {uploadedImages.has(`portfolio-${index}`) && (
                            <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (content.portfolio || []).filter((_, idx) => idx !== index)
                        setContent({ ...content, portfolio: updated })
                        setUploadedImages((prev) => {
                          const next = new Set(prev)
                          next.delete(`portfolio-${index}`)
                          // Re-index remaining items
                          const newSet = new Set<string>()
                          next.forEach((key) => {
                            if (key.startsWith('portfolio-')) {
                              const oldIdx = parseInt(key.split('-')[1])
                              if (oldIdx > index) {
                                newSet.add(`portfolio-${oldIdx - 1}`)
                              } else if (oldIdx < index) {
                                newSet.add(key)
                              }
                            } else {
                              newSet.add(key)
                            }
                          })
                          return newSet
                        })
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('admin.content.portfolio.actions.remove')}
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const list = content.portfolio || []
                  const newItem: PortfolioItem = {
                    id: `portfolio-${Date.now()}`,
                    title: '',
                    description: '',
                    technologies: [],
                    image: '',
                    link: '',
                    github: '',
                  }
                  setContent({ ...content, portfolio: [...list, newItem] })
                }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-primary-400 text-primary-600 rounded-lg hover:bg-primary-50 text-sm"
              >
                <Plus className="w-4 h-4" />
                {t('admin.content.portfolio.actions.add')}
              </button>
            </div>
          </div>

          {/* Certificates & Videos Section */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2 space-y-8">
            {/* Certificates */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                {t('admin.content.certificates.title')}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {t('admin.content.certificates.description')}
              </p>
              <div className="space-y-4">
                {(content.certificates || []).map((cert, index) => (
                  <div
                    key={cert.id || index}
                    className="border border-gray-200 rounded-lg p-4 grid md:grid-cols-4 gap-4"
                  >
                    <div className="md:col-span-3 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.content.certificates.fields.title')}
                        </label>
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => {
                            const updated = [...(content.certificates || [])]
                            updated[index] = { ...cert, title: e.target.value }
                            setContent({ ...content, certificates: updated })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('admin.content.certificates.fields.subtitle')}
                          </label>
                          <input
                            type="text"
                            value={cert.subtitle || ''}
                            onChange={(e) => {
                              const updated = [...(content.certificates || [])]
                              updated[index] = { ...cert, subtitle: e.target.value }
                              setContent({ ...content, certificates: updated })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('admin.content.certificates.fields.provider')}
                          </label>
                          <input
                            type="text"
                            value={cert.provider || ''}
                            onChange={(e) => {
                              const updated = [...(content.certificates || [])]
                              updated[index] = { ...cert, provider: e.target.value }
                              setContent({ ...content, certificates: updated })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('admin.content.certificates.fields.date')}
                          </label>
                          <input
                            type="date"
                            value={cert.date || ''}
                            onChange={(e) => {
                              const updated = [...(content.certificates || [])]
                              updated[index] = { ...cert, date: e.target.value }
                              setContent({ ...content, certificates: updated })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.content.certificates.fields.image')}
                          {uploadedImages.has(`certificates-${index}`) && (
                            <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-600">
                              <Upload className="w-3 h-3" />
                              Yüklənib
                            </span>
                          )}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('certificates', e, index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                        {cert.image && (
                          <div className="mt-2 relative">
                            <img
                              src={cert.image}
                              alt={cert.title}
                              className="w-full h-28 object-cover rounded-md border border-gray-200"
                            />
                            {uploadedImages.has(`certificates-${index}`) && (
                              <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (content.certificates || []).filter(
                            (_c, idx) => idx !== index,
                          )
                          setContent({ ...content, certificates: updated })
                          setUploadedImages((prev) => {
                            const next = new Set(prev)
                            next.delete(`certificates-${index}`)
                            // Re-index remaining items
                            const newSet = new Set<string>()
                            next.forEach((key) => {
                              if (key.startsWith('certificates-')) {
                                const oldIdx = parseInt(key.split('-')[1])
                                if (oldIdx > index) {
                                  newSet.add(`certificates-${oldIdx - 1}`)
                                } else if (oldIdx < index) {
                                  newSet.add(key)
                                }
                              } else {
                                newSet.add(key)
                              }
                            })
                            return newSet
                          })
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        {t('admin.content.certificates.actions.remove')}
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const list = content.certificates || []
                    const newItem: CertificateItem = {
                      id: `cert-${Date.now()}`,
                      title: '',
                      image: '',
                    }
                    setContent({ ...content, certificates: [...list, newItem] })
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-primary-400 text-primary-600 rounded-lg hover:bg-primary-50 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {t('admin.content.certificates.actions.add')}
                </button>
              </div>
            </div>

            {/* Videos / Media */}
            <div id="videos-section">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5" />
                {t('admin.content.videos.title')}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{t('admin.content.videos.description')}</p>
              <div className="space-y-4">
                {(content.videos || []).map((video, index) => (
                  <div
                    key={video.id || index}
                    className="border border-gray-200 rounded-lg p-4 grid md:grid-cols-4 gap-4"
                  >
                    <div className="md:col-span-3 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.content.videos.fields.title')}
                        </label>
                        <input
                          type="text"
                          value={video.title}
                          onChange={(e) => {
                            const updated = [...(content.videos || [])]
                            updated[index] = { ...video, title: e.target.value }
                            setContent({ ...content, videos: updated })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('admin.content.videos.fields.url')}
                          </label>
                          <input
                            type="text"
                            value={video.url}
                            onChange={(e) => {
                              const updated = [...(content.videos || [])]
                              updated[index] = { ...video, url: e.target.value }
                              setContent({ ...content, videos: updated })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="https://youtube.com/..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('admin.content.videos.fields.platform')}
                          </label>
                          <input
                            type="text"
                            value={video.platform || ''}
                            onChange={(e) => {
                              const updated = [...(content.videos || [])]
                              updated[index] = { ...video, platform: e.target.value }
                              setContent({ ...content, videos: updated })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="YouTube, Instagram, TikTok..."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (content.videos || []).filter((_v, idx) => idx !== index)
                          setContent({ ...content, videos: updated })
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        {t('admin.content.videos.actions.remove')}
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const list = content.videos || []
                    const newItem: VideoItem = {
                      id: `video-${Date.now()}`,
                      title: '',
                      url: '',
                    }
                    setContent({ ...content, videos: [...list, newItem] })
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-primary-400 text-primary-600 rounded-lg hover:bg-primary-50 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {t('admin.content.videos.actions.add')}
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Social Links */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe2 className="w-5 h-5" />
              {t('admin.content.socialDynamic.title')}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('admin.content.socialDynamic.description')}
            </p>
            <div className="space-y-4">
              {(content.socialLinks || []).map((link, index) => (
                <div
                  key={link.id || index}
                  className="border border-gray-200 rounded-lg p-4 grid md:grid-cols-4 gap-4"
                >
                  <div className="md:col-span-3 grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.content.socialDynamic.fields.platform')}
                      </label>
                      <input
                        type="text"
                        value={link.platform}
                        onChange={(e) => {
                          const updated = [...(content.socialLinks || [])]
                          updated[index] = { ...link, platform: e.target.value }
                          setContent({ ...content, socialLinks: updated })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="YouTube, TikTok, WeChat..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.content.socialDynamic.fields.label')}
                      </label>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const updated = [...(content.socialLinks || [])]
                          updated[index] = { ...link, label: e.target.value }
                          setContent({ ...content, socialLinks: updated })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.content.socialDynamic.fields.icon')}
                      </label>
                      <input
                        type="text"
                        value={link.icon || ''}
                        onChange={(e) => {
                          const updated = [...(content.socialLinks || [])]
                          updated[index] = { ...link, icon: e.target.value }
                          setContent({ ...content, socialLinks: updated })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="linkedin, instagram, youtube..."
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('admin.content.socialDynamic.fields.url')}
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">
                          <LinkIcon className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const updated = [...(content.socialLinks || [])]
                            updated[index] = { ...link, url: e.target.value }
                            setContent({ ...content, socialLinks: updated })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          placeholder="https://"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (content.socialLinks || []).filter(
                          (_l, idx) => idx !== index,
                        )
                        setContent({ ...content, socialLinks: updated })
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('admin.content.socialDynamic.actions.remove')}
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const list = content.socialLinks || []
                  const newItem: SocialLink = {
                    id: `social-${Date.now()}`,
                    platform: '',
                    label: '',
                    url: '',
                  }
                  setContent({ ...content, socialLinks: [...list, newItem] })
                }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-primary-400 text-primary-600 rounded-lg hover:bg-primary-50 text-sm"
              >
                <Plus className="w-4 h-4" />
                {t('admin.content.socialDynamic.actions.add')}
              </button>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t('admin.content.contact.socialMedia')}
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.content.contact.linkedin')}
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
                  {t('admin.content.contact.instagram')}
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
                  {t('admin.content.contact.whatsapp')}
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
          <div className="mt-8 flex justify-between items-center">
            {uploadedImages.size > 0 && (
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary-600" />
                <span>
                  {uploadedImages.size} şəkil yüklənib. Dəyişiklikləri saxlatmaq üçün SAXLA düyməsini basın.
                </span>
              </div>
            )}
            <div className="ml-auto">
              <motion.button
                onClick={handleSave}
                disabled={loading}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className="relative inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 active:bg-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg hover:shadow-xl"
              >
                {loading && (
                  <>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'linear',
                      }}
                    />
                    <motion.span
                      className="absolute inset-0 bg-white/20"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: 'easeInOut',
                      }}
                    />
                  </>
                )}
                <motion.span
                  animate={loading ? { rotate: 360 } : {}}
                  transition={loading ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
                >
                  <Save className="w-5 h-5" />
                </motion.span>
                <span className="relative z-10">
                  {loading ? t('admin.content.saving') : t('admin.content.save')}
                </span>
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


