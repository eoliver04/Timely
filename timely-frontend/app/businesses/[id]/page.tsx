"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getBusinessById } from "@/services/api"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Building2, MapPin, Phone } from "lucide-react"

interface Business {
  id: string
  name: string
  address: string
  phone: string
}

export default function BusinessDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadBusiness()
  }, [params.id])

  const loadBusiness = async () => {
    try {
      setLoading(true)
      const data = await getBusinessById(params.id as string)
      setBusiness(data)
    } catch (err: any) {
      setError(err.message || "Error al cargar el negocio")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6 max-w-4xl">
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
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-3xl">{business.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
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
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  )
}
