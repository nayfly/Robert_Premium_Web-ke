"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, FolderOpen, TrendingUp, Clock, DollarSign, Activity, Shield, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    totalRevenue: 0,
    pendingTasks: 0,
  })

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        totalUsers: 47,
        activeProjects: 12,
        totalRevenue: 285000,
        pendingTasks: 8,
      })
    }, 1000)
  }, [])

  const recentActivity = [
    { id: 1, type: "user", message: "Nuevo cliente registrado: María García", time: "2 min", status: "success" },
    { id: 2, type: "project", message: 'Proyecto "IA Ventas" completado', time: "15 min", status: "success" },
    { id: 3, type: "alert", message: "Servidor de backup requiere atención", time: "1 hora", status: "warning" },
    { id: 4, type: "revenue", message: "Pago recibido: €15,000", time: "2 horas", status: "success" },
  ]

  const projects = [
    {
      name: "Automatización TechFlow",
      client: "TechFlow Solutions",
      progress: 85,
      status: "En progreso",
      budget: 45000,
    },
    { name: "Auditoría FinanceCore", client: "FinanceCore", progress: 100, status: "Completado", budget: 12000 },
    { name: "IA Legal Pro", client: "LegalTech Pro", progress: 60, status: "En progreso", budget: 18000 },
    { name: "Ciberseguridad StartupX", client: "StartupX", progress: 30, status: "Iniciado", budget: 8000 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
          <p className="text-gray-400">Vista general del sistema y métricas clave</p>
        </div>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <Shield className="w-4 h-4 mr-2" />
          Administrador
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-xs text-green-400">+12% desde el mes pasado</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Proyectos Activos</CardTitle>
              <FolderOpen className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeProjects}</div>
              <p className="text-xs text-green-400">+3 nuevos esta semana</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">€{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-400">+18% este trimestre</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Tareas Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingTasks}</div>
              <p className="text-xs text-yellow-400">Requieren atención</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription className="text-gray-400">Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "success"
                        ? "bg-green-400"
                        : activity.status === "warning"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Overview */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Proyectos en Curso
            </CardTitle>
            <CardDescription className="text-gray-400">Estado actual de los proyectos activos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{project.name}</p>
                      <p className="text-gray-400 text-sm">{project.client}</p>
                    </div>
                    <Badge variant={project.status === "Completado" ? "default" : "secondary"}>{project.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progress} className="flex-1" />
                    <span className="text-sm text-gray-400">{project.progress}%</span>
                  </div>
                  <p className="text-sm text-green-400">€{project.budget.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Acciones Rápidas</CardTitle>
          <CardDescription className="text-gray-400">Tareas administrativas frecuentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="w-4 h-4 mr-2" />
              Gestionar Usuarios
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <FolderOpen className="w-4 h-4 mr-2" />
              Crear Proyecto
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Reportes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
