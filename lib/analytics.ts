"use client"

import { sendGAEvent } from "@next/third-parties/google"

// Tipos de eventos de conversión
export type ConversionEvent =
  | "consultation_request"
  | "product_download"
  | "email_signup"
  | "contact_form_submit"
  | "service_inquiry"
  | "case_study_view"
  | "pricing_view"

// Configuración de eventos de conversión
export const conversionEvents = {
  consultation_request: {
    event_name: "generate_lead",
    event_category: "conversion",
    value: 2500, // Valor estimado de una consulta
    currency: "EUR",
  },
  product_download: {
    event_name: "purchase",
    event_category: "ecommerce",
    value: 97,
    currency: "EUR",
  },
  email_signup: {
    event_name: "sign_up",
    event_category: "engagement",
    value: 50,
    currency: "EUR",
  },
  contact_form_submit: {
    event_name: "generate_lead",
    event_category: "conversion",
    value: 1000,
    currency: "EUR",
  },
  service_inquiry: {
    event_name: "generate_lead",
    event_category: "conversion",
    value: 1500,
    currency: "EUR",
  },
  case_study_view: {
    event_name: "view_item",
    event_category: "engagement",
    value: 10,
    currency: "EUR",
  },
  pricing_view: {
    event_name: "view_item_list",
    event_category: "engagement",
    value: 25,
    currency: "EUR",
  },
}

// Función principal para trackear conversiones
export function trackConversion(eventType: ConversionEvent, additionalData?: Record<string, any>) {
  const eventConfig = conversionEvents[eventType]

  if (!eventConfig) {
    console.warn(`Evento de conversión no configurado: ${eventType}`)
    return
  }

  // Enviar evento a Google Analytics
  sendGAEvent({
    event: eventConfig.event_name,
    event_category: eventConfig.event_category,
    event_label: eventType,
    value: eventConfig.value,
    currency: eventConfig.currency,
    ...additionalData,
  })

  // Log para desarrollo
  if (process.env.NODE_ENV === "development") {
    console.log(`🎯 Conversión trackeada: ${eventType}`, {
      ...eventConfig,
      ...additionalData,
    })
  }
}

// Funciones específicas para cada tipo de conversión
export const analytics = {
  // Consulta gratuita solicitada
  trackConsultationRequest: (source?: string) => {
    trackConversion("consultation_request", {
      source: source || "unknown",
      content_group1: "high_value_lead",
    })
  },

  // Descarga de producto digital
  trackProductDownload: (productName: string, price: number) => {
    trackConversion("product_download", {
      item_name: productName,
      value: price,
      content_group1: "digital_product",
    })
  },

  // Suscripción a newsletter
  trackEmailSignup: (source?: string) => {
    trackConversion("email_signup", {
      source: source || "unknown",
      content_group1: "lead_generation",
    })
  },

  // Formulario de contacto enviado
  trackContactForm: (formType: string) => {
    trackConversion("contact_form_submit", {
      form_type: formType,
      content_group1: "lead_generation",
    })
  },

  // Consulta sobre servicio específico
  trackServiceInquiry: (serviceName: string) => {
    trackConversion("service_inquiry", {
      service_name: serviceName,
      content_group1: "service_interest",
    })
  },

  // Visualización de caso de estudio
  trackCaseStudyView: (caseTitle: string) => {
    trackConversion("case_study_view", {
      case_title: caseTitle,
      content_group1: "social_proof",
    })
  },

  // Visualización de precios
  trackPricingView: (section?: string) => {
    trackConversion("pricing_view", {
      section: section || "services",
      content_group1: "purchase_intent",
    })
  },

  // Eventos personalizados adicionales
  trackCustomEvent: (eventName: string, parameters?: Record<string, any>) => {
    sendGAEvent({
      event: eventName,
      ...parameters,
    })
  },

  // Tracking de scroll profundo (engagement)
  trackScrollDepth: (percentage: number) => {
    sendGAEvent({
      event: "scroll",
      event_category: "engagement",
      event_label: `${percentage}%`,
      value: percentage,
    })
  },

  // Tracking de tiempo en página
  trackTimeOnPage: (seconds: number, page: string) => {
    sendGAEvent({
      event: "timing_complete",
      event_category: "engagement",
      event_label: page,
      value: seconds,
    })
  },
}
