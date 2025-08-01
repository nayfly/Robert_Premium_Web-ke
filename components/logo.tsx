"use client"

import { motion } from "framer-motion"
import { Mountain } from "lucide-react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <div className={`flex items-center space-x-2 group ${className}`}>
      <div
        className={`flex ${sizeClasses[size]} items-center justify-center rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-300`}
      >
        <Mountain className={`${iconSizes[size]} text-purple-500`} />
      </div>
      <motion.span
        className={`font-bold text-white group-hover:text-purple-400 transition-colors duration-300 ${textSizes[size]}`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        Robert
      </motion.span>
    </div>
  )
}
