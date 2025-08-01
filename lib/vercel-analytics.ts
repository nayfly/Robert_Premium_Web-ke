// Vercel Analytics wrapper
export const vercelAnalytics = {
  // Track de eventos personalizados
  trackCustomEvent: (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", eventName, properties)
    } else {
      console.log("📊 Analytics Event:", eventName, properties)
    }
  },

  // Track de conversiones
  trackConversion: (conversionType: string, value?: number, currency?: string) => {
    const properties: Record<string, any> = { conversion_type: conversionType }
    if (value) properties.value = value
    if (currency) properties.currency = currency

    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "conversion", properties)
    } else {
      console.log("💰 Conversion:", conversionType, properties)
    }
  },

  // Track de clics en CTAs
  trackCTAClick: (ctaLocation: string, ctaType: string) => {
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "cta_click", {
        location: ctaLocation,
        type: ctaType,
      })
    } else {
      console.log("🎯 CTA Click:", ctaLocation, ctaType)
    }
  },

  // Track de visualización de casos de éxito
  trackCaseView: (caseId: string, company: string) => {
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "case_study_view", {
        case_id: caseId,
        company: company,
      })
    } else {
      console.log("📖 Case Study View:", caseId, company)
    }
  },

  // Track de contacto con clientes
  trackClientContact: (caseId: string, method: string) => {
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "client_contact_attempt", {
        case_id: caseId,
        contact_method: method,
      })
    } else {
      console.log("📞 Client Contact:", caseId, method)
    }
  },

  // Track de inicio de pago
  trackPaymentInitiated: (productId: string, amount: number, currency: string) => {
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "payment_initiated", {
        product_id: productId,
        amount: amount,
        currency: currency,
      })
    } else {
      console.log("💳 Payment Initiated:", productId, amount, currency)
    }
  },

  // Track de pago completado
  trackPaymentCompleted: (orderId: string, amount: number, currency: string) => {
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "payment_completed", {
        order_id: orderId,
        amount: amount,
        currency: currency,
      })
    } else {
      console.log("✅ Payment Completed:", orderId, amount, currency)
    }
  },

  // Track de descarga de recursos
  trackDownload: (resourceType: string, resourceName: string) => {
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "resource_download", {
        resource_type: resourceType,
        resource_name: resourceName,
      })
    } else {
      console.log("📥 Download:", resourceType, resourceName)
    }
  },

  // Track de envío de formularios
  trackFormSubmission: (formType: string, formLocation: string) => {
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "form_submission", {
        form_type: formType,
        form_location: formLocation,
      })
    } else {
      console.log("📝 Form Submission:", formType, formLocation)
    }
  },

  // Track de navegación entre secciones
  trackSectionView: (sectionName: string, timeSpent?: number) => {
    const properties: Record<string, any> = { section: sectionName }
    if (timeSpent) properties.time_spent = timeSpent

    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "section_view", properties)
    } else {
      console.log("👁️ Section View:", sectionName, properties)
    }
  },

  // Track de errores
  trackError: (errorType: string, errorMessage: string, errorLocation?: string) => {
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "error", {
        error_type: errorType,
        error_message: errorMessage,
        error_location: errorLocation,
      })
    } else {
      console.log("❌ Error:", errorType, errorMessage, errorLocation)
    }
  },

  // Track de tiempo en página
  trackTimeOnPage: (pageName: string, timeSpent: number) => {
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "time_on_page", {
        page: pageName,
        time_spent: timeSpent,
      })
    } else {
      console.log("⏱️ Time on Page:", pageName, timeSpent)
    }
  },

  // Track de scroll depth
  trackScrollDepth: (depth: number, pageName: string) => {
    if (typeof window !== "undefined" && (window as any).va) {
      ;(window as any).va("track", "scroll_depth", {
        depth: depth,
        page: pageName,
      })
    } else {
      console.log("📜 Scroll Depth:", depth, pageName)
    }
  },
}

// Función para inicializar analytics
export function initializeAnalytics() {
  if (typeof window !== "undefined") {
    // Configurar eventos automáticos
    window.addEventListener("beforeunload", () => {
      const timeSpent = Date.now() - (window as any).pageStartTime
      if (timeSpent > 5000) {
        // Solo si estuvo más de 5 segundos
        vercelAnalytics.trackTimeOnPage(window.location.pathname, timeSpent)
      }
    })

    // Marcar tiempo de inicio
    ;(window as any).pageStartTime = Date.now()

    // Track de scroll depth
    let maxScroll = 0
    window.addEventListener("scroll", () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent
        vercelAnalytics.trackScrollDepth(scrollPercent, window.location.pathname)
      }
    })
  }
}

// Exportar función de tracking genérica para compatibilidad
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  vercelAnalytics.trackCustomEvent(eventName, properties)
}
