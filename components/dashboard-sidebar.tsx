"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  CreditCard,
  BarChart3,
  MessageSquare,
  Calendar,
  Briefcase,
  Shield,
  Clock,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  // Navegación por roles
  const getNavigationItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
    ]

    if (user?.role === "admin") {
      return [
        ...baseItems,
        {
          title: "Usuarios",
          href: "/dashboard/admin/usuarios",
          icon: Users,
          badge: null,
        },
        {
          title: "Solicitudes",
          href: "/dashboard/admin/solicitudes",
          icon: UserPlus,
          badge: null,
        },
        {
          title: "Proyectos",
          href: "/dashboard/admin/proyectos",
          icon: Briefcase,
          badge: null,
        },
        {
          title: "Presupuestos",
          href: "/dashboard/admin/presupuestos",
          icon: CreditCard,
          badge: null,
        },
        {
          title: "Analytics",
          href: "/dashboard/admin/analytics",
          icon: BarChart3,
          badge: null,
        },
        {
          title: "Configuración",
          href: "/dashboard/admin/configuracion",
          icon: Settings,
          badge: null,
        },
      ]
    }

    if (user?.role === "empleado") {
      return [
        ...baseItems,
        {
          title: "Mis Proyectos",
          href: "/dashboard/empleado/proyectos",
          icon: Briefcase,
          badge: null,
        },
        {
          title: "Tareas",
          href: "/dashboard/empleado/tareas",
          icon: Clock,
          badge: "3",
        },
        {
          title: "Calendario",
          href: "/dashboard/empleado/calendario",
          icon: Calendar,
          badge: null,
        },
        {
          title: "Clientes",
          href: "/dashboard/empleado/clientes",
          icon: Users,
          badge: null,
        },
        {
          title: "Reportes",
          href: "/dashboard/empleado/reportes",
          icon: FileText,
          badge: null,
        },
      ]
    }

    // Cliente
    return [
      ...baseItems,
      {
        title: "Mis Proyectos",
        href: "/dashboard/cliente/proyectos",
        icon: Briefcase,
        badge: null,
      },
      {
        title: "Presupuestos",
        href: "/dashboard/cliente/presupuestos",
        icon: CreditCard,
        badge: "1",
      },
      {
        title: "Facturas",
        href: "/dashboard/cliente/facturas",
        icon: FileText,
        badge: null,
      },
      {
        title: "Soporte",
        href: "/dashboard/cliente/soporte",
        icon: MessageSquare,
        badge: null,
      },
      {
        title: "Perfil",
        href: "/dashboard/cliente/perfil",
        icon: Settings,
        badge: null,
      },
    ]
  }

  const navigationItems = getNavigationItems()

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10",
                    collapsed && "px-2",
                    isActive && "bg-primary/10 text-primary",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Info & Logout */}
      <div className="p-3 border-t">
        {!collapsed && (
          <div className="mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn("w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50", collapsed && "px-2")}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && "Cerrar Sesión"}
        </Button>
      </div>
    </div>
  )
}
