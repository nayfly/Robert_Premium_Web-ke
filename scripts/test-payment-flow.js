const https = require("https")
const http = require("http")

// Configuración
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const TEST_EMAIL = process.env.TEST_EMAIL || "test@robertsoftware.es"

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith("https")
    const client = isHttps ? https : http

    const req = client.request(
      url,
      {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      },
      (res) => {
        let data = ""

        res.on("data", (chunk) => {
          data += chunk
        })

        res.on("end", () => {
          try {
            const jsonData = JSON.parse(data)
            resolve({
              status: res.statusCode,
              data: jsonData,
              success: res.statusCode >= 200 && res.statusCode < 300,
            })
          } catch (error) {
            resolve({
              status: res.statusCode,
              data: { error: "Invalid JSON response", raw: data },
              success: false,
            })
          }
        })
      },
    )

    req.on("error", (error) => {
      reject(error)
    })

    if (options.body) {
      req.write(JSON.stringify(options.body))
    }

    req.end()
  })
}

async function runTest(testName, testFunction) {
  log(`\n🧪 Ejecutando: ${testName}`, "cyan")
  log("─".repeat(50), "blue")

  const startTime = Date.now()

  try {
    const result = await testFunction()
    const duration = Date.now() - startTime

    if (result.success) {
      log(`✅ ${testName} - EXITOSO (${duration}ms)`, "green")
      if (result.message) {
        log(`   ${result.message}`, "green")
      }
      return { success: true, result, duration }
    } else {
      log(`❌ ${testName} - FALLÓ (${duration}ms)`, "red")
      log(`   Error: ${result.error || "Error desconocido"}`, "red")
      return { success: false, result, duration }
    }
  } catch (error) {
    const duration = Date.now() - startTime
    log(`❌ ${testName} - ERROR (${duration}ms)`, "red")
    log(`   ${error.message}`, "red")
    return { success: false, error: error.message, duration }
  }
}

// Tests individuales
const tests = {
  async database() {
    const response = await makeRequest(`${BASE_URL}/api/test/database`)
    return {
      success: response.success,
      message: response.data.message,
      error: response.data.error,
      details: response.data.details,
    }
  },

  async stripe() {
    const response = await makeRequest(`${BASE_URL}/api/test/stripe`)
    return {
      success: response.success,
      message: response.data.message,
      error: response.data.error,
      details: response.data.details,
    }
  },

  async paymentIntent() {
    const response = await makeRequest(`${BASE_URL}/api/create-payment-intent`, {
      method: "POST",
      body: {
        productId: "automation_ai",
        customerInfo: {
          name: "Test Customer",
          email: TEST_EMAIL,
          phone: "+34600123456",
          address: "Calle Test 123",
          city: "Madrid",
          postalCode: "28001",
          country: "España",
        },
      },
    })

    if (response.success && response.data.orderId) {
      // Guardar orderId para tests posteriores
      global.testOrderId = response.data.orderId
      global.testClientSecret = response.data.clientSecret
    }

    return {
      success: response.success,
      message: response.data.success ? "Payment Intent creado correctamente" : null,
      error: response.data.error,
      orderId: response.data.orderId,
    }
  },

  async orderVerification() {
    if (!global.testOrderId) {
      return {
        success: false,
        error: "No hay Order ID para verificar (test anterior falló)",
      }
    }

    const response = await makeRequest(`${BASE_URL}/api/orders/${global.testOrderId}`)
    return {
      success: response.success,
      message: response.data.success ? "Orden verificada correctamente" : null,
      error: response.data.error,
      order: response.data.data,
    }
  },

  async invoiceGeneration() {
    if (!global.testOrderId) {
      return {
        success: false,
        error: "No hay Order ID para generar factura",
      }
    }

    const response = await makeRequest(`${BASE_URL}/api/invoices?orderId=${global.testOrderId}`)
    return {
      success: response.success,
      message: response.data.success ? "Factura generada correctamente" : null,
      error: response.data.error,
      invoice: response.data.invoice,
    }
  },

  async downloadToken() {
    if (!global.testOrderId) {
      return {
        success: false,
        error: "No hay Order ID para generar token",
      }
    }

    const response = await makeRequest(`${BASE_URL}/api/downloads?orderId=${global.testOrderId}`)

    if (response.success && response.data.download) {
      global.testDownloadToken = response.data.download.download_token
    }

    return {
      success: response.success,
      message: response.data.success ? "Token de descarga generado" : null,
      error: response.data.error,
      token: response.data.download?.download_token,
    }
  },

  async emailNotification() {
    const response = await makeRequest(`${BASE_URL}/api/test/email`, {
      method: "POST",
    })
    return {
      success: response.success,
      message: response.data.message,
      error: response.data.error,
      details: response.data.details,
    }
  },

  async cleanup() {
    const response = await makeRequest(`${BASE_URL}/api/test/cleanup`, {
      method: "POST",
      body: {
        orderId: global.testOrderId || null,
      },
    })
    return {
      success: response.success,
      message: response.data.message,
      error: response.data.error,
    }
  },
}

async function main() {
  log("🚀 INICIANDO TESTING DEL SISTEMA DE PAGOS", "bright")
  log("=".repeat(60), "blue")
  log(`Base URL: ${BASE_URL}`, "yellow")
  log(`Test Email: ${TEST_EMAIL}`, "yellow")
  log("=".repeat(60), "blue")

  const results = []
  const testOrder = [
    "database",
    "stripe",
    "paymentIntent",
    "orderVerification",
    "invoiceGeneration",
    "downloadToken",
    "emailNotification",
    "cleanup",
  ]

  for (const testName of testOrder) {
    const result = await runTest(testName, tests[testName])
    results.push({ name: testName, ...result })

    // Pausa entre tests
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  // Resumen final
  log("\n📊 RESUMEN DE RESULTADOS", "bright")
  log("=".repeat(60), "blue")

  const passed = results.filter((r) => r.success).length
  const total = results.length
  const successRate = ((passed / total) * 100).toFixed(1)

  log(`Tests ejecutados: ${total}`, "cyan")
  log(`Tests exitosos: ${passed}`, "green")
  log(`Tests fallidos: ${total - passed}`, "red")
  log(`Tasa de éxito: ${successRate}%`, successRate === "100.0" ? "green" : "yellow")

  const totalTime = results.reduce((sum, r) => sum + (r.duration || 0), 0)
  log(`Tiempo total: ${totalTime}ms`, "cyan")

  log("\n📋 DETALLE POR TEST:", "bright")
  results.forEach((result, index) => {
    const status = result.success ? "✅" : "❌"
    const color = result.success ? "green" : "red"
    log(`${index + 1}. ${status} ${result.name} (${result.duration}ms)`, color)
  })

  if (successRate === "100.0") {
    log("\n🎉 ¡TODOS LOS TESTS PASARON! El sistema está funcionando correctamente.", "green")
  } else {
    log("\n⚠️  Algunos tests fallaron. Revisa la configuración y logs anteriores.", "yellow")
  }

  log("\n🔧 Para más detalles, usa la interfaz web: /dashboard/admin/testing", "cyan")
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch((error) => {
    log(`\n💥 Error fatal: ${error.message}`, "red")
    process.exit(1)
  })
}

module.exports = { tests, runTest, makeRequest }
