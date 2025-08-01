"use client"

import { motion } from "framer-motion"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  ExternalLink,
  Shield,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

interface FooterProps {
  lang: string
}

export function Footer({ lang }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: "Servicios", href: "#servicios" },
    { name: "Casos de Éxito", href: "#casos" },
    { name: "Sobre Mí", href: "#autoridad" },
    { name: "Panel Cliente", href: `/${lang}/panel` },
  ]

  const legalLinks = [
    { name: "Aviso Legal", href: "/legal/aviso-legal" },
    { name: "Política de Privacidad", href: "/legal/privacidad" },
    { name: "Términos y Condiciones", href: "/legal/terminos" },
    { name: "Política de Cookies", href: "/legal/cookies" },
  ]

  const services = [
    { name: "Auditoría Estratégica", href: "#servicios" },
    { name: "Implementación IA", href: "#servicios" },
    { name: "Ciberseguridad", href: "#servicios" },
    { name: "Automatización", href: "#servicios" },
    { name: "Growth Partner", href: "#servicios" },
  ]

  const trustSignals = [
    {
      icon: Shield,
      text: "100% Seguro",
      detail: "Datos protegidos",
    },
    {
      icon: Award,
      text: "Garantía Total",
      detail: "ROI o reembolso",
    },
    {
      icon: Clock,
      text: "Respuesta 24h",
      detail: "Soporte premium",
    },
    {
      icon: CheckCircle,
      text: "47 Empresas",
      detail: "Transformadas",
    },
  ]

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <footer className="bg-gradient-to-b from-gray-950 to-black border-t border-gray-800">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <Logo className="h-12 w-auto mb-4" />
              <p className="text-gray-300 leading-relaxed mb-6">
                Growth Partner Tecnológico que transforma empresas con IA, automatización y ciberseguridad.{" "}
                <strong className="text-white">ROI garantizado del 300%+</strong>.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30 px-3 py-1 text-xs">
                  ✅ VERIFICADO
                </Badge>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 px-3 py-1 text-xs">
                  🏆 TOP CONSULTANT
                </Badge>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-purple-400" />
                <a href="mailto:hola@robertsoftware.com" className="hover:text-white transition-colors">
                  hola@robertsoftware.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-green-400" />
                <a href="https://wa.me/34600000000" className="hover:text-white transition-colors">
                  +34 600 000 000
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Valencia, España</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <motion.a
                href="https://linkedin.com/in/robertsoftware"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-lg hover:bg-purple-600/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-5 h-5 text-gray-300 hover:text-purple-400" />
              </motion.a>
              <motion.a
                href="https://twitter.com/robertsoftware"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-lg hover:bg-blue-600/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="w-5 h-5 text-gray-300 hover:text-blue-400" />
              </motion.a>
              <motion.a
                href="https://github.com/robertsoftware"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-lg hover:bg-gray-600/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5 text-gray-300 hover:text-gray-400" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-bold text-lg mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith("#") ? (
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-bold text-lg mb-6">Servicios</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <button
                    onClick={() =>
                      service.href.startsWith("#") ? scrollToSection(service.href) : window.open(service.href, "_blank")
                    }
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-bold text-lg mb-6">¿Listo para Transformar tu Empresa?</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Reserva una llamada estratégica gratuita y descubre cómo puedo ayudarte a{" "}
              <strong className="text-green-400">multiplicar tus ingresos</strong>.
            </p>
            <Button
              className="btn-primary w-full mb-6"
              onClick={() => window.open("https://calendly.com/robertsoftware/consulta-estrategica", "_blank")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Llamada Gratis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-3">
              {trustSignals.map((signal, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-3 text-center">
                  <signal.icon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-white font-semibold text-xs">{signal.text}</div>
                  <div className="text-gray-400 text-xs">{signal.detail}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Legal Links */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-8">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2"
              >
                Powered by Vercel
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-sm">
              © {currentYear} Robert Software. Todos los derechos reservados. |{" "}
              <span className="text-purple-400">Transformando empresas con tecnología</span>
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
