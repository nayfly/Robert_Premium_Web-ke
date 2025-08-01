import { Loader2 } from "lucide-react"

export default function PaymentLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto" />
        <h2 className="text-2xl font-bold text-white">Procesando Pago</h2>
        <p className="text-gray-300">Por favor, espera mientras procesamos tu pago...</p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>Conexión segura con Stripe</span>
        </div>
      </div>
    </div>
  )
}
