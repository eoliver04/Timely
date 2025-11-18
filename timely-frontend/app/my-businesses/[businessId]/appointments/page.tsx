"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getBusinessAppointments, getBusinessById, updateAppointmentStatus } from "@/services/api"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, User, Phone, ArrowLeft, CalendarDays, CheckCircle, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  id: string
  schedule_id: string
  user_id: string
  status: boolean
  verified?: boolean
  created_at: string
  schedule: {
    id: string
    date: string
    start_time: string
    end_time: string
    available: boolean
    business: {
      id: string
      name: string
      address: string
      phone: string
    }
  }
  user: {
    id: string
    user_name: string
    phone: string
  }
}

interface BusinessAppointmentsResponse {
  appointments: Appointment[]
  total: number
  date: string
  businessId: string
}

export default function BusinessAppointmentsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const businessId = params.businessId as string

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [businessName, setBusinessName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    loadBusinessInfo()
  }, [businessId])

  useEffect(() => {
    loadAppointments()
  }, [businessId, selectedDate])

  async function loadBusinessInfo() {
    try {
      const business = await getBusinessById(businessId)
      setBusinessName(business.name)
    } catch (err: any) {
      console.error("Error loading business info:", err)
    }
  }

  async function loadAppointments() {
    try {
      setLoading(true)
      setError("")
      const data: BusinessAppointmentsResponse = await getBusinessAppointments(
        businessId,
        selectedDate || undefined
      )
      setAppointments(data.appointments || [])
    } catch (err: any) {
      console.error("Error loading appointments:", err)
      setError(err.message || "Error al cargar las reservas")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5) // "10:00:00" -> "10:00"
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const clearDateFilter = () => {
    setSelectedDate("")
  }

  const handleUpdateStatus = async (appointmentId: string, verify: boolean) => {
    try {
      setUpdatingId(appointmentId)
      await updateAppointmentStatus(appointmentId, verify)
      
      toast({
        title: verify ? "Reserva aprobada" : "Reserva rechazada",
        description: `La reserva ha sido ${verify ? 'aprobada' : 'rechazada'} exitosamente`,
      })
      
      // Recargar appointments
      await loadAppointments()
    } catch (err: any) {
      console.error("Error updating appointment status:", err)
      toast({
        title: "Error",
        description: err.message || "Error al actualizar el estado de la reserva",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push(`/my-businesses/${businessId}`)}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Negocio
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Gestión de Reservas
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {businessName && <span className="font-medium">{businessName}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Filtro de Fecha */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Filtrar por Fecha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Label htmlFor="date-filter" className="text-sm mb-2 block">
                    Selecciona una fecha
                  </Label>
                  <Input
                    id="date-filter"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2 sm:items-end">
                  <Button
                    onClick={() => setSelectedDate(getTodayDate())}
                    variant="outline"
                    className="flex-1 sm:flex-none"
                  >
                    Hoy
                  </Button>
                  <Button
                    onClick={clearDateFilter}
                    variant="outline"
                    className="flex-1 sm:flex-none"
                  >
                    Ver Todas
                  </Button>
                </div>
              </div>
              {selectedDate && (
                <p className="text-sm text-gray-600 mt-3">
                  Mostrando reservas para: <span className="font-medium">{formatDate(selectedDate)}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Lista de Reservas */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hay reservas</h3>
                <p className="text-gray-600 text-center">
                  {selectedDate
                    ? 'No hay reservas para esta fecha'
                    : 'Aún no tienes reservas para este negocio'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card 
                  key={appointment.id} 
                  className="hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden"
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      
                      {/* Info de la reserva */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Fecha</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDate(appointment.schedule.date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <Clock className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Horario</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatTime(appointment.schedule.start_time)} - {formatTime(appointment.schedule.end_time)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <User className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Cliente</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {appointment.user?.user_name || 'Usuario sin nombre'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <Phone className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Contacto</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {appointment.user?.phone || 'Sin teléfono'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Estado y acciones */}
                      <div className="flex flex-col gap-4 md:min-w-[200px]">
                        {/* Estado visual */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2"
                          style={{
                            borderColor: appointment.verified === true ? '#10b981' : appointment.verified === false ? '#ef4444' : '#f59e0b',
                            backgroundColor: appointment.verified === true ? '#ecfdf5' : appointment.verified === false ? '#fef2f2' : '#fef3c7'
                          }}
                        >
                          <span className="w-2.5 h-2.5 rounded-full animate-pulse"
                            style={{
                              backgroundColor: appointment.verified === true ? '#10b981' : appointment.verified === false ? '#ef4444' : '#f59e0b'
                            }}
                          ></span>
                          <span className="text-sm font-semibold"
                            style={{
                              color: appointment.verified === true ? '#047857' : appointment.verified === false ? '#dc2626' : '#d97706'
                            }}
                          >
                            {appointment.verified === true ? 'Aprobada' : 
                             appointment.verified === false ? 'Rechazada' : 
                             'Pendiente'}
                          </span>
                        </div>

                        {/* Botones de acción */}
                        {(appointment.verified === undefined || appointment.verified === null || appointment.verified === false) && (
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleUpdateStatus(appointment.id, true)}
                              disabled={updatingId === appointment.id}
                            >
                              <CheckCircle className="h-4 w-4" />
                              {updatingId === appointment.id ? 'Procesando...' : 'Aprobar'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleUpdateStatus(appointment.id, false)}
                              disabled={updatingId === appointment.id}
                            >
                              <XCircle className="h-4 w-4" />
                              {updatingId === appointment.id ? 'Procesando...' : 'Rechazar'}
                            </Button>
                          </div>
                        )}

                        <p className="text-xs text-gray-400 text-center">
                          ID: {appointment.id.substring(0, 8)}...
                        </p>
                      </div>
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
