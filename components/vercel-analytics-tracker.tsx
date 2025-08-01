"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { track } from "@vercel/analytics"

export function VercelAnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views
    track("page_view", {
      page: pathname,
      timestamp: new Date().toISOString(),
    })
  }, [pathname])

  useEffect(() => {
    // Track scroll depth
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
      )

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent

        // Track milestone scrolls
        if (scrollPercent >= 25 && maxScroll < 25) {
          track("scroll_depth", { depth: "25%", page: pathname })
        } else if (scrollPercent >= 50 && maxScroll < 50) {
          track("scroll_depth", { depth: "50%", page: pathname })
        } else if (scrollPercent >= 75 && maxScroll < 75) {
          track("scroll_depth", { depth: "75%", page: pathname })
        } else if (scrollPercent >= 90 && maxScroll < 90) {
          track("scroll_depth", { depth: "90%", page: pathname })
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  useEffect(() => {
    // Track time on page
    const startTime = Date.now()

    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      track("time_on_page", {
        page: pathname,
        seconds: timeSpent,
      })
    }

    // Track when user leaves page
    const handleBeforeUnload = () => {
      trackTimeOnPage()
    }

    // Track every 30 seconds for active users
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        trackTimeOnPage()
      }
    }, 30000)

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      clearInterval(interval)
      trackTimeOnPage()
    }
  }, [pathname])

  return null
}
