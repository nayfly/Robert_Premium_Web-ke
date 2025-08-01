"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useSpring, useInView, useAnimation } from "framer-motion"

// Scroll Progress Bar
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform-origin-0 z-50"
      style={{ scaleX }}
    />
  )
}

// Floating Particles
export function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => i)

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

// Animated Counter
interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  suffix?: string
  prefix?: string
}

export function AnimatedCounter({ from, to, duration = 2, suffix = "", prefix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(from)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const increment = (to - from) / (duration * 60) // 60fps
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev < to) {
            return Math.min(prev + increment, to)
          }
          clearInterval(timer)
          return to
        })
      }, 1000 / 60)

      return () => clearInterval(timer)
    }
  }, [isInView, from, to, duration])

  return (
    <span ref={ref}>
      {prefix}
      {Math.floor(count)}
      {suffix}
    </span>
  )
}

// Typewriter Effect
interface TypewriterEffectProps {
  text: string
  speed?: number
  delay?: number
}

export function TypewriterEffect({ text, speed = 50, delay = 0 }: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView && currentIndex < text.length) {
      const timeout = setTimeout(
        () => {
          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        },
        currentIndex === 0 ? delay : speed,
      )

      return () => clearTimeout(timeout)
    }
  }, [isInView, currentIndex, text, speed, delay])

  return (
    <span ref={ref}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="inline-block w-0.5 h-6 bg-current ml-1"
      />
    </span>
  )
}

// Animated Button
interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary"
}

export function AnimatedButton({ children, onClick, className = "", variant = "primary" }: AnimatedButtonProps) {
  const controls = useAnimation()

  const handleClick = () => {
    controls.start({
      scale: [1, 0.95, 1],
      transition: { duration: 0.2 },
    })
    onClick?.()
  }

  const baseClasses =
    variant === "primary"
      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
      : "bg-transparent border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"

  return (
    <motion.button
      className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${baseClasses} ${className}`}
      onClick={handleClick}
      animate={controls}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}
