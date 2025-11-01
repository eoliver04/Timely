"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getMyBusinesses } from "@/services/api"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Building, Phone, MapPin, Edit, Trash2, Calendar } from "lucide-react"

interface Business {
  id: string
  name: string
  address: string
  phone: string
  info?: string
  owner_id: string
  created_at: string
}

export default function MyBusinessesPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMyBusinesses()
  }, [])

  const fetchMyBusinesses = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await getMyBusinesses()
      setBusinesses(data || [])
    } catch (err: any) {
      setError(err.message || "Error al cargar mis negocios")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Negocios</h1>
              <p className="text-gray-600 mt-2">Gestiona tus negocios registrados</p>
            </div>
            <Button onClick={() => router.push("/businesses/new")} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Negocio
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando mis negocios...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && businesses.length === 0 && !error && (
            <Card className="text-center py-12">
              <CardContent>
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No tienes negocios registrados
                </h3>
                <p className="text-gray-600 mb-6">
                  Crea tu primer negocio para comenzar a gestionar citas
                </p>
                <Button onClick={() => router.push("/businesses/new")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Crear Primer Negocio
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Businesses Grid */}
          {!loading && businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Card key={business.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      {business.name}
                    </CardTitle>
                    <CardDescription>
                      Creado el {new Date(business.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    
                    {/* Address */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {business.address}
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {business.phone}
                    </div>

                    {/* Info */}
                    {business.info && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {business.info}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-2"
                        onClick={() => router.push(`/my-businesses/${business.id}/schedules`)}
                      >
                        <Calendar className="h-4 w-4" />
                        Horarios
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => router.push(`/businesses/${business.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Navigation Links */}
          <div className="mt-8 text-center">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/businesses")}
              className="gap-2"
            >
              Ver Todos los Negocios
            </Button>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}