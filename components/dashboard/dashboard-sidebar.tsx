"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Settings,
  BarChart3,
  CheckSquare,
  MessageSquare,
  Calendar,
  FolderOpen,
  CreditCard,
  HeadphonesIcon,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

interface User {
  id: string
  email: string
  name: string
  role: string
  company?: string
  position?: string
}

interface DashboardSidebarProps {
  user: User
  collapsed: boolean
  onToggle: () => void
}

const adminMenuItems = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios",
    href: "/dashboard/admin/usuarios",
    icon: Users,
  },
  {
    title: "Proyectos",
    href: "/dashboard/admin/proyectos",
    icon: FolderOpen,
  },
  {
    title: "Finanzas",
    href: "/dashboard/admin/finanzas",
    icon: DollarSign,
  },
  {
    title: "Contratos",
    href: "/dashboard/admin/contratos",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Configuración",
    href: "/dashboard/admin/configuracion",
    icon: Settings,
  },
]

const empleadoMenuItems = [
  {
    title: "Dashboard",
    href: "/dashboard/empleado",
    icon: LayoutDashboard,
  },
  {
    title: "Mis Tareas",
    href: "/dashboard/empleado/tareas",
    icon: CheckSquare,
  },
  {
    title: "Proyectos",
    href: "/dashboard/empleado/proyectos",
    icon: FolderOpen,
  },
  {
    title: "Calendario",
    href: "/dashboard/empleado/calendario",
    icon: Calendar,
  },
  {
    title: "Mensajes",
    href: "/dashboard/empleado/mensajes",
    icon: MessageSquare,
  },
]

const clienteMenuItems = [
  {
    title: "Dashboard",
    href: "/dashboard/cliente",
    icon: LayoutDashboard,
  },
  {
    title: "Mis Proyectos",
    href: "/dashboard/cliente/proyectos",
    icon: FolderOpen,
  },
  {
    title: "Presupuestos",
    href: "/dashboard/cliente/presupuestos",
    icon: FileText,
  },
  {
    title: "Facturas",
    href: "/dashboard/cliente/facturas",
    icon: CreditCard,
  },
  {
    title: "Soporte",
    href: "/dashboard/cliente/soporte",
    icon: HeadphonesIcon,
  },
  {
    title: "Descargas",
    href: "/dashboard/cliente/descargas",
    icon: Download,
  },
]

export function DashboardSidebar({ user, collapsed, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()

  const getMenuItems = () => {
    switch (user.role) {
      case "admin":
        return adminMenuItems
      case "empleado":
        return empleadoMenuItems
      case "cliente":
        return clienteMenuItems
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <Logo className="h-8 w-8" />
            <div>
              <h2 className="text-white font-semibold text-sm">Robert Software</h2>
              <p className="text-gray-400 text-xs capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white",
                collapsed && "justify-center",
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-gray-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
