"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signUp, signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"admin" | "cliente">("cliente")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)

  // Función para verificar periódicamente si el email fue confirmado
  const startEmailVerificationPolling = async (email: string, password: string) => {
    const checkInterval = setInterval(async () => {
      try {
        const loginResult = await signIn(email, password)
        if (loginResult) {
          // Email verificado exitosamente
          clearInterval(checkInterval)
          setShowVerificationMessage(false)
          router.push("/dashboard")
        }
      } catch (error) {
        // Aún no verificado, continúa el polling
        console.log("Esperando verificación de email...")
      }
    }, 3000) // Verificar cada 3 segundos

    // Limpiar el interval después de 5 minutos
    setTimeout(() => {
      clearInterval(checkInterval)
    }, 300000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      const result = await signUp(email, password, name, "", role)
      console.log("SignUp result:", result)
      
      if (result.needsVerification) {
        // Usuario creado pero necesita verificar email
        setShowVerificationMessage(true)
        // Iniciar polling para verificar cuando se confirme el email
        startEmailVerificationPolling(email, password)
      } else {
        // Registro e inicio de sesión exitosos, ir directo al dashboard
        console.log("Account created and logged in:", result)
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          {/* Logo centrado */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <Image
                src="/logo_timely.png"
                alt="Timely Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Timely</CardTitle>
          <CardDescription>Crea tu cuenta para comenzar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Tipo de cuenta</Label>
              <div className="grid grid-cols-1 gap-3">
                {/* Opción Cliente */}
                <div 
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                    role === 'cliente' 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  } ${loading ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => !loading && setRole('cliente')}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 transition-colors ${
                      role === 'cliente' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {role === 'cliente' && (
                        <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-sm ${
                        role === 'cliente' ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        🛍️ Cliente
                      </h3>
                      <p className={`text-xs mt-1 ${
                        role === 'cliente' ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        Explora y reserva citas en negocios disponibles
                      </p>
                    </div>
                  </div>
                </div>

                {/* Opción Admin */}
                <div 
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                    role === 'admin' 
                      ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  } ${loading ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={() => !loading && setRole('admin')}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 transition-colors ${
                      role === 'admin' 
                        ? 'border-indigo-500 bg-indigo-500' 
                        : 'border-gray-300'
                    }`}>
                      {role === 'admin' && (
                        <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-sm ${
                        role === 'admin' ? 'text-indigo-900' : 'text-gray-900'
                      }`}>
                        🏢 Administrador
                      </h3>
                      <p className={`text-xs mt-1 ${
                        role === 'admin' ? 'text-indigo-700' : 'text-gray-600'
                      }`}>
                        Crea y gestiona tu propio negocio
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showVerificationMessage && (
              <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-blue-50 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        🎉 ¡Cuenta creada exitosamente!
                      </h3>
                      <div className="space-y-2 text-sm text-green-700">
                        <p>
                          📧 Hemos enviado un email de verificación a:
                        </p>
                        <p className="font-medium bg-white/50 px-3 py-2 rounded-md border">
                          {email}
                        </p>
                        <div className="flex items-center space-x-2 mt-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          <span className="text-sm">
                            Esperando verificación... Te redirigiremos automáticamente.
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-xs text-yellow-800">
                          💡 <strong>Tip:</strong> Revisa tu bandeja de spam si no ves el email.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button type="submit" className="w-full" disabled={loading || showVerificationMessage}>
              {loading ? "Creando cuenta..." : showVerificationMessage ? "Esperando verificación..." : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
