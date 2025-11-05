"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getBusinessById, updateBusiness } from "@/services/api"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Building, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BusinessData {
  id: string
  name: string
  address: string
  phone: string
  info?: string
  owner_id: string
  created_at: string
}

export default function EditBusinessPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const businessId = params.businessId as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    info: "",
  })

  useEffect(() => {
    fetchBusiness()
  }, [businessId])

  const fetchBusiness = async () => {
    try {
      setLoading(true)
      setError("")
      const data: BusinessData = await getBusinessById(businessId)
      setFormData({
        name: data.name,
        address: data.address,
        phone: data.phone,
        info: data.info || "",
      })
    } catch (err: any) {
      setError(err.message || "Error al cargar el negocio")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.address.trim() || !formData.phone.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      setError("")
      
      await updateBusiness(businessId, formData)
      
      toast({
        title: "Negocio actualizado",
        description: "Los cambios se guardaron correctamente",
      })
      
      router.push("/my-businesses")
    } catch (err: any) {
      setError(err.message || "Error al actualizar el negocio")
      toast({
        title: "Error",
        description: err.message || "Error al actualizar el negocio",
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
            <p className="text-gray-600">Cargando negocio...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6 max-w-3xl">
          
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/my-businesses")}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Mis Negocios
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Editar Negocio</h1>
            <p className="text-gray-600 mt-2">Actualiza la información de tu negocio</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Información del Negocio
              </CardTitle>
              <CardDescription>
                Completa todos los campos para actualizar tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre del Negocio <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Salón de Belleza Elegancia"
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Dirección <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ej: Calle Principal #123, Centro"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Teléfono <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ej: +52 123 456 7890"
                    required
                  />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <Label htmlFor="info">
                    Información Adicional
                  </Label>
                  <Textarea
                    id="info"
                    value={formData.info}
                    onChange={(e) => setFormData({ ...formData, info: e.target.value })}
                    placeholder="Describe los servicios, horarios especiales u otra información relevante..."
                    rows={4}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/my-businesses")}
                    disabled={submitting}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {submitting ? "Guardando..." : "Guardar Cambios"}
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
