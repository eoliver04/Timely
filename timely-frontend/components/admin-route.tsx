"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, isAdmin } from "@/lib/auth-utils"

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Verificar autenticación y rol de admin
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    if (!isAdmin()) {
      // Si está autenticado pero no es admin, redirigir al dashboard
      router.push("/dashboard")
      return
    }

    setIsAuthorized(true)
  }, [router])

  // Mientras verifica, mostrar un loading
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
