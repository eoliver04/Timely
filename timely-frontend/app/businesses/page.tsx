"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getBusinesses } from "@/services/api"
import { ProtectedRoute } from "@/components/protected-route"
import { isAdmin, getUserRole } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, MapPin, Phone, Plus } from "lucide-react"

interface Business {
  id: string
  name: string
  address: string
  phone: string
}

export default function BusinessesPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState<string>("")

  useEffect(() => {
    // Obtener rol del usuario
    const role = getUserRole()
    setUserRole(role || "cliente")
    
    loadBusinesses()
  }, [])

  const loadBusinesses = async () => {
    try {
      setLoading(true)
      
      // Debug del token antes de hacer la llamada
      console.log("🔍 DEBUGGING antes de llamar getBusinesses:")
      const token = localStorage.getItem("access_token")
      console.log("Token en localStorage:", !!token)
      
      const data = await getBusinesses()
      setBusinesses(data)
    } catch (err: any) {
      setError(err.message || "Error al cargar los negocios")
      console.error("❌ Error en loadBusinesses:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {userRole === 'admin' ? 'Mis Negocios' : 'Negocios Disponibles'}
              </h1>
              <p className="text-gray-600">
                {userRole === 'admin' 
                  ? 'Gestiona todos tus negocios registrados' 
                  : 'Explora los negocios disponibles para reservar citas'
                }
              </p>
            </div>
            {/* Solo mostrar botón "Crear Negocio" a los admins */}
            {isAdmin() && (
              <Button onClick={() => router.push("/businesses/new")} className="gap-2">
                <Plus className="h-4 w-4" />
                Crear Negocio
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : businesses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mb-4" />
                {userRole === 'admin' ? (
                  <>
                    <h3 className="text-xl font-semibold mb-2">No tienes negocios registrados</h3>
                    <p className="text-gray-600 mb-4">Comienza creando tu primer negocio</p>
                    <Button onClick={() => router.push("/businesses/new")}>Crear Negocio</Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2">No hay negocios disponibles</h3>
                    <p className="text-gray-600 mb-4">Actualmente no hay negocios registrados en la plataforma</p>
                    <Button onClick={() => window.location.reload()}>Actualizar</Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Card
                  key={business.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/businesses/${business.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{business.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{business.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{business.phone}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
