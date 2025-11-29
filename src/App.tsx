import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'
import ResetPassword from './components/ResetPassword'
import WelcomeModal from './components/WelcomeModal'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import BookingModal from './components/BookingModal'
import Analytics from './components/Analytics'
import { initializeLanguage } from './i18n/config'

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
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check if modal was shown before
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal')
    if (!hasSeenModal && languageInitialized) {
      setShowWelcomeModal(true)
    }
  }, [languageInitialized])

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
        <Projects onOpenBooking={openBookingModal} />
        <Contact />
      </main>
      <Footer />
      
      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />
      
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <WelcomeModal
          onClose={() => setShowWelcomeModal(false)}
          onOpenBooking={() => openBookingModal('flight')}
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        initialType={bookingType}
      />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App

