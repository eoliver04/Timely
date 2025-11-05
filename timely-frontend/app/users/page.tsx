"use client"

import { useState } from "react"
import { getUserById } from "@/services/api"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Search, Mail, Phone, Shield, Calendar, UserCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface UserData {
  id: string
  name?: string
  phone?: string
  role?: string
  created_at?: string
  updated_at?: string
}

export default function UsersPage() {
  const [userId, setUserId] = useState("")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId.trim()) {
      setError("Por favor ingresa un ID de usuario")
      return
    }

    try {
      setLoading(true)
      setError("")
      setSearched(true)
      const data = await getUserById(userId.trim())
      setUserData(data)
    } catch (err: any) {
      setError(err.message || "Error al buscar el usuario")
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setUserId("")
    setUserData(null)
    setError("")
    setSearched(false)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <UserCircle className="h-8 w-8 text-blue-600" />
              Búsqueda de Usuarios
            </h1>
            <p className="text-gray-600 mt-2">
              Busca información de usuarios por su ID
            </p>
          </div>

          {/* Search Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Buscar Usuario
              </CardTitle>
              <CardDescription>
                Ingresa el ID del usuario que deseas buscar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">ID de Usuario</Label>
                  <div className="flex gap-2">
                    <Input
                      id="userId"
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Ej: f52740f4-f1a0-4f18-ae8b-f5f855e5b781"
                      className="flex-1"
                    />
                    <Button type="submit" disabled={loading} className="gap-2">
                      <Search className="h-4 w-4" />
                      {loading ? "Buscando..." : "Buscar"}
                    </Button>
                    {(userData || searched) && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleClear}
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* User Data Card */}
          {userData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-6 w-6 text-blue-600" />
                    Información del Usuario
                  </CardTitle>
                  <Badge 
                    variant={userData.role === 'admin' ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {userData.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </Badge>
                </div>
                <CardDescription>
                  Detalles completos del usuario
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* User ID */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500">ID de Usuario</span>
                  </div>
                  <p className="text-sm font-mono text-gray-900 break-all pl-6">
                    {userData.id}
                  </p>
                </div>

                <Separator />

                {/* User Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-5 w-5" />
                      <span className="font-medium">Nombre</span>
                    </div>
                    <p className="text-lg pl-7">
                      {userData.name || <span className="text-gray-400 italic">No especificado</span>}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-5 w-5" />
                      <span className="font-medium">Teléfono</span>
                    </div>
                    <p className="text-lg pl-7">
                      {userData.phone || <span className="text-gray-400 italic">No especificado</span>}
                    </p>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Rol</span>
                    </div>
                    <div className="pl-7">
                      <Badge variant={userData.role === 'admin' ? 'default' : 'secondary'}>
                        {userData.role === 'admin' ? 'Administrador' : userData.role || 'Cliente'}
                      </Badge>
                    </div>
                  </div>

                  {/* Created At */}
                  {userData.created_at && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">Creado</span>
                      </div>
                      <p className="text-sm pl-7 text-gray-700">
                        {new Date(userData.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}

                  {/* Updated At */}
                  {userData.updated_at && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">Última actualización</span>
                      </div>
                      <p className="text-sm pl-7 text-gray-700">
                        {new Date(userData.updated_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}

                </div>

              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!userData && !loading && searched && !error && (
            <Card>
              <CardContent className="py-12 text-center">
                <UserCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Usuario no encontrado
                </h3>
                <p className="text-gray-600">
                  No se encontró información para el ID proporcionado
                </p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </ProtectedRoute>
  )
}
