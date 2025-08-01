"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  CheckSquare,
  Clock,
  Play,
  Pause,
  Square,
  Calendar,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Timer,
  FolderOpen,
} from "lucide-react"

export default function EmpleadoDashboard() {
  const [activeTimer, setActiveTimer] = useState<number | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)

  const tasks = [
    {
      id: 1,
      title: "Implementar sistema de autenticación",
      project: "E-commerce Platform",
      priority: "alta",
      status: "en_progreso",
      timeSpent: "2h 30m",
      deadline: "2024-01-20",
    },
    {
      id: 2,
      title: "Diseñar interfaz de usuario",
      project: "Corporate Website",
      priority: "media",
      status: "pendiente",
      timeSpent: "0h",
      deadline: "2024-01-22",
    },
    {
      id: 3,
      title: "Optimizar base de datos",
      project: "Mobile App",
      priority: "baja",
      status: "completada",
      timeSpent: "4h 15m",
      deadline: "2024-01-18",
    },
    {
      id: 4,
      title: "Testing de funcionalidades",
      project: "E-commerce Platform",
      priority: "alta",
      status: "bloqueada",
      timeSpent: "1h 45m",
      deadline: "2024-01-25",
    },
  ]

  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      client: "TechCorp S.L.",
      progress: 75,
      myTasks: 8,
      completedTasks: 6,
      deadline: "2024-02-15",
    },
    {
      id: 2,
      name: "Corporate Website",
      client: "StartupXYZ",
      progress: 45,
      myTasks: 5,
      completedTasks: 2,
      deadline: "2024-02-28",
    },
    {
      id: 3,
      name: "Mobile App",
      client: "InnovaCorp",
      progress: 20,
      myTasks: 12,
      completedTasks: 2,
      deadline: "2024-03-15",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-500"
      case "media":
        return "bg-yellow-500"
      case "baja":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completada":
        return "text-green-500"
      case "en_progreso":
        return "text-blue-500"
      case "pendiente":
        return "text-gray-400"
      case "bloqueada":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completada":
        return CheckCircle
      case "en_progreso":
        return Clock
      case "pendiente":
        return Square
      case "bloqueada":
        return AlertCircle
      default:
        return Square
    }
  }

  const startTimer = (taskId: number) => {
    setActiveTimer(taskId)
    // Aquí implementarías la lógica del timer
  }

  const stopTimer = () => {
    setActiveTimer(null)
    setTimerSeconds(0)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mi Zona de Trabajo</h1>
        <p className="text-gray-400">Gestiona tus tareas y proyectos asignados</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Tareas Pendientes</CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{tasks.filter((t) => t.status === "pendiente").length}</div>
            <p className="text-xs text-gray-400">
              {tasks.filter((t) => t.status === "en_progreso").length} en progreso
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Completadas Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-gray-400">+2 vs ayer</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Tiempo Hoy</CardTitle>
            <Timer className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">6h 45m</div>
            <p className="text-xs text-gray-400">Meta: 8h</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Proyectos Activos</CardTitle>
            <FolderOpen className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{projects.length}</div>
            <p className="text-xs text-gray-400">25 tareas totales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Mis Tareas</CardTitle>
            <CardDescription className="text-gray-400">Tareas asignadas y su estado actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task) => {
              const StatusIcon = getStatusIcon(task.status)
              return (
                <div
                  key={task.id}
                  className="p-4 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:bg-gray-800/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                        <h3 className="text-white font-medium text-sm">{task.title}</h3>
                      </div>
                      <p className="text-gray-400 text-xs">{task.project}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>⏱️ {task.timeSpent}</span>
                        <span>📅 {task.deadline}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`h-4 w-4 ${getStatusColor(task.status)}`} />
                      {task.status !== "completada" && task.status !== "bloqueada" && (
                        <div className="flex space-x-1">
                          {activeTimer === task.id ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={stopTimer}
                              className="h-6 w-6 p-0 border-gray-600 bg-transparent"
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startTimer(task.id)}
                              className="h-6 w-6 p-0 border-gray-600"
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {activeTimer === task.id && (
                    <div className="mt-2 p-2 bg-blue-900/20 backdrop-blur-sm rounded border border-blue-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 text-sm">Timer activo</span>
                        <span className="text-blue-300 font-mono text-sm">{formatTime(timerSeconds)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* My Projects */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Mis Proyectos</CardTitle>
            <CardDescription className="text-gray-400">Proyectos asignados y progreso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{project.name}</h3>
                    <p className="text-gray-400 text-sm">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-sm">
                      {project.completedTasks}/{project.myTasks} tareas
                    </p>
                    <p className="text-gray-400 text-xs">{project.deadline}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Progreso General</span>
                    <span className="text-gray-400">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Mis Tareas</span>
                    <span className="text-gray-400">
                      {Math.round((project.completedTasks / project.myTasks) * 100)}%
                    </span>
                  </div>
                  <Progress value={(project.completedTasks / project.myTasks) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Calendario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-4">Próximas reuniones y deadlines</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Reunión de proyecto</span>
                <span className="text-gray-400">14:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Entrega milestone</span>
                <span className="text-gray-400">Mañana</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 border-gray-700 text-gray-300 bg-transparent">
              Ver Calendario
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Archivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-4">Documentos y recursos del proyecto</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Especificaciones.pdf</span>
                <span className="text-gray-400">2.1 MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Mockups.fig</span>
                <span className="text-gray-400">5.8 MB</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 border-gray-700 text-gray-300 bg-transparent">
              Ver Archivos
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Mensajes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-4">Comunicación con el equipo</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">3 mensajes nuevos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">Feedback aprobado</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 border-gray-700 text-gray-300 bg-transparent">
              Ver Mensajes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
