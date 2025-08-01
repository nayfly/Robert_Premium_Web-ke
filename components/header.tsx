"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Menu, X, ArrowRight, Phone, User, LogOut, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  lang?: string
}

export function Header({ lang = "es" }: HeaderProps) {
  const auth = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const user = auth.user
  const logout = auth.logout

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: "Servicios", href: "#servicios" },
    { name: "Casos", href: "#casos" },
  ]

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setIsMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = `/${lang}`
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl"
          : "bg-gray-950/80 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Link href={`/${lang}`} className="block">
              <Logo className="h-10 w-auto" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <motion.div key={item.name} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  {item.name}
                </button>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher currentLang={lang} />

            {/* Auth Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 bg-gray-800/50 hover:bg-gray-700/50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {user.email?.split("@")[0] || "Usuario"}
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                  <DropdownMenuItem asChild>
                    <Link href={`/${lang}/dashboard`} className="flex items-center text-gray-300 hover:text-white">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 mr-2 bg-gray-800/50 hover:bg-gray-700/50"
                  >
                    <Link href={`/${lang}/login`}>
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    variant="outline"
                    className="border-purple-500 text-purple-400 hover:text-white hover:border-purple-400 mr-2 bg-purple-900/20 hover:bg-purple-800/30"
                  >
                    <Link href={`/${lang}/registro`}>Solicitar Acceso</Link>
                  </Button>
                </motion.div>
              </>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="btn-primary px-6 py-2"
                onClick={() => window.open("https://calendly.com/robertsoftware/consulta-estrategica", "_blank")}
              >
                <Phone className="w-4 h-4 mr-2" />
                Llamada Gratis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <LanguageSwitcher currentLang={lang} />
            <motion.button
              className="text-gray-300 hover:text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-gray-950/98 backdrop-blur-xl border-t border-gray-800/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-custom py-6">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-left py-2"
                    >
                      {item.name}
                    </button>
                  </motion.div>
                ))}

                {/* Mobile Auth Section */}
                <motion.div
                  className="pt-4 border-t border-gray-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {user ? (
                    <div className="space-y-2">
                      <Link
                        href={`/${lang}/dashboard`}
                        className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center text-red-400 hover:text-red-300 transition-colors duration-200 font-medium py-2"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href={`/${lang}/login`}
                        className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Login
                      </Link>
                      <Link
                        href={`/${lang}/registro`}
                        className="flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Solicitar Acceso
                      </Link>
                    </div>
                  )}
                </motion.div>
              </nav>

              <motion.div
                className="mt-6 pt-6 border-t border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Button
                  className="btn-primary w-full py-3"
                  onClick={() => {
                    window.open("https://calendly.com/robertsoftware/consulta-estrategica", "_blank")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Llamada Gratis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
