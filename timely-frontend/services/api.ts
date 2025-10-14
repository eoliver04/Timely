// API service to connect with NestJS backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Función de debug para probar el token
export async function debugToken() {
  const token = localStorage.getItem("access_token")
  console.log("🔍 DEBUG TOKEN:")
  console.log("- Token exists:", !!token)
  console.log("- Token length:", token?.length || 0)
  console.log("- Token starts with:", token?.substring(0, 20) || "N/A")
  
  if (token) {
    try {
      // Intentar decodificar el JWT (solo la parte payload)
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        console.log("- JWT payload:", payload)
        console.log("- Token expires at:", new Date(payload.exp * 1000))
        console.log("- Token is expired:", Date.now() > payload.exp * 1000)
      }
    } catch (e) {
      console.error("- Error decoding token:", e)
    }
  }
}

// Helper to get headers with authorization
async function getHeaders() {
  const token = localStorage.getItem("access_token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Business API calls
export async function getBusinesses() {
  console.log("🏢 === DEBUGGING GET BUSINESSES ===")
  console.log("📍 API_BASE_URL:", API_BASE_URL)
  
  const headers = await getHeaders()
  console.log("📝 Headers enviados:", headers)
  
  const token = localStorage.getItem("access_token")
  console.log("🔑 Token raw desde localStorage:", token ? token.substring(0, 100) + "..." : "NO TOKEN")
  
  // NUEVO: Verificar que el token sea válido
  if (!token) {
    console.error("❌ NO HAY TOKEN! Usuario no autenticado")
    throw new Error("No authentication token found")
  }
  
  // NUEVO: Log completo de la request
  const url = `${API_BASE_URL}/businesses`
  console.log("🚀 Haciendo llamada a:", url)
  console.log("📋 Request completo:", {
    method: 'GET',
    headers: headers,
    url: url
  })
  
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  })
  
  console.log("📊 Response status:", response.status)
  console.log("📊 Response statusText:", response.statusText)
  console.log("📊 Response ok:", response.ok)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ Error response body:", errorText)
    throw new Error(`Failed to fetch businesses: ${response.status} - ${errorText}`)
  }
  
  const data = await response.json()
  console.log("✅ Response data:", data)
  console.log("📊 Cantidad de negocios:", Array.isArray(data) ? data.length : "No es array")
  
  return data
}

export async function createBusiness(data: {
  name: string
  adress: string  // Nota: tu backend usa 'adress' no 'address'
  phone: string
  info?: string
}) {
  const response = await fetch(`${API_BASE_URL}/businesses`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create business")
  return response.json()
}

// Auth API calls
export async function register(data: {
  name: string
  email: string
  password: string
  phone?: string
  role?: "admin" | "cliente"
}) {
  console.log("🚀 === INICIO REGISTRO FRONTEND ===")
  console.log("📋 Datos enviados:", JSON.stringify(data, null, 2))
  console.log("📍 URL completa:", `${API_BASE_URL}/auth/register`)
  console.log("🌐 API_BASE_URL:", API_BASE_URL)
  
  // Verificar que tenemos todos los datos necesarios
  if (!data.email || !data.password || !data.name) {
    throw new Error("Faltan campos obligatorios: email, password, name")
  }
  
  const requestBody = JSON.stringify(data)
  console.log("📤 Request body:", requestBody)
  
  const headers = { "Content-Type": "application/json" }
  console.log("📝 Headers:", headers)
  
  try {
    console.log("🌐 Haciendo fetch...")
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST", 
      headers: headers,
      body: requestBody,
    })
    
    console.log("📊 Response recibido:")
    console.log("  - Status:", response.status)
    console.log("  - StatusText:", response.statusText)
    console.log("  - OK:", response.ok)
    console.log("  - Headers:", Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Error response body:", errorText)
      console.error("❌ Error status:", response.status)
      
      // Intentar parsear el error como JSON
      try {
        const errorJson = JSON.parse(errorText)
        console.error("❌ Error JSON:", errorJson)
      } catch (e) {
        console.error("❌ Error no es JSON válido")
      }
      
      throw new Error(`Registration failed: ${response.status} - ${errorText}`)
    }
    
    const result = await response.json()
    console.log("✅ Registro exitoso:", result)
    console.log("🚀 === FIN REGISTRO FRONTEND ===")
    return result
    
  } catch (networkError: any) {
    console.error("🔥 Network/Fetch Error:", networkError)
    console.error("🔥 Error type:", networkError?.constructor?.name || 'Unknown')
    console.error("🔥 Error message:", networkError?.message || 'No message')
    
    // Si es un error de red, dar más información
    if (networkError?.message?.includes('fetch')) {
      console.error("🔥 Posible problema de CORS o conectividad")
      console.error("🔥 Verifica que el backend esté corriendo en:", API_BASE_URL)
    }
    
    throw networkError
  }
}

export async function login(data: {
  email: string
  password: string
}) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to login")
  const result = await response.json()
  
  // Guardar el token en localStorage
  if (result.session?.access_token) {
    localStorage.setItem("access_token", result.session.access_token)
  }
  
  return result
}

export async function getBusinessById(id: string) {
  const response = await fetch(`${API_BASE_URL}/businesses/${id}`, {
    headers: await getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to fetch business")
  return response.json()
}

// Appointments API calls
export async function getAppointments() {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    headers: await getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to fetch appointments")
  return response.json()
}

export async function createAppointment(data: {
  businessId: string
  date: string
  time: string
  service: string
}) {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create appointment")
  return response.json()
}

export async function deleteAppointment(id: string) {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: "DELETE",
    headers: await getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to delete appointment")
  return response.json()
}

// User Profile API calls
export async function getCurrentUserProfile() {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: await getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to fetch user profile")
  return response.json()
}

export async function updateUserProfile(data: {
  name?: string
  phone?: string
  role?: "admin" | "cliente"
}) {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update user profile")
  return response.json()
}
