import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Google Analytics 4 (GA4) integration
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

// Cookie razılığı CookieConsent komponenti ilə eyni açardan oxunur
const CONSENT_KEY = 'cookieConsent'
const CONSENT_EVENT = 'cookie-consent-change'

const readConsent = (): boolean => {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted'
  } catch {
    return false
  }
}

// Analytics tracking component
// Hər cür izləmə (GA4 və öz /api/analytics/track sorğuları) yalnız istifadəçi
// cookie-lərə razılıq verdikdən sonra işləyir.
export default function Analytics() {
  const location = useLocation()
  const [consent, setConsent] = useState<boolean>(readConsent)
  // @ts-ignore - Vite environment variables
  const gaId = import.meta.env?.VITE_GOOGLE_ANALYTICS_ID || ''

  // Razılıq dəyişəndə (bannerdə klik və ya başqa tabda) vəziyyəti yenilə
  useEffect(() => {
    const sync = () => setConsent(readConsent())
    window.addEventListener(CONSENT_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // Initialize Google Analytics
  useEffect(() => {
    if (!consent || !gaId || typeof window === 'undefined') return

    // Skripti yalnız bir dəfə əlavə et
    if (!document.getElementById('ga-gtag-script')) {
      const script1 = document.createElement('script')
      script1.id = 'ga-gtag-script'
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
      document.head.appendChild(script1)
    }

    // Initialize dataLayer and gtag
    // Qeyd: gtag.js dataLayer-də massiv yox, `arguments` obyekti gözləyir
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', gaId, {
      page_path: location.pathname,
    })
    // location.pathname burada yalnız ilkin qoşulma üçündür
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gaId, consent])

  // Track page views with GA4
  useEffect(() => {
    if (consent && gaId && window.gtag) {
      window.gtag('config', gaId, {
        page_path: location.pathname,
        page_title: document.title,
      })
    }
  }, [location, gaId, consent])

  useEffect(() => {
    if (!consent) return

    // Track page view
    const trackPageView = async () => {
      try {
        // Send page view to backend
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'pageview',
            path: location.pathname,
            timestamp: new Date().toISOString(),
            referrer: document.referrer || '',
            userAgent: navigator.userAgent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
          }),
        })
      } catch (error) {
        console.error('Analytics tracking error:', error)
      }
    }

    trackPageView()
  }, [location, consent])

  // Track button clicks and interactions
  useEffect(() => {
    if (!consent) return

    const trackClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const button = target.closest('button, a')

      if (button) {
        const buttonText = button.textContent?.trim() || ''
        const buttonId = button.getAttribute('id') || button.getAttribute('aria-label') || ''

        // Track important buttons
        if (
          buttonText.includes('Rezerv') ||
          buttonText.includes('Əlaqə') ||
          buttonText.includes('WhatsApp') ||
          buttonId
        ) {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'click',
              element: buttonText || buttonId,
              path: location.pathname,
              timestamp: new Date().toISOString(),
            }),
          }).catch(console.error)
        }
      }
    }

    document.addEventListener('click', trackClick)
    return () => document.removeEventListener('click', trackClick)
  }, [location, consent])

  // Track scroll depth
  useEffect(() => {
    if (!consent) return

    let maxScroll = 0
    const trackScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      )

      if (scrollPercent > maxScroll && scrollPercent >= 25) {
        maxScroll = scrollPercent

        // Track at 25%, 50%, 75%, 100%
        if ([25, 50, 75, 100].includes(scrollPercent)) {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'scroll',
              depth: scrollPercent,
              path: location.pathname,
              timestamp: new Date().toISOString(),
            }),
          }).catch(console.error)
        }
      }
    }

    window.addEventListener('scroll', trackScroll, { passive: true })
    return () => window.removeEventListener('scroll', trackScroll)
  }, [location, consent])

  return null
}
