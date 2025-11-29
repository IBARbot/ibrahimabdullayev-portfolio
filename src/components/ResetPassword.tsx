import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, CheckCircle } from 'lucide-react'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  })
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Etibarsız və ya eksik token' })
    }
  }, [token])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: null, text: '' })

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Şifrələr uyğun gəlmir' })
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Şifrə ən azı 8 simvol olmalıdır' })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        setSuccess(true)
        setTimeout(() => {
          navigate('/admin')
        }, 3000)
      } else {
        setMessage({ type: 'error', text: data.message || 'Xəta baş verdi' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Xəta baş verdi' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Şifrə Sıfırlandı!</h2>
          <p className="text-gray-600 mb-4">
            Şifrəniz uğurla sıfırlandı. Zəhmət olmasa Vercel Dashboard-da ADMIN_PASSWORD environment variable-ını yeniləyin.
          </p>
          <p className="text-sm text-gray-500">
            Admin panel-ə yönləndirilirsiniz...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg"
      >
        <div className="flex items-center justify-center mb-6">
          <Lock className="w-12 h-12 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Yeni Şifrə Təyin Et</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Yeni şifrənizi daxil edin
        </p>

        {message.type && (
          <div
            className={`p-3 rounded-lg mb-4 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Şifrə
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Ən azı 8 simvol"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifrəni Təsdiq Et
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Şifrəni təkrar daxil edin"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sıfırlanır...' : 'Şifrəni Sıfırla'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="text-sm text-primary-600 hover:text-primary-700 underline"
            >
              Admin Panel-ə qayıt
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

