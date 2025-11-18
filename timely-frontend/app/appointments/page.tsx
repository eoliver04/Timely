"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getMyAppointments, cancelAppointment } from "@/services/api"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, MapPin, Building2, Phone, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  id: string
  schedule_id: string
  user_id: string
  status: boolean
  verify?: boolean
  created_at: string
  schedule: {
    id: string
    business_id: string
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
}

export default function AppointmentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    loadAppointments()
  }, [])

  async function loadAppointments() {
    try {
      setLoading(true)
      setError("")
      const data = await getMyAppointments()
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

  const handleCancelClick = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId)
    setCancelDialogOpen(true)
  }

  const handleCancelConfirm = async () => {
    if (!appointmentToCancel) return

    try {
      setCancelling(true)
      await cancelAppointment(appointmentToCancel)
      
      toast({
        title: "Reserva cancelada",
        description: "Tu reserva ha sido cancelada exitosamente",
      })
      
      setCancelDialogOpen(false)
      setAppointmentToCancel(null)
      
      // Recargar appointments
      await loadAppointments()
    } catch (err: any) {
      console.error("Error cancelling appointment:", err)
      toast({
        title: "Error",
        description: err.message || "Error al cancelar la reserva",
        variant: "destructive",
      })
    } finally {
      setCancelling(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
              <p className="text-sm sm:text-base text-gray-600">Gestiona todas tus citas programadas</p>
            </div>
            <Button 
              onClick={() => router.push("/businesses")} 
              className="gap-2 w-full sm:w-auto"
              size="default"
            >
              <Plus className="h-4 w-4" />
              Nueva Reserva
            </Button>
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
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tienes reservas</h3>
                <p className="text-gray-600 mb-4 text-center">Crea tu primera reserva para comenzar</p>
                <Button onClick={() => router.push("/businesses")}>Ver Negocios</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {appointments.map((appointment) => (
                <Card 
                  key={appointment.id} 
                  className="hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold">
                            {appointment.schedule.business.name}
                          </CardTitle>
                          <CardDescription className="text-blue-100 text-xs">
                            {appointment.verify === true 
                              ? '✓ Aprobada por el negocio' 
                              : appointment.verify === false 
                              ? '✗ Rechazada por el negocio'
                              : '⏳ Esperando aprobación'}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4 space-y-3">
                    {/* Fecha */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-gray-900">
                        {formatDate(appointment.schedule.date)}
                      </span>
                    </div>

                    {/* Hora */}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        {formatTime(appointment.schedule.start_time)} - {formatTime(appointment.schedule.end_time)}
                      </span>
                    </div>

                    {/* Dirección */}
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 line-clamp-2">
                        {appointment.schedule.business.address}
                      </span>
                    </div>

                    {/* Teléfono */}
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        {appointment.schedule.business.phone}
                      </span>
                    </div>

                    {/* Badge de estado */}
                    <div className="pt-2">
                      <Badge 
                        variant={
                          appointment.verify === true 
                            ? "default" 
                            : appointment.verify === false 
                            ? "destructive" 
                            : "secondary"
                        }
                        className="w-full justify-center"
                      >
                        {appointment.verify === true 
                          ? '✓ Aprobada' 
                          : appointment.verify === false 
                          ? '✗ Rechazada'
                          : '⏳ Pendiente de aprobación'}
                      </Badge>
                    </div>

                    {/* Botón de cancelar - Solo si no está rechazada */}
                    {appointment.verify !== false && (
                      <div className="pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() => handleCancelClick(appointment.id)}
                        >
                          <X className="h-4 w-4" />
                          Cancelar Reserva
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Dialog de confirmación de cancelación */}
          <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cancelar reserva?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La reserva será cancelada y el horario
                  quedará disponible nuevamente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={cancelling}>No, mantener</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelConfirm}
                  disabled={cancelling}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {cancelling ? "Cancelando..." : "Sí, cancelar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </ProtectedRoute>
  )
}
