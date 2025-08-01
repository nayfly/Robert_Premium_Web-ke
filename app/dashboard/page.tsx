"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        console.log("Checking auth in dashboard page...")

        const response = await fetch("/api/auth/me", {
          credentials: "include",
        })

        console.log("Auth response status:", response.status)

        if (!response.ok) {
          console.log("Auth failed, redirecting to login")
          router.push("/login")
          return
        }

        const data = await response.json()
        console.log("Auth data:", data)

        if (!data.success || !data.user) {
          console.log("No user data, redirecting to login")
          router.push("/login")
          return
        }

        const user = data.user
        console.log("User authenticated:", user.email, "role:", user.role)

        // Redirigir según el rol
        switch (user.role) {
          case "admin":
            console.log("Redirecting to admin dashboard")
            router.push("/dashboard/admin")
            break
          case "empleado":
            console.log("Redirecting to empleado dashboard")
            router.push("/dashboard/empleado")
            break
          case "cliente":
            console.log("Redirecting to cliente dashboard")
            router.push("/dashboard/cliente")
            break
          default:
            console.log("Unknown role, redirecting to login")
            router.push("/login")
        }
      } catch (error) {
        console.error("Error en dashboard:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkUserAndRedirect()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400 mt-4">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Esta página no debería renderizarse nunca, siempre debería redirigir
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white">Redirigiendo...</p>
      </div>
    </div>
  )
}
