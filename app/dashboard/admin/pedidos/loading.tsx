import { Loader2, Package, TrendingUp, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PedidosLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Package className="w-8 h-8" />
            Gestión de Pedidos
          </h1>
          <p className="text-gray-400">Cargando información de pedidos...</p>
        </div>
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>

      {/* Stats Cards Loading */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: DollarSign, title: "Ingresos Totales" },
          { icon: Package, title: "Pedidos Completados" },
          { icon: Users, title: "Clientes Únicos" },
          { icon: TrendingUp, title: "Tasa Conversión" },
        ].map((stat, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
              <div className="h-3 w-16 bg-gray-700 rounded animate-pulse mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Loading */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Pedidos Recientes</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-400 border-b border-gray-700 pb-2">
              <div>ID</div>
              <div>Cliente</div>
              <div>Producto</div>
              <div>Importe</div>
              <div>Estado</div>
              <div>Fecha</div>
            </div>

            {/* Loading Rows */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 py-3 border-b border-gray-700/50">
                <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Cargando pedidos...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
