"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Search,
  MoreHorizontal,
  UserPlus,
  Shield,
  Briefcase,
  CheckCircle,
  XCircle,
  Edit,
  User,
} from "lucide-react"

interface Usuario {
  id: string
  name: string
  email: string
  role: "admin" | "empleado" | "cliente"
  status: "active" | "inactive"
  company?: string
  joinDate: string
  lastActive: string
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<Usuario[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    // Simular carga de usuarios
    const mockUsers: Usuario[] = [
      {
        id: "1",
        name: "Robert Admin",
        email: "admin@robertsoftware.com",
        role: "admin",
        status: "active",
        joinDate: "2024-01-15",
        lastActive: "2024-01-07",
      },
      {
        id: "2",
        name: "Juan Empleado",
        email: "empleado@robertsoftware.com",
        role: "empleado",
        status: "active",
        joinDate: "2024-02-01",
        lastActive: "2024-01-07",
      },
      {
        id: "3",
        name: "María García",
        email: "maria@techflow.com",
        role: "cliente",
        status: "active",
        company: "TechFlow Solutions",
        joinDate: "2024-03-10",
        lastActive: "2024-01-06",
      },
      {
        id: "4",
        name: "Carlos López",
        email: "carlos@financecore.com",
        role: "cliente",
        status: "active",
        company: "FinanceCore",
        joinDate: "2024-03-15",
        lastActive: "2024-01-05",
      },
      {
        id: "5",
        name: "Ana Martín",
        email: "ana@legaltech.com",
        role: "cliente",
        status: "inactive",
        company: "LegalTech Pro",
        joinDate: "2024-04-01",
        lastActive: "2024-01-01",
      },
    ]
    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
  }, [])

  useEffect(() => {
    let filtered = users

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.company?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por rol
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const getRoleConfig = (role: string) => {
    const configs = {
      admin: { color: "bg-red-500", textColor: "text-red-400", icon: Shield, label: "Admin" },
      empleado: { color: "bg-blue-500", textColor: "text-blue-400", icon: Briefcase, label: "Empleado" },
      cliente: { color: "bg-purple-500", textColor: "text-purple-400", icon: User, label: "Cliente" },
    }
    return configs[role as keyof typeof configs] || configs.cliente
  }

  const handleRoleChange = (userId: string, newRole: "admin" | "empleado" | "cliente") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
  }

  const handleStatusToggle = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
          <p className="text-gray-400">Administra usuarios, roles y permisos del sistema</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{users.length}</p>
                <p className="text-sm text-gray-400">Total Usuarios</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{users.filter((u) => u.status === "active").length}</p>
                <p className="text-sm text-gray-400">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-white">{users.filter((u) => u.role === "admin").length}</p>
                <p className="text-sm text-gray-400">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">{users.filter((u) => u.role === "cliente").length}</p>
                <p className="text-sm text-gray-400">Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="empleado">Empleado</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Usuarios</CardTitle>
          <CardDescription className="text-gray-400">{filteredUsers.length} usuarios encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user, index) => {
              const roleConfig = getRoleConfig(user.role)
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 border border-gray-600"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                      <AvatarFallback className={`${roleConfig.color} text-white`}>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{user.name}</h3>
                        <Badge variant="outline" className={`${roleConfig.textColor} border-current`}>
                          <roleConfig.icon className="w-3 h-3 mr-1" />
                          {roleConfig.label}
                        </Badge>
                        <Badge
                          variant={user.status === "active" ? "default" : "secondary"}
                          className={user.status === "active" ? "bg-green-600" : "bg-gray-600"}
                        >
                          {user.status === "active" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {user.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      {user.company && <p className="text-gray-500 text-xs">{user.company}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <p className="text-gray-400">Último acceso</p>
                      <p className="text-gray-300">{new Date(user.lastActive).toLocaleDateString()}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin")}>
                          <Shield className="w-4 h-4 mr-2" />
                          Hacer Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "empleado")}>
                          <Briefcase className="w-4 h-4 mr-2" />
                          Hacer Empleado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, "cliente")}>
                          <User className="w-4 h-4 mr-2" />
                          Hacer Cliente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusToggle(user.id)}>
                          {user.status === "active" ? (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
