"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getBusinessById, getSchedules, createAppointment } from "@/services/api"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Building2, MapPin, Phone, Calendar, Clock, Info, CheckCircle, XCircle } from "lucide-react"

interface Business {
  id: string
  name: string
  address: string
  phone: string
  info?: string
  owner_id: string
  created_at: string
}

interface Schedule {
  id: string
  business_id: string
  date: string
  start_time: string
  end_time: string
  available: boolean
  created_at: string
}

export default function BusinessDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [business, setBusiness] = useState<Business | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingSchedules, setLoadingSchedules] = useState(false)
  const [creatingAppointment, setCreatingAppointment] = useState(false)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  useEffect(() => {
    loadBusiness()
  }, [params.id])

  useEffect(() => {
    if (business) {
      loadSchedules()
    }
  }, [selectedDate, business])

  const loadBusiness = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await getBusinessById(params.id as string)
      setBusiness(data)
    } catch (err: any) {
      setError(err.message || "Error al cargar el negocio")
    } finally {
      setLoading(false)
    }
  }

  const loadSchedules = async () => {
    try {
      setLoadingSchedules(true)
      setError("")
      const data = await getSchedules(params.id as string, selectedDate)
      setSchedules(data || [])
    } catch (err: any) {
      console.error("Error loading schedules:", err)
      setSchedules([])
    } finally {
      setLoadingSchedules(false)
    }
  }

  const handleReserve = async (scheduleId: string) => {
    if (creatingAppointment) return

    try {
      setCreatingAppointment(true)
      await createAppointment(scheduleId)
      
      toast({
        title: "Reserva exitosa",
        description: "Tu cita ha sido agendada correctamente",
      })

      // Recargar horarios para ver el cambio
      await loadSchedules()
    } catch (error: any) {
      console.error("Error creating appointment:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la reserva",
        variant: "destructive",
      })
    } finally {
      setCreatingAppointment(false)
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

  const groupSchedulesByDate = () => {
    const grouped: { [key: string]: Schedule[] } = {}
    schedules.forEach(schedule => {
      if (!grouped[schedule.date]) {
        grouped[schedule.date] = []
      }
      grouped[schedule.date].push(schedule)
    })
    return grouped
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6 max-w-6xl">
          <Button variant="ghost" onClick={() => router.push("/businesses")} className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Negocios
          </Button>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : business ? (
            <div className="space-y-6">
              
              {/* Business Info Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl">{business.name}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Información del negocio y horarios disponibles
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-5 w-5" />
                        <span className="font-medium">Dirección</span>
                      </div>
                      <p className="text-lg pl-7">{business.address}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-5 w-5" />
                        <span className="font-medium">Teléfono</span>
                      </div>
                      <p className="text-lg pl-7">{business.phone}</p>
                    </div>
                  </div>

                  {business.info && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Info className="h-5 w-5" />
                          <span className="font-medium">Información adicional</span>
                        </div>
                        <p className="text-gray-700 pl-7 bg-gray-50 p-4 rounded-lg">
                          {business.info}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Schedules Section */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Horarios Disponibles
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Selecciona una fecha para ver los horarios disponibles
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label htmlFor="date-selector" className="text-sm font-medium whitespace-nowrap">
                        Fecha:
                      </Label>
                      <Input
                        id="date-selector"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-auto"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingSchedules ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : schedules.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No hay horarios disponibles
                      </h3>
                      <p className="text-gray-600">
                        No se encontraron horarios para el {formatDate(selectedDate)}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">
                          Mostrando horarios para: {formatDate(selectedDate)}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          {schedules.filter(s => s.available).length} horarios disponibles de {schedules.length} totales
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {schedules
                          .sort((a, b) => a.start_time.localeCompare(b.start_time))
                          .map(schedule => (
                            <Card
                              key={schedule.id}
                              className={`${
                                schedule.available
                                  ? 'border-green-200 bg-green-50 hover:shadow-md transition-shadow cursor-pointer'
                                  : 'border-gray-200 bg-gray-50 opacity-60'
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-600" />
                                    <span className="font-semibold text-lg">
                                      {schedule.start_time} - {schedule.end_time}
                                    </span>
                                  </div>
                                  {schedule.available ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                
                                <Badge
                                  variant={schedule.available ? "default" : "secondary"}
                                  className={
                                    schedule.available
                                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                                      : "bg-gray-200 text-gray-700"
                                  }
                                >
                                  {schedule.available ? 'Disponible' : 'No disponible'}
                                </Badge>

                                {schedule.available && (
                                  <Button
                                    className="w-full mt-3"
                                    size="sm"
                                    disabled={creatingAppointment}
                                    onClick={() => handleReserve(schedule.id)}
                                  >
                                    {creatingAppointment ? "Reservando..." : "Reservar"}
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  )
}
