"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  DollarSign,
  FolderOpen,
  MessageSquare,
  User,
  FileText,
  BarChart3,
  Calendar,
  Target,
} from "lucide-react"

export default function ClienteDashboard() {
  const [projects, setProjects] = useState([])
  const [metrics, setMetrics] = useState({})

  useEffect(() => {
    // Simular carga de datos del cliente
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          name: "Automatización de Ventas IA",
          status: "En progreso",
          progress: 85,
          budget: 45000,
          roi: 280,
          startDate: "2024-01-15",
          expectedCompletion: "2024-02-15",
          assignedTeam: ["Juan Empleado", "Ana Desarrolladora"],
        },
        {
          id: 2,
          name: "Auditoría de Ciberseguridad",
          status: "Completado",
          progress: 100,
          budget: 12000,
          roi: 650,
          startDate: "2023-12-01",
          expectedCompletion: "2023-12-30",
          assignedTeam: ["Carlos Security", "María Auditora"],
        },
      ])

      setMetrics({
        totalInvestment: 57000,
        totalROI: 465,
        avgROI: 465,
        monthlySavings: 8500,
        projectsCompleted: 1,
        projectsActive: 1,
      })
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "En progreso":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Pendiente":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const recentUpdates = [
    {
      id: 1,
      message: "Módulo de IA implementado y funcionando",
      project: "Automatización de Ventas IA",
      time: "2 horas",
      type: "success",
    },
    {
      id: 2,
      message: "Informe de progreso semanal disponible",
      project: "Automatización de Ventas IA",
      time: "1 día",
      type: "info",
    },
    { id: 3, message: "ROI actualizado: +15% este mes", project: "General", time: "2 días", type: "success" },
    {
      id: 4,
      message: "Reunión de seguimiento programada",
      project: "Automatización de Ventas IA",
      time: "3 días",
      type: "info",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mi Panel de Cliente</h1>
          <p className="text-gray-400">Seguimiento de proyectos, ROI y métricas de negocio</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
          <User className="w-4 h-4 mr-2" />
          Cliente Premium
        </Badge>
      </div>

      {/* ROI & Investment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">ROI Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.totalROI}%</div>
              <p className="text-xs text-green-400">+{metrics.avgROI}% promedio</p>
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
              <CardTitle className="text-sm font-medium text-gray-400">Inversión Total</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">€{metrics.totalInvestment?.toLocaleString()}</div>
              <p className="text-xs text-blue-400">En proyectos activos</p>
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
              <CardTitle className="text-sm font-medium text-gray-400">Ahorro Mensual</CardTitle>
              <Target className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">€{metrics.monthlySavings?.toLocaleString()}</div>
              <p className="text-xs text-purple-400">Costes reducidos</p>
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
              <CardTitle className="text-sm font-medium text-gray-400">Proyectos</CardTitle>
              <FolderOpen className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.projectsActive + metrics.projectsCompleted}</div>
              <p className="text-xs text-orange-400">{metrics.projectsActive} activos</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Projects */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Mis Proyectos
            </CardTitle>
            <CardDescription className="text-gray-400">Estado actual de tus proyectos e inversiones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="space-y-3 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{project.name}</h3>
                      <p className="text-gray-400 text-sm">Equipo: {project.assignedTeam.join(", ")}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Inversión</p>
                      <p className="text-white font-medium">€{project.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">ROI Actual</p>
                      <p className="text-green-400 font-medium">+{project.roi}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progreso</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Inicio: {new Date(project.startDate).toLocaleDateString()}</span>
                    <span>Finalización: {new Date(project.expectedCompletion).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Actualizaciones Recientes
            </CardTitle>
            <CardDescription className="text-gray-400">Últimas novedades de tus proyectos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-700/50">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      update.type === "success"
                        ? "bg-green-400"
                        : update.type === "info"
                          ? "bg-blue-400"
                          : "bg-yellow-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm">{update.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-gray-400 text-xs">{update.project}</p>
                      <p className="text-gray-500 text-xs">{update.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">Ver Todas las Actualizaciones</Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Acciones Rápidas</CardTitle>
          <CardDescription className="text-gray-400">Herramientas y recursos para clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="bg-green-600 hover:bg-green-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Ver Métricas ROI
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contactar Equipo
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <FileText className="w-4 h-4 mr-2" />
              Descargar Reportes
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Reunión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
