"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createSchedule, getBusinessById } from "@/services/api"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Calendar, Clock, ArrowLeft } from "lucide-react"

interface Business {
  id: string
  name: string
  address: string
  phone: string
}

export default function NewSchedulePage() {
  const router = useRouter()
  const params = useParams()
  const businessId = params.businessId as string

  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingBusiness, setLoadingBusiness] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form state
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    fetchBusiness()
  }, [businessId])

  const fetchBusiness = async () => {
    try {
      setLoadingBusiness(true)
      const data = await getBusinessById(businessId)
      setBusiness(data)
    } catch (err: any) {
      setError(err.message || "Error al cargar el negocio")
    } finally {
      setLoadingBusiness(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validaciones
    if (!date || !startTime || !endTime) {
      setError("Por favor completa todos los campos")
      return
    }

    // Validar formato de tiempo (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      setError("El formato de tiempo debe ser HH:MM (ejemplo: 09:00)")
      return
    }

    // Validar que la hora de inicio sea menor que la hora de fin
    if (startTime >= endTime) {
      setError("La hora de inicio debe ser menor que la hora de fin")
      return
    }

    try {
      setLoading(true)
      await createSchedule(businessId, {
        date,
        start_time: startTime,
        end_time: endTime,
        available,
      })
      setSuccess("Horario creado exitosamente")
      
      // Limpiar el formulario
      setDate("")
      setStartTime("")
      setEndTime("")
      setAvailable(true)

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push(`/my-businesses`)
      }, 2000)
      
    } catch (err: any) {
      setError(err.message || "Error al crear el horario")
    } finally {
      setLoading(false)
    }
  }

  if (loadingBusiness) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <p className="text-gray-600">Cargando negocio...</p>
        </div>
      </ProtectedRoute>
    )
  }

  if (!business) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <Card>
            <CardContent className="p-6">
              <p className="text-red-600">Negocio no encontrado</p>
              <Button onClick={() => router.push("/my-businesses")} className="mt-4">
                Volver a Mis Negocios
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6 max-w-2xl">
          
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/my-businesses")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Negocios
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Horario</h1>
            <p className="text-gray-600 mt-2">Para: {business.name}</p>
          </div>

          {/* Success Alert */}
          {success && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Horario</CardTitle>
              <CardDescription>
                Completa los datos del horario disponible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Date Input */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-sm text-gray-500">
                    Formato: YYYY-MM-DD
                  </p>
                </div>

                {/* Start Time Input */}
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hora de Inicio
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    placeholder="09:00"
                  />
                  <p className="text-sm text-gray-500">
                    Formato: HH:MM (ejemplo: 09:00)
                  </p>
                </div>

                {/* End Time Input */}
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hora de Fin
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    placeholder="17:00"
                  />
                  <p className="text-sm text-gray-500">
                    Formato: HH:MM (ejemplo: 17:00)
                  </p>
                </div>

                {/* Available Switch */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="available">Disponible</Label>
                    <p className="text-sm text-gray-500">
                      ¿Este horario está disponible para citas?
                    </p>
                  </div>
                  <Switch
                    id="available"
                    checked={available}
                    onCheckedChange={setAvailable}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Creando..." : "Crear Horario"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/my-businesses")}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Información importante:
              </h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• La fecha debe ser igual o posterior a hoy</li>
                <li>• Los horarios deben estar en formato de 24 horas (HH:MM)</li>
                <li>• La hora de inicio debe ser menor que la hora de fin</li>
                <li>• Los horarios marcados como "Disponible" pueden ser reservados por clientes</li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </div>
    </ProtectedRoute>
  )
}
