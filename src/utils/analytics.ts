// Analytics tracking utility
interface AnalyticsEvent {
  type: 'pageview' | 'section_view' | 'button_click' | 'form_submit' | 'scroll_depth' | 'time_spent' | 'exit_intent';
  timestamp: string;
  page: string;
  section?: string;
  action?: string;
  data?: Record<string, any>;
  userAgent?: string;
  referrer?: string;
  screenWidth?: number;
  screenHeight?: number;
}

class Analytics {
  private sessionId: string;
  private startTime: number;
  private pageStartTime: number;
  private sectionViews: Set<string> = new Set();
  private scrollDepth: number = 0;
  private maxScrollDepth: number = 0;
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageStartTime = Date.now();
    this.initTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initTracking() {
    // Track page view on load
    this.trackPageView();

    // Track scroll depth
    this.trackScrollDepth();

    // Track time spent
    this.trackTimeSpent();

    // Track exit intent
    this.trackExitIntent();

    // Track section views
    this.trackSectionViews();

    // Send batch events periodically
    setInterval(() => {
      this.sendBatchEvents();
    }, 30000); // Every 30 seconds

    // Send events on page unload
    window.addEventListener('beforeunload', () => {
      this.sendBatchEvents(true);
    });
  }

  private trackPageView() {
    const event: AnalyticsEvent = {
      type: 'pageview',
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };
    this.addEvent(event);
  }

  private trackScrollDepth() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
          
          if (scrollPercent > this.maxScrollDepth) {
            this.maxScrollDepth = scrollPercent;
            this.scrollDepth = scrollPercent;
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  private trackTimeSpent() {
    setInterval(() => {
      const timeSpent = Math.round((Date.now() - this.pageStartTime) / 1000);
      if (timeSpent > 0 && timeSpent % 30 === 0) { // Every 30 seconds
        const event: AnalyticsEvent = {
          type: 'time_spent',
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          data: { seconds: timeSpent },
        };
        this.addEvent(event);
      }
    }, 1000);
  }

  private trackExitIntent() {
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0) {
        const event: AnalyticsEvent = {
          type: 'exit_intent',
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          data: { scrollDepth: this.maxScrollDepth, timeSpent: Math.round((Date.now() - this.pageStartTime) / 1000) },
        };
        this.addEvent(event);
      }
    });
  }

  private trackSectionViews() {
    const sections = ['home', 'about', 'skills', 'services', 'projects', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId && !this.sectionViews.has(sectionId)) {
              this.sectionViews.add(sectionId);
              this.trackSectionView(sectionId);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });
  }

  trackSectionView(sectionId: string) {
    const event: AnalyticsEvent = {
      type: 'section_view',
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      section: sectionId,
    };
    this.addEvent(event);
  }

  trackButtonClick(buttonName: string, location?: string) {
    const event: AnalyticsEvent = {
      type: 'button_click',
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      action: buttonName,
      data: { location },
    };
    this.addEvent(event);
  }

  trackFormSubmit(formType: string, success: boolean) {
    const event: AnalyticsEvent = {
      type: 'form_submit',
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      action: formType,
      data: { success, scrollDepth: this.maxScrollDepth, timeSpent: Math.round((Date.now() - this.pageStartTime) / 1000) },
    };
    this.addEvent(event);
    this.sendEvent(event); // Send immediately for form submissions
  }

  private addEvent(event: AnalyticsEvent) {
    this.events.push({
      ...event,
      data: {
        ...event.data,
        sessionId: this.sessionId,
      },
    });
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      return response.ok;
    } catch (error) {
      console.error('Analytics error:', error);
      return false;
    }
  }

  private async sendBatchEvents(sync: boolean = false) {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    if (sync) {
      // Send synchronously on page unload
      await Promise.all(eventsToSend.map((event) => this.sendEvent(event)));
    } else {
      // Send asynchronously
      eventsToSend.forEach((event) => this.sendEvent(event));
    }
  }

  // Public method to track custom events
  trackCustomEvent(type: string, data?: Record<string, any>) {
    const event: AnalyticsEvent = {
      type: type as any,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      data: {
        ...data,
        sessionId: this.sessionId,
        scrollDepth: this.maxScrollDepth,
        timeSpent: Math.round((Date.now() - this.pageStartTime) / 1000),
      },
    };
    this.addEvent(event);
  }
}

// Export singleton instance
export const analytics = new Analytics();

