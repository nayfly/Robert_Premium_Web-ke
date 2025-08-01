"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { analytics } from "@/lib/analytics"

export function AnalyticsWrapper() {
  const pathname = usePathname()

  useEffect(() => {
    // Track scroll depth
    let maxScroll = 0
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
      )

      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent
        analytics.trackScrollDepth(scrollPercent)
      }
    }

    // Track time on page
    const startTime = Date.now()
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      if (timeSpent > 30) {
        // Solo trackear si pasa más de 30 segundos
        analytics.trackTimeOnPage(timeSpent, pathname)
      }
    }

    window.addEventListener("scroll", trackScrollDepth)
    window.addEventListener("beforeunload", trackTimeOnPage)

    return () => {
      window.removeEventListener("scroll", trackScrollDepth)
      window.removeEventListener("beforeunload", trackTimeOnPage)
    }
  }, [pathname])

  return null
}
