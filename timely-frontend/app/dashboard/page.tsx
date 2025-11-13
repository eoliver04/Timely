"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getCurrentUserProfile } from "@/services/api"
import { ProtectedRoute } from "@/components/protected-route"
import { isAdmin, getUserRole } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Calendar, Plus } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>("")
  const [userRole, setUserRole] = useState<string>("")

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userProfile = await getCurrentUserProfile()
        if (userProfile && userProfile.email) {
          setUserEmail(userProfile.email)
        }
        // Obtener rol del token JWT
        const role = getUserRole()
        setUserRole(role || "cliente")
      } catch (error) {
        console.error("Error loading user:", error)
        // Si no puede cargar el usuario, redirigir al login
        router.push("/login")
      }
    }
    loadUser()
  }, [router])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
          
          {/* Header con Logo */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Bienvenido a Timely</h1>
              <p className="text-base sm:text-lg text-gray-600">
                {userEmail && <span className="font-medium">{userEmail}</span>}
                {userRole && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full">
                  {userRole === 'admin' ? '👑 Administrador' : '👤 Cliente'}
                </span>}
              </p>
            </div>
            
            {/* Logo en la esquina superior derecha - diseño minimalista */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="/logo_timely.png"
                alt="Timely Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Para ADMINS: Gestión de negocios */}
            {isAdmin() && (
              <>
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push("/businesses/new")}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Plus className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>Crear Negocio</CardTitle>
                        <CardDescription>Registra un nuevo negocio</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-transparent" variant="outline">
                      Comenzar
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push("/my-businesses")}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle>Mis Negocios</CardTitle>
                        <CardDescription>Gestionar mis negocios</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-transparent" variant="outline">
                      Ver Negocios
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Para CLIENTES: Explorar y reservar */}
            {!isAdmin() && (
              <>
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push("/businesses")}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle>Explorar Negocios</CardTitle>
                        <CardDescription>Descubre y reserva servicios</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-transparent" variant="outline">
                      Ver Negocios
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push("/appointments")}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle>Mis Reservas</CardTitle>
                        <CardDescription>Ver y gestionar tus citas</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-transparent" variant="outline">
                      Ver Reservas
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
