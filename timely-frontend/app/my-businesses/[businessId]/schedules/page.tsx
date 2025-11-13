"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getSchedules, getBusinessById, deleteSchedule } from "@/services/api"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, ArrowLeft, Plus, Edit, Trash2, CheckCircle, XCircle, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Schedule {
  id: string
  business_id: string
  date: string
  start_time: string
  end_time: string
  available: boolean
  created_at: string
}

interface Business {
  id: string
  name: string
  address: string
  phone: string
}

export default function SchedulesPage() {
  const router = useRouter()
  const params = useParams()
  const businessId = params.businessId as string

  const [business, setBusiness] = useState<Business | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  // ✅ Estado para la fecha seleccionada (por defecto: hoy)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0] // Formato: YYYY-MM-DD
  })

  useEffect(() => {
    fetchBusiness()
  }, [businessId])

  // ✅ Efecto separado para cargar horarios cuando cambia la fecha
  useEffect(() => {
    if (business) {
      fetchSchedules()
    }
  }, [selectedDate, business])

  const fetchBusiness = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Obtener información del negocio
      const businessData = await getBusinessById(businessId)
      setBusiness(businessData)
    } catch (err: any) {
      setError(err.message || "Error al cargar el negocio")
      setLoading(false)
    }
  }

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      setError("")
      
      console.log("📅 Fetching schedules for date:", selectedDate)
      
      // ✅ Obtener horarios filtrados por la fecha seleccionada
      const schedulesData = await getSchedules(businessId, selectedDate)
      setSchedules(schedulesData || [])
    } catch (err: any) {
      setError(err.message || "Error al cargar los horarios")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (scheduleId: string) => {
    setScheduleToDelete(scheduleId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!scheduleToDelete) return

    try {
      setDeleting(true)
      await deleteSchedule(scheduleToDelete)
      setSuccess("Horario eliminado exitosamente")
      setDeleteDialogOpen(false)
      setScheduleToDelete(null)
      
      // Actualizar la lista
      setSchedules(schedules.filter(s => s.id !== scheduleToDelete))
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Error al eliminar el horario")
    } finally {
      setDeleting(false)
    }
  }

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate)
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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <p className="text-gray-600">Cargando horarios...</p>
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
        <div className="container mx-auto p-6 max-w-6xl">
          
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Horarios</h1>
                <p className="text-gray-600 mt-2">Negocio: {business.name}</p>
              </div>
              <div className="flex gap-4 items-center">
                {/* ✅ Selector de fecha */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="date-filter" className="text-sm font-medium">
                    Fecha:
                  </Label>
                  <Input
                    id="date-filter"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-auto"
                  />
                </div>
                <Button 
                  onClick={() => router.push(`/my-businesses/${businessId}/appointments`)}
                  variant="outline"
                  className="gap-2"
                >
                  <Users className="h-4 w-4" />
                  Ver Reservas
                </Button>
                <Button 
                  onClick={() => router.push(`/my-businesses/${businessId}/schedules/new`)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Horario
                </Button>
              </div>
            </div>
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

          {/* Empty State */}
          {schedules.length === 0 && !loading && (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay horarios para esta fecha
                </h3>
                <p className="text-gray-600 mb-2">
                  No se encontraron horarios para el {formatDate(selectedDate)}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Puedes crear un nuevo horario o seleccionar otra fecha
                </p>
                <Button 
                  onClick={() => router.push(`/my-businesses/${businessId}/schedules/new`)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Crear Horario
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ✅ Schedules List (sin agrupar, ya está filtrado por fecha) */}
          {schedules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Horarios para el {formatDate(selectedDate)}
                </CardTitle>
                <CardDescription>
                  {schedules.length} horario(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schedules
                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                    .map(schedule => (
                      <div
                        key={schedule.id}
                        className={`border rounded-lg p-4 ${
                          schedule.available
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-600" />
                            <span className="font-semibold">
                              {schedule.start_time} - {schedule.end_time}
                            </span>
                          </div>
                          {schedule.available ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            schedule.available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {schedule.available ? 'Disponible' : 'No disponible'}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1"
                            onClick={() => router.push(`/my-businesses/${businessId}/schedules/${schedule.id}/edit`)}
                          >
                            <Edit className="h-3 w-3" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(schedule.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Eliminar horario?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. El horario será eliminado permanentemente.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={deleting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                >
                  {deleting ? "Eliminando..." : "Eliminar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </ProtectedRoute>
  )
}
