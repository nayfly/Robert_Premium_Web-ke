"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Mail,
  Building,
  User,
  Calendar,
  AlertTriangle,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
} from "lucide-react"

interface UserRequest {
  id: string
  name: string
  email: string
  phone?: string
  company: string
  position?: string
  access_type: "cliente" | "empleado"
  message?: string
  status: "pending" | "approved" | "rejected"
  activation_token?: string
  token_expires_at?: string
  reviewed_by?: string
  reviewed_at?: string
  approved_at?: string
  rejection_reason?: string
  ip_address?: string
  user_agent?: string
  created_at: string
  updated_at: string
  reviewed_by_user?: {
    name: string
    email: string
  }
}

interface RequestStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

export default function SolicitudesPage() {
  const [requests, setRequests] = useState<UserRequest[]>([])
  const [stats, setStats] = useState<RequestStats>({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [accessTypeFilter, setAccessTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)

  const { toast } = useToast()

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        status: statusFilter,
        access_type: accessTypeFilter,
        search: searchTerm,
        sortBy,
        sortOrder,
      })

      const response = await fetch(`/api/user-requests?${params}`, {
        headers: {
          Authorization: "Bearer demo-token", // En producción usar JWT real
        },
      })

      if (!response.ok) {
        throw new Error("Error al cargar solicitudes")
      }

      const data = await response.json()
      setRequests(data.requests || [])
      setStats(data.statistics || { total: 0, pending: 0, approved: 0, rejected: 0 })
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [currentPage, statusFilter, accessTypeFilter, searchTerm, sortBy, sortOrder])

  const handleApprove = async (requestId: string) => {
    try {
      setProcessing(requestId)
      const response = await fetch(`/api/user-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer demo-token",
        },
        body: JSON.stringify({ action: "approve" }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al aprobar solicitud")
      }

      const result = await response.json()

      toast({
        title: "✅ Solicitud Aprobada",
        description: `Usuario creado correctamente. Contraseña temporal: ${result.tempPassword}`,
      })

      fetchRequests()
    } catch (error) {
      console.error("Error approving request:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al aprobar solicitud",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Se requiere una razón para rechazar la solicitud",
        variant: "destructive",
      })
      return
    }

    try {
      setProcessing(selectedRequest.id)
      const response = await fetch(`/api/user-requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer demo-token",
        },
        body: JSON.stringify({
          action: "reject",
          rejection_reason: rejectionReason,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al rechazar solicitud")
      }

      toast({
        title: "❌ Solicitud Rechazada",
        description: "El usuario ha sido notificado por email",
      })

      setShowRejectDialog(false)
      setRejectionReason("")
      setSelectedRequest(null)
      fetchRequests()
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al rechazar solicitud",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async () => {
    if (!selectedRequest) return

    try {
      setProcessing(selectedRequest.id)
      const response = await fetch(`/api/user-requests/${selectedRequest.id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer demo-token",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al eliminar solicitud")
      }

      const result = await response.json()

      toast({
        title: "🗑️ Solicitud Eliminada",
        description: result.userDeactivated
          ? "Solicitud eliminada y usuario desactivado"
          : "Solicitud eliminada correctamente",
      })

      setShowDeleteDialog(false)
      setSelectedRequest(null)
      fetchRequests()
    } catch (error) {
      console.error("Error deleting request:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar solicitud",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprobada
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Rechazada
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getAccessTypeBadge = (accessType: string) => {
    return accessType === "cliente" ? (
      <Badge variant="secondary">
        <Building className="w-3 h-3 mr-1" />
        Cliente
      </Badge>
    ) : (
      <Badge variant="secondary">
        <User className="w-3 h-3 mr-1" />
        Empleado
      </Badge>
    )
  }

  const isTokenExpired = (tokenExpiresAt?: string) => {
    if (!tokenExpiresAt) return false
    return new Date(tokenExpiresAt) < new Date()
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

  const exportRequests = async () => {
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        access_type: accessTypeFilter,
        search: searchTerm,
        export: "true",
      })

      const response = await fetch(`/api/user-requests?${params}`, {
        headers: {
          Authorization: "Bearer demo-token",
        },
      })

      if (!response.ok) throw new Error("Error al exportar")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `solicitudes-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "✅ Exportación Completa",
        description: "Las solicitudes se han descargado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar las solicitudes",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Cargando solicitudes...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Solicitudes</h1>
          <p className="text-gray-600 mt-1">Administra las solicitudes de acceso de usuarios</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchRequests} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={exportRequests} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, email o empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="approved">Aprobadas</SelectItem>
                <SelectItem value="rejected">Rechazadas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={accessTypeFilter} onValueChange={setAccessTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipo de acceso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="empleado">Empleado</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-")
                setSortBy(field)
                setSortOrder(order)
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Más recientes</SelectItem>
                <SelectItem value="created_at-asc">Más antiguos</SelectItem>
                <SelectItem value="name-asc">Nombre A-Z</SelectItem>
                <SelectItem value="name-desc">Nombre Z-A</SelectItem>
                <SelectItem value="company-asc">Empresa A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de solicitudes */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes ({requests.length})</CardTitle>
          <CardDescription>
            Página {currentPage} de {totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron solicitudes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{request.name}</h3>
                        {getStatusBadge(request.status)}
                        {getAccessTypeBadge(request.access_type)}
                        {isTokenExpired(request.token_expires_at) && request.status === "pending" && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Token Expirado
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {request.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {request.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(request.created_at)}
                        </div>
                        {request.position && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {request.position}
                          </div>
                        )}
                      </div>

                      {request.message && (
                        <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded italic">"{request.message}"</p>
                      )}

                      {request.rejection_reason && (
                        <Alert>
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Motivo de rechazo:</strong> {request.rejection_reason}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowDetailsDialog(true)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>

                      {request.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            disabled={processing === request.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {processing === request.id ? (
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            Aprobar
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setShowRejectDialog(true)
                            }}
                            disabled={processing === request.id}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rechazar
                          </Button>
                        </>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowDeleteDialog(true)
                        }}
                        disabled={processing === request.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>

              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para rechazar solicitud */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>
              Proporciona una razón para rechazar la solicitud de {selectedRequest?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Explica el motivo del rechazo..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || processing === selectedRequest?.id}
            >
              {processing === selectedRequest?.id ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Rechazar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver detalles */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Solicitud</DialogTitle>
            <DialogDescription>Información completa de la solicitud</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="technical">Técnico</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre</label>
                    <p className="text-sm">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Empresa</label>
                    <p className="text-sm">{selectedRequest.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cargo</label>
                    <p className="text-sm">{selectedRequest.position || "No especificado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Teléfono</label>
                    <p className="text-sm">{selectedRequest.phone || "No especificado"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo de acceso</label>
                    <p className="text-sm">{selectedRequest.access_type === "cliente" ? "Cliente" : "Empleado"}</p>
                  </div>
                </div>

                {selectedRequest.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mensaje</label>
                    <p className="text-sm bg-gray-100 p-3 rounded">{selectedRequest.message}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID de solicitud</label>
                    <p className="text-sm font-mono">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">IP Address</label>
                    <p className="text-sm font-mono">{selectedRequest.ip_address || "No disponible"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Token de activación</label>
                    <p className="text-sm font-mono">
                      {selectedRequest.activation_token ? "***GENERADO***" : "No disponible"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Expira el</label>
                    <p className="text-sm">
                      {selectedRequest.token_expires_at
                        ? formatDate(selectedRequest.token_expires_at)
                        : "No disponible"}
                    </p>
                  </div>
                </div>

                {selectedRequest.user_agent && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">User Agent</label>
                    <p className="text-xs bg-gray-100 p-3 rounded font-mono break-all">{selectedRequest.user_agent}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">
                      <strong>Creada:</strong> {formatDate(selectedRequest.created_at)}
                    </span>
                  </div>

                  {selectedRequest.reviewed_at && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      <span className="text-sm">
                        <strong>Revisada:</strong> {formatDate(selectedRequest.reviewed_at)}
                        {selectedRequest.reviewed_by_user && (
                          <span className="text-gray-600"> por {selectedRequest.reviewed_by_user.name}</span>
                        )}
                      </span>
                    </div>
                  )}

                  {selectedRequest.approved_at && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm">
                        <strong>Aprobada:</strong> {formatDate(selectedRequest.approved_at)}
                      </span>
                    </div>
                  )}

                  {selectedRequest.rejection_reason && (
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <div className="text-sm">
                        <strong>Rechazada:</strong>
                        <p className="text-gray-600 mt-1">{selectedRequest.rejection_reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Solicitud</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar la solicitud de {selectedRequest?.name}?
              {selectedRequest?.status === "approved" && (
                <span className="block mt-2 text-red-600 font-medium">
                  ⚠️ Esta solicitud fue aprobada. El usuario asociado será desactivado.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={processing === selectedRequest?.id}>
              {processing === selectedRequest?.id ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
