"use client"
import { useEffect, useState, useRef } from "react"
import type React from "react"

import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion"
import {
  ScrollProgressBar,
  FloatingParticles,
  AnimatedCounter,
  TypewriterEffect,
  AnimatedButton,
} from "./premium-animations-components"

// Main Premium Animations Component
export function PremiumAnimations() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth"

    // Set loaded state
    setIsLoaded(true)

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(".animate-on-scroll")
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!isLoaded) return null

  return (
    <>
      <ScrollProgressBar />
      <FloatingParticles />
    </>
  )
}

// Animación de entrada premium para secciones
export function PremiumSectionReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.95 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
        scale: { duration: 0.6 },
      }}
    >
      {children}
    </motion.div>
  )
}

// Efecto parallax premium
export function PremiumParallax({
  children,
  offset = 50,
  className = "",
}: {
  children: React.ReactNode
  offset?: number
  className?: string
}) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, offset])
  const springY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div style={{ y: springY }} className={className}>
      {children}
    </motion.div>
  )
}

// Contador animado premium
export function PremiumCounter({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
}: {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// Efecto de escritura premium
export function PremiumTypewriter({
  text,
  delay = 0,
  speed = 50,
  className = "",
}: {
  text: string
  delay?: number
  speed?: number
  className?: string
}) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const timeout = setTimeout(
      () => {
        if (currentIndex < text.length) {
          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }
      },
      currentIndex === 0 ? delay : speed,
    )

    return () => clearTimeout(timeout)
  }, [currentIndex, text, delay, speed, isInView])

  return (
    <span ref={ref} className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="inline-block w-0.5 h-6 bg-purple-400 ml-1"
      />
    </span>
  )
}

// Botón premium con efectos avanzados
export function PremiumButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
}) {
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25",
    secondary: "border-2 border-gray-600 text-white bg-transparent backdrop-blur-sm",
    ghost: "text-gray-300 hover:text-white hover:bg-gray-800/30",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-12 py-6 text-lg",
  }

  return (
    <motion.button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-semibold rounded-xl transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      whileHover={{
        scale: disabled ? 1 : 1.05,
        boxShadow: variant === "primary" ? "0 20px 40px rgba(139, 92, 246, 0.4)" : undefined,
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {children}
      </motion.span>
    </motion.button>
  )
}

// Contenedor de animaciones stagger
export function PremiumStagger({
  children,
  staggerDelay = 0.1,
  className = "",
}: {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// Item para stagger
export function PremiumStaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  )
}

// Export individual components for use in other files
export { AnimatedCounter, TypewriterEffect, AnimatedButton }
