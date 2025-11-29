import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Analytics tracking component
export default function Analytics() {
  const location = useLocation()

  useEffect(() => {
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
  }, [location])

  // Track button clicks and interactions
  useEffect(() => {
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
  }, [location])

  // Track scroll depth
  useEffect(() => {
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
  }, [location])

  return null
}

