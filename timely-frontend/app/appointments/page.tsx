"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Plus } from "lucide-react"

export default function AppointmentsPage() {
  const router = useRouter()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
              <p className="text-gray-600">Gestiona todas tus citas programadas</p>
            </div>
            <Button onClick={() => router.push("/businesses")} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Reserva
            </Button>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Funcionalidad en desarrollo</h3>
              <p className="text-gray-600 mb-4">Pronto podrás ver todas tus reservas aquí</p>
              <Button onClick={() => router.push("/businesses")}>Ver Negocios</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
