"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  FolderOpen,
  FileText,
  CreditCard,
  MessageSquare,
  Download,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Star,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react"

export default function ClienteDashboard() {
  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      description: "Plataforma completa de comercio electrónico",
      progress: 75,
      status: "En desarrollo",
      budget: "€15,000",
      startDate: "2024-01-01",
      deadline: "2024-02-15",
      nextMilestone: "Integración de pagos",
      milestoneDate: "2024-01-25",
    },
    {
      id: 2,
      name: "Corporate Website",
      description: "Sitio web corporativo con CMS",
      progress: 45,
      status: "Diseño",
      budget: "€8,500",
      startDate: "2024-01-10",
      deadline: "2024-02-28",
      nextMilestone: "Revisión de diseños",
      milestoneDate: "2024-01-22",
    },
  ]

  const budgets = [
    {
      id: 1,
      title: "Aplicación Móvil iOS/Android",
      description: "App nativa para iOS y Android con backend",
      amount: "€25,000",
      status: "pendiente",
      date: "2024-01-15",
      items: [
        { name: "Desarrollo iOS", price: "€10,000" },
        { name: "Desarrollo Android", price: "€10,000" },
        { name: "Backend API", price: "€3,500" },
        { name: "Diseño UI/UX", price: "€1,500" },
      ],
    },
    {
      id: 2,
      title: "Sistema de Gestión Interna",
      description: "CRM personalizado para gestión de clientes",
      amount: "€18,500",
      status: "aceptado",
      date: "2024-01-10",
      items: [
        { name: "Desarrollo Frontend", price: "€8,000" },
        { name: "Desarrollo Backend", price: "€7,000" },
        { name: "Base de datos", price: "€2,000" },
        { name: "Testing y QA", price: "€1,500" },
      ],
    },
    {
      id: 3,
      title: "Consultoría de Ciberseguridad",
      description: "Auditoría completa de seguridad",
      amount: "€5,500",
      status: "rechazado",
      date: "2024-01-05",
      items: [
        { name: "Auditoría de seguridad", price: "€3,000" },
        { name: "Implementación de mejoras", price: "€2,000" },
        { name: "Documentación", price: "€500" },
      ],
    },
  ]

  const invoices = [
    {
      id: "INV-2024-001",
      project: "E-commerce Platform",
      amount: "€7,500",
      status: "pagada",
      date: "2024-01-15",
      dueDate: "2024-01-30",
    },
    {
      id: "INV-2024-002",
      project: "Corporate Website",
      amount: "€4,250",
      status: "pendiente",
      date: "2024-01-20",
      dueDate: "2024-02-05",
    },
    {
      id: "INV-2024-003",
      project: "E-commerce Platform",
      amount: "€7,500",
      status: "vencida",
      date: "2024-01-01",
      dueDate: "2024-01-15",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aceptado":
      case "pagada":
      case "completado":
        return "bg-green-500"
      case "pendiente":
      case "En desarrollo":
        return "bg-yellow-500"
      case "rechazado":
      case "vencida":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "aceptado":
        return "Aceptado"
      case "pendiente":
        return "Pendiente"
      case "rechazado":
        return "Rechazado"
      case "pagada":
        return "Pagada"
      case "vencida":
        return "Vencida"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mi Panel de Cliente</h1>
        <p className="text-gray-400">Seguimiento de proyectos, presupuestos y facturación</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Proyectos Activos</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{projects.length}</div>
            <p className="text-xs text-gray-400">{projects.filter((p) => p.progress === 100).length} completados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Presupuestos</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {budgets.filter((b) => b.status === "pendiente").length}
            </div>
            <p className="text-xs text-gray-400">Pendientes de revisión</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Facturas</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {invoices.filter((i) => i.status === "pendiente").length}
            </div>
            <p className="text-xs text-gray-400">Por pagar</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Satisfacción</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4.9/5</div>
            <p className="text-xs text-gray-400">Calificación promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* My Projects */}
      <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Mis Proyectos</CardTitle>
              <CardDescription className="text-gray-400">Estado actual de todos tus proyectos</CardDescription>
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">
              Ver Historial
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="p-6 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{project.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Inicio: {project.startDate}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Entrega: {project.deadline}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {project.budget}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {project.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Progreso General</span>
                    <span className="text-gray-400">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />

                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div>
                      <p className="text-white text-sm font-medium">Próximo Hito</p>
                      <p className="text-gray-400 text-xs">{project.nextMilestone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">{project.milestoneDate}</p>
                      <p className="text-gray-400 text-xs">Fecha estimada</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Requests */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Presupuestos</CardTitle>
            <CardDescription className="text-gray-400">Estado de tus solicitudes de presupuesto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm mb-1">{budget.title}</h3>
                    <p className="text-gray-400 text-xs mb-2">{budget.description}</p>
                    <p className="text-gray-400 text-xs">Fecha: {budget.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{budget.amount}</p>
                    <Badge variant="outline" className={`${getStatusColor(budget.status)} text-white border-0 mt-1`}>
                      {getStatusText(budget.status)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  {budget.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs text-gray-400">
                      <span>{item.name}</span>
                      <span>{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 text-xs bg-transparent">
                    Ver Detalles
                  </Button>
                  {budget.status === "pendiente" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                      >
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 text-xs bg-transparent"
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Facturas</CardTitle>
            <CardDescription className="text-gray-400">Historial de facturación y pagos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium text-sm">{invoice.id}</h3>
                    <p className="text-gray-400 text-xs">{invoice.project}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{invoice.amount}</p>
                    <Badge variant="outline" className={`${getStatusColor(invoice.status)} text-white border-0 mt-1`}>
                      {getStatusText(invoice.status)}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-400 mb-3">
                  <span>Fecha: {invoice.date}</span>
                  <span>Vencimiento: {invoice.dueDate}</span>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 text-xs bg-transparent">
                    <Download className="h-3 w-3 mr-1" />
                    Descargar
                  </Button>
                  {invoice.status === "pendiente" && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                    >
                      Pagar Ahora
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Support Section */}
      <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white">Soporte 24/7</CardTitle>
          <CardDescription className="text-gray-400">Múltiples canales de comunicación disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
              <Phone className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm mb-1">WhatsApp</h3>
              <p className="text-gray-400 text-xs mb-3">Respuesta inmediata</p>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 w-full"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Abrir Chat
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
              <Mail className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm mb-1">Email</h3>
              <p className="text-gray-400 text-xs mb-3">Respuesta en 2h</p>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 w-full bg-transparent">
                Enviar Email
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
              <MessageSquare className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm mb-1">Chat Interno</h3>
              <p className="text-gray-400 text-xs mb-3">Historial completo</p>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 w-full bg-transparent">
                Abrir Chat
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
              <CheckCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm mb-1">FAQ</h3>
              <p className="text-gray-400 text-xs mb-3">Respuestas rápidas</p>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 w-full bg-transparent">
                Ver FAQ
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-blue-300 font-medium text-sm">Estado del Servicio: Operativo</p>
                <p className="text-blue-400 text-xs">Todos los sistemas funcionando correctamente</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Descargas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-4">Documentos y entregables</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Contrato_Firmado.pdf</span>
                <span className="text-gray-400">1.2 MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Entregable_v2.zip</span>
                <span className="text-gray-400">15.8 MB</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 border-gray-700 text-gray-300 bg-transparent">
              Ver Todos
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-4">Comparte tu experiencia</p>
            <div className="flex space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
              ))}
            </div>
            <Button variant="outline" className="w-full border-gray-700 text-gray-300 bg-transparent">
              Dejar Reseña
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Nuevo Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-4">¿Tienes una nueva idea?</p>
            <p className="text-gray-300 text-sm mb-4">Solicita un presupuesto personalizado para tu próximo proyecto</p>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
              Solicitar Presupuesto
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
