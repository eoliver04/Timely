"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Building2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 text-balance">
            Gestiona tu negocio con <span className="text-primary">Timely</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            La plataforma completa para administrar tus negocios y reservas de manera eficiente y profesional
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/register")} className="text-lg px-8">
              Comenzar Gratis
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/login")} className="text-lg px-8">
              Iniciar Sesión
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestión de Negocios</h3>
            <p className="text-gray-600">
              Administra múltiples negocios desde un solo lugar con toda la información centralizada
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sistema de Reservas</h3>
            <p className="text-gray-600">Programa y gestiona citas de manera sencilla con recordatorios automáticos</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ahorra Tiempo</h3>
            <p className="text-gray-600">Optimiza tu tiempo con herramientas diseñadas para la eficiencia</p>
          </div>
        </div>
      </div>
    </div>
  )
}
