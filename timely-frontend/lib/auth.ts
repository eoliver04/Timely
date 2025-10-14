import { register, login } from "@/services/api"

export async function signUp(email: string, password: string, name: string, phone?: string, role?: "admin" | "cliente") {
  try {
    // 1. Crear la cuenta
    console.log("Creating account for:", email)
    const registerData = await register({
      email,
      password,
      name,
      phone,
      role: role || "cliente"
    })
    console.log("Account created successfully:", registerData)
    
    // 2. Esperar un poco para asegurar que el usuario esté en la DB
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 3. Iniciar sesión automáticamente
    console.log("Attempting automatic login...")
    try {
      const loginData = await login({
        email,
        password
      })
      console.log("Auto-login successful:", loginData)
      return {
        register: registerData,
        login: loginData
      }
    } catch (loginError) {
      console.log("Auto-login failed, probably needs email verification")
      // Si el login falla, probablemente necesita verificar email
      return {
        register: registerData,
        needsVerification: true,
        message: "Cuenta creada exitosamente. Por favor verifica tu email antes de iniciar sesión."
      }
    }
    

  } catch (error) {
    console.error("SignUp error:", error)
    throw new Error(error instanceof Error ? error.message : 'Error creating account')
  }
}

export async function signIn(email: string, password: string) {
  try {
    const data = await login({
      email,
      password
    })
    
    return data
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error signing in')
  }
}

export async function signOut() {
  // Simplemente remover el token del localStorage
  localStorage.removeItem("access_token")
  
  // Redireccionar a la página de login
  window.location.href = "/login"
}

export function getCurrentUser() {
  const token = localStorage.getItem("access_token")
  return token ? { hasToken: true } : null
}

export function isAuthenticated() {
  return !!localStorage.getItem("access_token")
}
