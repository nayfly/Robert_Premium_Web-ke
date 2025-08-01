import { Loader2, CheckCircle } from "lucide-react"

export default function SuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          <Loader2 className="w-6 h-6 text-white animate-spin absolute -top-1 -right-1" />
        </div>
        <h2 className="text-2xl font-bold text-white">Confirmando Compra</h2>
        <p className="text-gray-300">Estamos preparando tu descarga...</p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Generando enlaces de descarga</span>
        </div>
      </div>
    </div>
  )
}
