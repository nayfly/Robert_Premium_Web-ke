"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  MessageSquare,
  Briefcase,
  TrendingUp,
  FileText,
} from "lucide-react"

export default function EmpleadoDashboard() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
    // Simular carga de datos del empleado
    setTimeout(() => {
      setTasks([
        { id: 1, title: "Revisar propuesta TechFlow", priority: "high", dueDate: "2024-01-08", status: "pending" },
        { id: 2, title: "Implementar módulo IA", priority: "medium", dueDate: "2024-01-10", status: "in_progress" },
        { id: 3, title: "Documentar API endpoints", priority: "low", dueDate: "2024-01-12", status: "pending" },
        { id: 4, title: "Testing automatización", priority: "high", dueDate: "2024-01-09", status: "completed" },
      ])

      setProjects([
        { name: "Automatización TechFlow", client: "TechFlow Solutions", progress: 85, myRole: "Lead Developer" },
        { name: "IA Legal Pro", client: "LegalTech Pro", progress: 60, myRole: "IA Specialist" },
        { name: "Dashboard Analytics", client: "StartupX", progress: 30, myRole: "Frontend Developer" },
      ])
    }, 1000)
  }, [])

  const stats = {
    tasksCompleted: tasks.filter((t) => t.status === "completed").length,
    tasksInProgress: tasks.filter((t) => t.status === "in_progress").length,
    tasksPending: tasks.filter((t) => t.status === "pending").length,
    projectsActive: projects.length,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-400" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Panel de Empleado</h1>
          <p className="text-gray-400">Gestiona tus tareas y proyectos asignados</p>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Briefcase className="w-4 h-4 mr-2" />
          Empleado
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Tareas Completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.tasksCompleted}</div>
              <p className="text-xs text-green-400">Esta semana</p>
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
              <CardTitle className="text-sm font-medium text-gray-400">En Progreso</CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.tasksInProgress}</div>
              <p className="text-xs text-blue-400">Tareas activas</p>
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
              <CardTitle className="text-sm font-medium text-gray-400">Pendientes</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.tasksPending}</div>
              <p className="text-xs text-yellow-400">Por iniciar</p>
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
              <CardTitle className="text-sm font-medium text-gray-400">Proyectos Activos</CardTitle>
              <FolderOpen className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.projectsActive}</div>
              <p className="text-xs text-purple-400">Asignados</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Mis Tareas
            </CardTitle>
            <CardDescription className="text-gray-400">Tareas asignadas y su estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <p className="text-white font-medium">{task.title}</p>
                      <p className="text-gray-400 text-sm">Vence: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Ver Todas las Tareas</Button>
          </CardContent>
        </Card>

        {/* My Projects */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Mis Proyectos
            </CardTitle>
            <CardDescription className="text-gray-400">Proyectos en los que estoy trabajando</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="space-y-3 p-3 rounded-lg bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{project.name}</p>
                      <p className="text-gray-400 text-sm">{project.client}</p>
                      <p className="text-blue-400 text-xs">{project.myRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progress} className="flex-1" />
                    <span className="text-sm text-gray-400">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">Ver Todos los Proyectos</Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Acciones Rápidas</CardTitle>
          <CardDescription className="text-gray-400">Herramientas y funciones frecuentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="bg-green-600 hover:bg-green-700">
              <Calendar className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Mensajes
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <FileText className="w-4 h-4 mr-2" />
              Reportes
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Mi Rendimiento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
