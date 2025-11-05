"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrentUserProfile, updateUserProfile } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, Shield, Calendar } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userInfo, setUserInfo] = useState({
    email: "",
    created_at: "",
  })
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "cliente" as "admin" | "cliente",
  })

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const profile = await getCurrentUserProfile()
      console.log("Profile data:", profile)
      
      // El endpoint /users/me retorna datos de auth.getUser()
      // La estructura es: { user: { id, email, ... } }
      const userData = profile.user || profile
      
      setUserInfo({
        email: userData.email || "",
        created_at: userData.created_at || "",
      })
      
      // Para el name, phone y role necesitamos obtenerlos de user_metadata o user_status
      setFormData({
        name: userData.user_metadata?.name || userData.name || "",
        phone: userData.user_metadata?.phone || userData.phone || "",
        role: userData.user_metadata?.role || userData.role || "cliente",
      })
    } catch (error) {
      console.error("Error loading profile:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      await updateUserProfile(formData)
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil se ha actualizado correctamente",
      })
      // Recargar perfil para mostrar cambios
      await loadProfile()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto py-8 px-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-blue-600" />
                Mi Perfil
              </CardTitle>
              <CardDescription>Visualiza y actualiza tu información personal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Información de solo lectura */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 border">
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Información de la Cuenta</h3>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{userInfo.email || "No disponible"}</p>
                  </div>
                </div>
                
                {userInfo.created_at && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Miembro desde</p>
                      <p className="text-sm font-medium">
                        {new Date(userInfo.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Formulario editable */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+52 123 456 7890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Rol
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "cliente") => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente">Cliente</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
