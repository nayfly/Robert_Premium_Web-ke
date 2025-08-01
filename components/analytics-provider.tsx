"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { track } from "@vercel/analytics"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Track page view usando Vercel Analytics nativo
      track("page_view", {
        path: pathname,
        timestamp: new Date().toISOString(),
      })

      // Track tiempo en página
      const startTime = Date.now()

      const handleBeforeUnload = () => {
        const timeOnPage = Date.now() - startTime
        track("time_on_page", {
          path: pathname,
          duration: timeOnPage,
        })
      }

      // Track scroll depth
      let maxScrollDepth = 0
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        const scrollDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100)

        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth

          // Track milestone scroll depths
          if (scrollDepth >= 25 && scrollDepth < 50) {
            track("scroll_depth", { depth: 25, path: pathname })
          } else if (scrollDepth >= 50 && scrollDepth < 75) {
            track("scroll_depth", { depth: 50, path: pathname })
          } else if (scrollDepth >= 75 && scrollDepth < 100) {
            track("scroll_depth", { depth: 75, path: pathname })
          } else if (scrollDepth >= 100) {
            track("scroll_depth", { depth: 100, path: pathname })
          }
        }
      }

      window.addEventListener("beforeunload", handleBeforeUnload)
      window.addEventListener("scroll", handleScroll, { passive: true })

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload)
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [pathname])

  return <>{children}</>
}
