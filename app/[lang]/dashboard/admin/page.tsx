"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Users,
  TrendingUp,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  CreditCard,
} from "lucide-react"

export default function AdminDashboard() {
  const kpis = [
    {
      title: "Ingresos Totales",
      value: "€45,231",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Clientes Activos",
      value: "23",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Conversiones",
      value: "12.5%",
      change: "+2.4%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      title: "Satisfacción",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "text-yellow-500",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "payment",
      title: "Pago recibido de TechCorp S.L.",
      amount: "€3,500",
      time: "Hace 2 horas",
      status: "completed",
    },
    {
      id: 2,
      type: "project",
      title: "Nuevo proyecto: E-commerce Platform",
      client: "StartupXYZ",
      time: "Hace 4 horas",
      status: "new",
    },
    {
      id: 3,
      type: "client",
      title: "Nuevo cliente registrado",
      client: "InnovaCorp",
      time: "Hace 6 horas",
      status: "new",
    },
    {
      id: 4,
      type: "contract",
      title: "Contrato firmado digitalmente",
      client: "MegaRetail S.A.",
      time: "Hace 1 día",
      status: "signed",
    },
  ]

  const monthlyGoals = [
    { name: "Ingresos", current: 45231, target: 50000, percentage: 90 },
    { name: "Nuevos Clientes", current: 8, target: 10, percentage: 80 },
    { name: "Proyectos Completados", current: 12, target: 15, percentage: 80 },
    { name: "Satisfacción Cliente", current: 4.8, target: 5.0, percentage: 96 },
  ]

  const activeProjects = [
    {
      id: 1,
      name: "E-commerce Platform",
      client: "TechCorp S.L.",
      progress: 75,
      budget: "€15,000",
      deadline: "2024-02-15",
      status: "En desarrollo",
    },
    {
      id: 2,
      name: "Corporate Website",
      client: "StartupXYZ",
      progress: 45,
      budget: "€8,500",
      deadline: "2024-02-28",
      status: "Diseño",
    },
    {
      id: 3,
      name: "Mobile App",
      client: "InnovaCorp",
      progress: 20,
      budget: "€25,000",
      deadline: "2024-03-15",
      status: "Planificación",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Centro de Operaciones</h1>
        <p className="text-gray-300">Resumen completo de tu negocio y operaciones</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          let cardClassName =
            "bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300"
          if (kpi.title === "Ingresos Totales") {
            cardClassName =
              "bg-gradient-to-br from-green-900/30 to-gray-900/50 border-green-700/30 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300"
          } else if (kpi.title === "Clientes Activos") {
            cardClassName =
              "bg-gradient-to-br from-blue-900/30 to-gray-900/50 border-blue-700/30 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300"
          } else if (kpi.title === "Conversiones") {
            cardClassName =
              "bg-gradient-to-br from-purple-900/30 to-gray-900/50 border-purple-700/30 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300"
          } else if (kpi.title === "Satisfacción") {
            cardClassName =
              "bg-gradient-to-br from-yellow-900/30 to-gray-900/50 border-yellow-700/30 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300"
          }
          return (
            <Card key={kpi.title} className={cardClassName}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{kpi.title}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpi.value}</div>
                <div className="flex items-center text-xs text-gray-400">
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={kpi.trend === "up" ? "text-green-500" : "text-red-500"}>{kpi.change}</span>
                  <span className="ml-1">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Actividad Reciente</CardTitle>
            <CardDescription className="text-gray-300">Últimas acciones importantes en tu negocio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === "payment" && <CreditCard className="h-5 w-5 text-green-500" />}
                    {activity.type === "project" && <FileText className="h-5 w-5 text-blue-500" />}
                    {activity.type === "client" && <Users className="h-5 w-5 text-purple-500" />}
                    {activity.type === "contract" && <CheckCircle className="h-5 w-5 text-yellow-500" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && <p className="text-green-500 font-semibold text-sm">{activity.amount}</p>}
                  {activity.client && <p className="text-gray-400 text-xs">{activity.client}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Goals */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Objetivos del Mes</CardTitle>
            <CardDescription className="text-gray-300">Progreso hacia tus metas mensuales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyGoals.map((goal) => (
              <div key={goal.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{goal.name}</span>
                  <span className="text-gray-400">
                    {typeof goal.current === "number" && goal.current < 100
                      ? goal.current
                      : goal.current.toLocaleString()}{" "}
                    /{" "}
                    {typeof goal.target === "number" && goal.target < 100 ? goal.target : goal.target.toLocaleString()}
                  </span>
                </div>
                <Progress value={goal.percentage} className="h-2" />
                <div className="text-right">
                  <span className="text-xs text-gray-400">{goal.percentage}% completado</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Proyectos Activos</CardTitle>
              <CardDescription className="text-gray-300">
                Estado actual de todos los proyectos en desarrollo
              </CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 shadow-lg shadow-purple-500/25">
              Ver Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{project.name}</h3>
                    <p className="text-gray-400 text-sm">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {project.status}
                    </Badge>
                    <p className="text-gray-400 text-sm mt-1">{project.budget}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Progreso</span>
                    <span className="text-gray-400">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Entrega: {project.deadline}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {project.progress < 50 ? "En tiempo" : project.progress < 80 ? "Atención" : "Crítico"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-lg">Ingresos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500 mb-2">€12,450</div>
            <p className="text-gray-400 text-sm">+18% vs mes anterior</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Meta mensual</span>
                <span className="text-gray-300">€15,000</span>
              </div>
              <Progress value={83} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-lg">Facturas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500 mb-2">€8,750</div>
            <p className="text-gray-400 text-sm">5 facturas por cobrar</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vencidas</span>
                <span className="text-red-400">€2,100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Por vencer</span>
                <span className="text-yellow-400">€6,650</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-lg">Alertas Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-400 text-sm">2 pagos vencidos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-400 text-sm">3 proyectos cerca del deadline</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-400 text-sm">5 tareas completadas hoy</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
