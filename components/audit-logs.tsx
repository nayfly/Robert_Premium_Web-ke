"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Search, Filter, Calendar, User, Activity } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface AuditLog {
  id: string
  user_id: string
  action: string
  table_name: string | null
  record_id: string | null
  old_values: any | null
  new_values: any | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  users?: {
    name: string | null
    email: string
  }
}

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [tableFilter, setTableFilter] = useState("all")
  const { userProfile } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (userProfile?.role === "admin") {
      fetchAuditLogs()
    }
  }, [userProfile])

  useEffect(() => {
    filterLogs()
  }, [logs, searchTerm, actionFilter, tableFilter])

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select(`
          *,
          users (
            name,
            email
          )
        `)
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) {
        console.error("Error fetching audit logs:", error)
        return
      }

      setLogs(data || [])
    } catch (error) {
      console.error("Error fetching audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterLogs = () => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.users?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.table_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action.toLowerCase().includes(actionFilter))
    }

    if (tableFilter !== "all") {
      filtered = filtered.filter((log) => log.table_name === tableFilter)
    }

    setFilteredLogs(filtered)
  }

  const getActionColor = (action: string) => {
    if (action.includes("CREATE") || action.includes("INSERT")) {
      return "bg-green-500/20 text-green-400 border-green-500/30"
    }
    if (action.includes("UPDATE") || action.includes("MODIFY")) {
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
    if (action.includes("DELETE") || action.includes("REMOVE")) {
      return "bg-red-500/20 text-red-400 border-red-500/30"
    }
    if (action.includes("LOGIN") || action.includes("AUTH")) {
      return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }
    return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }

  const getActionIcon = (action: string) => {
    if (action.includes("LOGIN") || action.includes("AUTH")) {
      return "🔐"
    }
    if (action.includes("CREATE") || action.includes("INSERT")) {
      return "➕"
    }
    if (action.includes("UPDATE") || action.includes("MODIFY")) {
      return "✏️"
    }
    if (action.includes("DELETE") || action.includes("REMOVE")) {
      return "🗑️"
    }
    return "📝"
  }

  const uniqueActions = [...new Set(logs.map((log) => log.action.split("_")[0].toLowerCase()))]
  const uniqueTables = [...new Set(logs.map((log) => log.table_name).filter(Boolean))]

  if (userProfile?.role !== "admin") {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No tienes permisos para ver los logs de auditoría</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Logs de Auditoría
        </CardTitle>
        <CardDescription className="text-gray-400">Registro completo de todas las acciones del sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-gray-300">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Usuario, acción, tabla..."
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-300">Acción</Label>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">Todas las acciones</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-300">Tabla</Label>
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">Todas las tablas</SelectItem>
                {uniqueTables.map((table) => (
                  <SelectItem key={table} value={table!}>
                    {table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm("")
                setActionFilter("all")
                setTableFilter("all")
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </div>

        {/* Lista de logs */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Cargando logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No se encontraron logs con los filtros aplicados</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-lg">{getActionIcon(log.action)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                          {log.table_name && (
                            <Badge variant="outline" className="border-gray-500 text-gray-300">
                              {log.table_name}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <User className="w-4 h-4" />
                            <span>{log.users?.name || log.users?.email || "Usuario desconocido"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDistanceToNow(new Date(log.created_at), {
                                addSuffix: true,
                                locale: es,
                              })}
                            </span>
                          </div>
                        </div>
                        {log.ip_address && <p className="text-xs text-gray-500 mt-1">IP: {log.ip_address}</p>}
                        {(log.old_values || log.new_values) && (
                          <details className="mt-2">
                            <summary className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">
                              Ver detalles de cambios
                            </summary>
                            <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                              {log.old_values && (
                                <div className="mb-2">
                                  <span className="text-red-400">Valores anteriores:</span>
                                  <pre className="text-gray-300 mt-1 overflow-x-auto">
                                    {JSON.stringify(log.old_values, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.new_values && (
                                <div>
                                  <span className="text-green-400">Valores nuevos:</span>
                                  <pre className="text-gray-300 mt-1 overflow-x-auto">
                                    {JSON.stringify(log.new_values, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Información adicional */}
        <div className="text-center text-xs text-gray-500">
          Mostrando {filteredLogs.length} de {logs.length} logs totales
        </div>
      </CardContent>
    </Card>
  )
}
