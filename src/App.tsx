import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { ErrorBoundary } from './components/ErrorBoundary'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import HowItWorks from './components/HowItWorks'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Analytics from './components/Analytics'
import { initializeLanguage } from './i18n/config'
import CookieConsent from './components/CookieConsent'
import NotFound from './components/NotFound'

// Böyük və ya yalnız lazım olduqda açılan hissələr ayrıca yüklənir (code splitting)
const AdminPanel = lazy(() => import('./components/AdminPanel'))
const ResetPassword = lazy(() => import('./components/ResetPassword'))
const WelcomeModal = lazy(() => import('./components/WelcomeModal'))
const BookingModal = lazy(() => import('./components/BookingModal'))

type BookingType = 'flight' | 'hotel' | 'transfer' | 'insurance' | 'embassy'

function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingType, setBookingType] = useState<BookingType>('flight')
  const [languageInitialized, setLanguageInitialized] = useState(false)

  // Dil detection-i aktivləşdir
  useEffect(() => {
    initializeLanguage().then(() => {
      setLanguageInitialized(true)
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check if modal was shown before
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal')
    if (!hasSeenModal && languageInitialized) {
      setShowWelcomeModal(true)
    }
  }, [languageInitialized])

  // Rezervasiya pəncərəsinin kodunu səhifə yüklənəndən sonra əvvəlcədən gətir,
  // istifadəçi düyməyə basanda gecikmə olmasın
  useEffect(() => {
    const timer = window.setTimeout(() => {
      import('./components/BookingModal').catch(() => {
        // Yükləmə alınmadısa, düyməyə basanda yenidən cəhd olunacaq
      })
    }, 3000)
    return () => window.clearTimeout(timer)
  }, [])

  const openBookingModal = (type: BookingType = 'flight') => {
    setBookingType(type)
    setShowBookingModal(true)
  }

  return (
    <div className="min-h-screen">
      <Analytics />
      <Navigation isScrolled={isScrolled} onOpenBooking={openBookingModal} />
      <main>
        <Hero onOpenBooking={openBookingModal} />
        <About />
        <Services onOpenBooking={openBookingModal} />
        <HowItWorks />
        <Projects onOpenBooking={openBookingModal} />
        <Contact />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />
      {/* Cookie / Privacy banner */}
      <CookieConsent />

      <Suspense fallback={null}>
        {/* Welcome Modal */}
        {showWelcomeModal && (
          <WelcomeModal
            onClose={() => setShowWelcomeModal(false)}
            onOpenBooking={() => openBookingModal('flight')}
          />
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <BookingModal
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            initialType={bookingType}
          />
        )}
      </Suspense>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      {/* Sistemində "hərəkəti azalt" seçilibsə, animasiyalar avtomatik söndürülür */}
      <MotionConfig reducedMotion="user">
        <Router>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </MotionConfig>
    </ErrorBoundary>
  )
}

export default App
