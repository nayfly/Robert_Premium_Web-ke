"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Package,
  Search,
  Filter,
  Download,
  Mail,
  RefreshCw,
  Eye,
  DollarSign,
  TrendingUp,
  FileText,
  MessageSquare,
  AlertCircle,
} from "lucide-react"

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  customer_company?: string
  product_name: string
  product_id: string
  amount: number
  currency: string
  status: string
  admin_status?: string
  admin_notes?: string
  stripe_payment_intent_id: string
  download_token: string
  created_at: string
  updated_at: string
  download_tokens?: Array<{
    id: string
    token: string
    downloads_count: number
    max_downloads: number
    expires_at: string
    created_at: string
  }>
}

interface OrderStats {
  total_orders: number
  total_revenue: number
  pending_orders: number
  completed_orders: number
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats>({
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    completed_orders: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters,
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders)
        setStats(data.stats)
        setPagination(data.pagination)
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al cargar pedidos",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [pagination.page, filters])

  const handleOrderAction = async (orderId: string, action: string, data?: any) => {
    try {
      setActionLoading(`${orderId}-${action}`)

      const response = await fetch(`/api/admin/orders/${orderId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Éxito",
          description: result.message,
        })
        fetchOrders() // Recargar datos
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al ejecutar acción",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string, adminStatus?: string) => {
    const displayStatus = adminStatus || status
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      succeeded: "default",
      completed: "default",
      pending: "secondary",
      processing: "secondary",
      failed: "destructive",
      cancelled: "destructive",
      refunded: "outline",
    }

    return (
      <Badge variant={variants[displayStatus] || "secondary"}>
        {displayStatus === "succeeded"
          ? "Completado"
          : displayStatus === "pending"
            ? "Pendiente"
            : displayStatus === "failed"
              ? "Fallido"
              : displayStatus === "cancelled"
                ? "Cancelado"
                : displayStatus === "refunded"
                  ? "Reembolsado"
                  : displayStatus}
      </Badge>
    )
  }

  const formatCurrency = (amount: number, currency = "EUR") => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Pedidos</h1>
          <p className="text-gray-400">Administra todas las ventas y descargas</p>
        </div>
        <Button onClick={fetchOrders} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Pedidos</CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total_orders}</div>
              <p className="text-xs text-green-400">Todos los tiempos</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(stats.total_revenue)}</div>
              <p className="text-xs text-green-400">Ventas confirmadas</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pendientes</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pending_orders}</div>
              <p className="text-xs text-yellow-400">Requieren atención</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Completados</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.completed_orders}</div>
              <p className="text-xs text-purple-400">Exitosos</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por cliente, email o ID..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="succeeded">Completado</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="failed">Fallido</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Desde"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />

            <Input
              type="date"
              placeholder="Hasta"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Pedidos ({pagination.total})</CardTitle>
          <CardDescription className="text-gray-400">
            Página {pagination.page} de {pagination.totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
              <span className="ml-2 text-gray-400">Cargando pedidos...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron pedidos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                      {/* ID y Cliente */}
                      <div>
                        <p className="text-xs text-gray-400">ID</p>
                        <p className="text-white font-mono text-sm">{order.id.slice(0, 8)}...</p>
                        <p className="text-white font-medium">{order.customer_name}</p>
                        <p className="text-gray-400 text-sm">{order.customer_email}</p>
                      </div>

                      {/* Producto */}
                      <div>
                        <p className="text-xs text-gray-400">Producto</p>
                        <p className="text-white font-medium">{order.product_name}</p>
                        <p className="text-green-400 font-bold">{formatCurrency(order.amount, order.currency)}</p>
                      </div>

                      {/* Estado */}
                      <div>
                        <p className="text-xs text-gray-400">Estado</p>
                        {getStatusBadge(order.status, order.admin_status)}
                        {order.admin_notes && <p className="text-xs text-gray-400 mt-1">Con notas</p>}
                      </div>

                      {/* Fecha */}
                      <div>
                        <p className="text-xs text-gray-400">Fecha</p>
                        <p className="text-white text-sm">{formatDate(order.created_at)}</p>
                      </div>

                      {/* Descarga */}
                      <div>
                        <p className="text-xs text-gray-400">Descarga</p>
                        {order.download_tokens && order.download_tokens.length > 0 ? (
                          <div>
                            <p className="text-green-400 text-sm">
                              {order.download_tokens[0].downloads_count}/{order.download_tokens[0].max_downloads}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.download_tokens[0].expires_at) > new Date() ? "Activo" : "Expirado"}
                            </p>
                          </div>
                        ) : (
                          <p className="text-red-400 text-sm">Sin token</p>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">Detalles del Pedido</DialogTitle>
                              <DialogDescription className="text-gray-400">ID: {selectedOrder?.id}</DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <OrderDetailsModal
                                order={selectedOrder}
                                onAction={handleOrderAction}
                                actionLoading={actionLoading}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOrderAction(order.id, "resend_confirmation")}
                          disabled={actionLoading === `${order.id}-resend_confirmation`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/api/invoices/${order.id}/download`, "_blank")}
                          className="text-green-400 hover:text-green-300"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-gray-400 text-sm">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} pedidos
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Anterior
                </Button>
                <span className="text-white px-3 py-1 bg-gray-700 rounded">{pagination.page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para el modal de detalles del pedido
function OrderDetailsModal({
  order,
  onAction,
  actionLoading,
}: {
  order: Order
  onAction: (orderId: string, action: string, data?: any) => void
  actionLoading: string | null
}) {
  const [customMessage, setCustomMessage] = useState("")
  const [newNote, setNewNote] = useState("")
  const [newStatus, setNewStatus] = useState(order.admin_status || order.status)

  return (
    <div className="space-y-6">
      {/* Información del Cliente */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-white font-medium mb-2">Información del Cliente</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="text-gray-400">Nombre:</span> {order.customer_name}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Email:</span> {order.customer_email}
            </p>
            {order.customer_phone && (
              <p className="text-gray-300">
                <span className="text-gray-400">Teléfono:</span> {order.customer_phone}
              </p>
            )}
            {order.customer_company && (
              <p className="text-gray-300">
                <span className="text-gray-400">Empresa:</span> {order.customer_company}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-white font-medium mb-2">Información del Pedido</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="text-gray-400">Producto:</span> {order.product_name}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Importe:</span>{" "}
              {new Intl.NumberFormat("es-ES", { style: "currency", currency: order.currency.toUpperCase() }).format(
                order.amount / 100,
              )}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Estado:</span> {order.status}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Fecha:</span> {new Date(order.created_at).toLocaleString("es-ES")}
            </p>
          </div>
        </div>
      </div>

      {/* Token de Descarga */}
      {order.download_tokens && order.download_tokens.length > 0 && (
        <div>
          <h3 className="text-white font-medium mb-2">Token de Descarga</h3>
          <div className="bg-gray-700 p-3 rounded text-sm">
            <p className="text-gray-300">
              Descargas: {order.download_tokens[0].downloads_count}/{order.download_tokens[0].max_downloads}
            </p>
            <p className="text-gray-300">
              Expira: {new Date(order.download_tokens[0].expires_at).toLocaleString("es-ES")}
            </p>
            <p className="text-gray-300 font-mono break-all">Token: {order.download_tokens[0].token}</p>
          </div>
        </div>
      )}

      {/* Notas Administrativas */}
      {order.admin_notes && (
        <div>
          <h3 className="text-white font-medium mb-2">Notas Administrativas</h3>
          <div className="bg-gray-700 p-3 rounded text-sm">
            <pre className="text-gray-300 whitespace-pre-wrap">{order.admin_notes}</pre>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="space-y-4">
        <h3 className="text-white font-medium">Acciones</h3>

        {/* Actualizar Estado */}
        <div className="flex items-center gap-2">
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="succeeded">Completado</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="processing">Procesando</SelectItem>
              <SelectItem value="failed">Fallido</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
              <SelectItem value="refunded">Reembolsado</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => onAction(order.id, "update_status", { status: newStatus })}
            disabled={actionLoading === `${order.id}-update_status`}
            size="sm"
          >
            Actualizar
          </Button>
        </div>

        {/* Añadir Nota */}
        <div className="space-y-2">
          <Textarea
            placeholder="Añadir nota administrativa..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
          <Button
            onClick={() => {
              onAction(order.id, "add_note", { note: newNote })
              setNewNote("")
            }}
            disabled={!newNote.trim() || actionLoading === `${order.id}-add_note`}
            size="sm"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Añadir Nota
          </Button>
        </div>

        {/* Email Personalizado */}
        <div className="space-y-2">
          <Textarea
            placeholder="Mensaje personalizado para el cliente..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
          <Button
            onClick={() => {
              onAction(order.id, "send_support_email", { message: customMessage })
              setCustomMessage("")
            }}
            disabled={!customMessage.trim() || actionLoading === `${order.id}-send_support_email`}
            size="sm"
            variant="outline"
          >
            <Mail className="w-4 h-4 mr-2" />
            Enviar Email
          </Button>
        </div>

        {/* Botones de Acción Rápida */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onAction(order.id, "resend_confirmation")}
            disabled={actionLoading === `${order.id}-resend_confirmation`}
            size="sm"
            variant="outline"
          >
            <Mail className="w-4 h-4 mr-2" />
            Reenviar Confirmación
          </Button>

          <Button
            onClick={() => onAction(order.id, "generate_new_token")}
            disabled={actionLoading === `${order.id}-generate_new_token`}
            size="sm"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Nuevo Token
          </Button>

          <Button
            onClick={() => window.open(`/api/invoices/${order.id}/download`, "_blank")}
            size="sm"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Factura
          </Button>
        </div>
      </div>
    </div>
  )
}
