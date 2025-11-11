// API service to connect with NestJS backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Debug: Forzar verificación de URL en build
if (typeof window !== 'undefined') {
  console.log('[API CONFIG] API_BASE_URL:', API_BASE_URL);
  console.log('[API CONFIG] process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('[API CONFIG] Build timestamp:', new Date().toISOString());
}

// Función de debug para probar el token
export async function debugToken() {
  const token = localStorage.getItem("access_token")
  console.log("DEBUG TOKEN:")
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
  console.log("[GET BUSINESSES] iniciado")
  console.log("[GET BUSINESSES] API_BASE_URL:", API_BASE_URL)
  
  const headers = await getHeaders()
  console.log("[GET BUSINESSES] Headers enviados:", headers)
  
  const token = localStorage.getItem("access_token")
  console.log("[GET BUSINESSES] Token desde localStorage:", token ? token.substring(0, 100) + "..." : "NO TOKEN")
  
  // NUEVO: Verificar que el token sea válido
  if (!token) {
    console.error("[GET BUSINESSES] NO HAY TOKEN! Usuario no autenticado")
    throw new Error("No authentication token found")
  }
  
  // NUEVO: Log completo de la request
  const url = `${API_BASE_URL}/businesses`
  console.log("[GET BUSINESSES] Haciendo llamada a:", url)
  console.log("[GET BUSINESSES] Request completo:", {
    method: 'GET',
    headers: headers,
    url: url
  })
  
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  })
  
  console.log("[GET BUSINESSES] Response status:", response.status)
  console.log("[GET BUSINESSES] Response statusText:", response.statusText)
  console.log("[GET BUSINESSES] Response ok:", response.ok)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("[GET BUSINESSES] Error response body:", errorText)
    throw new Error(`Failed to fetch businesses: ${response.status} - ${errorText}`)
  }
  
  const data = await response.json()
  console.log("[GET BUSINESSES] Response data:", data)
  console.log("[GET BUSINESSES] Cantidad de negocios:", Array.isArray(data) ? data.length : "No es array")
  
  return data
}

export async function createBusiness(data: {
  name: string
  address: string  // Corregido: adress -> address
  phone: string
  info?: string
}) {
  console.log("[CREATE BUSINESS] iniciado")
  console.log("[CREATE BUSINESS] Data enviada:", data)
  
  const headers = await getHeaders()
  console.log("[CREATE BUSINESS] Headers:", headers)
  
  const response = await fetch(`${API_BASE_URL}/businesses`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
  
  console.log("[CREATE BUSINESS] Response status:", response.status)
  console.log("[CREATE BUSINESS] Response ok:", response.ok)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("[CREATE BUSINESS] Error creating business:", errorText)
    throw new Error(`Failed to create business: ${response.status} - ${errorText}`)
  }
  
  const result = await response.json()
  console.log("[CREATE BUSINESS] Business created:", result)
  return result
}

// Nueva función: Obtener MIS negocios (como admin)
export async function getMyBusinesses() {
  console.log("[GET MY BUSINESSES] iniciado")
  
  const headers = await getHeaders()
  const token = localStorage.getItem("access_token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  // Decodificar token para obtener el user ID
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error("Invalid token format")
  }
  
  const payload = JSON.parse(atob(parts[1]))
  const userId = payload.sub
  
  console.log("[GET MY BUSINESSES] User ID:", userId)
  
  const response = await fetch(`${API_BASE_URL}/businesses/admin/${userId}`, {
    method: 'GET',
    headers: headers,
  })
  
  console.log("[GET MY BUSINESSES] Response status:", response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("[GET MY BUSINESSES] Error fetching my businesses:", errorText)
    throw new Error(`Failed to fetch my businesses: ${response.status} - ${errorText}`)
  }
  
  const data = await response.json()
  console.log("[GET MY BUSINESSES] My businesses:", data)
  return data
}

// Auth API calls
export async function register(data: {
  name: string
  email: string
  password: string
  phone?: string
  role?: "admin" | "cliente"
}) {
  console.log("[REGISTER] iniciado")
  console.log("[REGISTER] Datos enviados:", JSON.stringify(data, null, 2))
  console.log("[REGISTER] URL completa:", `${API_BASE_URL}/auth/register`)
  console.log("[REGISTER] API_BASE_URL:", API_BASE_URL)
  
  // Verificar que tenemos todos los datos necesarios
  if (!data.email || !data.password || !data.name) {
    throw new Error("Faltan campos obligatorios: email, password, name")
  }
  
  const requestBody = JSON.stringify(data)
  console.log("[REGISTER] Request body:", requestBody)
  
  const headers = { "Content-Type": "application/json" }
  console.log("[REGISTER] Headers:", headers)
  
  try {
    console.log("[REGISTER] Haciendo fetch...")
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST", 
      headers: headers,
      body: requestBody,
    })
    
    console.log("[REGISTER] Response recibido:")
    console.log("  - Status:", response.status)
    console.log("  - StatusText:", response.statusText)
    console.log("  - OK:", response.ok)
    console.log("  - Headers:", Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[REGISTER] Error response body:", errorText)
      console.error("[REGISTER] Error status:", response.status)
      
      // Intentar parsear el error como JSON
      try {
        const errorJson = JSON.parse(errorText)
        console.error("[REGISTER] Error JSON:", errorJson)
      } catch (e) {
        console.error("[REGISTER] Error no es JSON válido")
      }
      
      throw new Error(`Registration failed: ${response.status} - ${errorText}`)
    }
    
    const result = await response.json()
    console.log("[REGISTER] Registro exitoso:", result)
    return result
    
  } catch (networkError: any) {
    console.error("[REGISTER] Network/Fetch Error:", networkError)
    console.error("[REGISTER] Error type:", networkError?.constructor?.name || 'Unknown')
    console.error("[REGISTER] Error message:", networkError?.message || 'No message')
    
    // Si es un error de red, dar más información
    if (networkError?.message?.includes('fetch')) {
      console.error("[REGISTER] Posible problema de CORS o conectividad")
      console.error("[REGISTER] Verifica que el backend esté corriendo en:", API_BASE_URL)
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

// Actualizar un negocio
export async function updateBusiness(businessId: string, data: {
  name?: string
  address?: string
  phone?: string
  info?: string
}) {
  console.log("UPDATE BUSINESS")
  console.log("Business ID:", businessId)
  console.log("Update data:", data)
  
  const headers = await getHeaders()
  const token = localStorage.getItem("access_token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  console.log("URL:", `${API_BASE_URL}/businesses/${businessId}`)
  
  const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(data),
  })
  
  console.log("Response status:", response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("Error updating business:", errorText)
    throw new Error(`Failed to update business: ${response.status} - ${errorText}`)
  }
  
  const result = await response.json()
  console.log("Business updated:", result)
  return result
}

// Eliminar un negocio
export async function deleteBusiness(businessId: string) {
  console.log("DELETE BUSINESS")
  console.log("Business ID:", businessId)
  
  const headers = await getHeaders()
  const token = localStorage.getItem("access_token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  console.log("URL:", `${API_BASE_URL}/businesses/${businessId}`)
  
  const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
    method: "DELETE",
    headers: headers,
  })
  
  console.log("Response status:", response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("Error deleting business:", errorText)
    throw new Error(`Failed to delete business: ${response.status} - ${errorText}`)
  }
  
  console.log("Business deleted successfully")
  return { success: true }
}

// Appointments API calls
export async function createAppointment(scheduleId: string) {
  console.log('[CREATE APPOINTMENT] Schedule ID:', scheduleId)
  
  const response = await fetch(`${API_BASE_URL}/appointments/schedule/${scheduleId}`, {
    method: "POST",
    headers: await getHeaders(),
  })
  
  console.log('[CREATE APPOINTMENT] Response status:', response.status)
  
  if (!response.ok) {
    const error = await response.json()
    console.error('[CREATE APPOINTMENT] Error:', error)
    throw new Error(error.message || "Failed to create appointment")
  }
  
  const data = await response.json()
  console.log('[CREATE APPOINTMENT] Success:', data)
  return data
}

// User Profile API calls
export async function getCurrentUserProfile() {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: await getHeaders(),
  })
  if (!response.ok) throw new Error("Failed to fetch user profile")
  return response.json()
}

export async function getUserById(userId: string) {
  console.log("GET USER BY ID")
  console.log("User ID:", userId)
  
  const headers = await getHeaders()
  const token = localStorage.getItem("access_token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  console.log("URL:", `${API_BASE_URL}/users/${userId}`)
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "GET",
    headers: headers,
  })
  
  console.log("Response status:", response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("Error getting user:", errorText)
    throw new Error(`Failed to get user: ${response.status} - ${errorText}`)
  }
  
  const result = await response.json()
  console.log("User data:", result)
  return result
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

// Schedules API calls
export async function createSchedule(businessId: string, data: {
  date: string
  start_time: string
  end_time: string
  available: boolean
}) {
  console.log("[CREATE SCHEDULE] iniciado")
  console.log("[CREATE SCHEDULE] Business ID:", businessId)
  console.log("[CREATE SCHEDULE] Schedule data:", data)
  
  const headers = await getHeaders()
  const token = localStorage.getItem("access_token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  console.log("[CREATE SCHEDULE] Headers:", headers)
  console.log("[CREATE SCHEDULE] URL:", `${API_BASE_URL}/schedules/business/${businessId}`)
  
  const response = await fetch(`${API_BASE_URL}/schedules/business/${businessId}`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
  
  console.log("[CREATE SCHEDULE] Response status:", response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("[CREATE SCHEDULE] Error creating schedule:", errorText)
    throw new Error(`Failed to create schedule: ${response.status} - ${errorText}`)
  }
  
  const result = await response.json()
  console.log("[CREATE SCHEDULE] Schedule created:", result)
  return result
}

// Obtener horarios de un negocio
export async function getSchedules(businessId: string, date?: string) {
  console.log("[GET SCHEDULES] iniciado")
  console.log("[GET SCHEDULES] Business ID:", businessId)
  console.log("[GET SCHEDULES] Date filter:", date || "none")
  
  let url = `${API_BASE_URL}/schedules/business/${businessId}`
  if (date) {
    url += `?date=${date}`
  }
  
  console.log("[GET SCHEDULES] URL:", url)
  
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  
  console.log("[GET SCHEDULES] Response status:", response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("[GET SCHEDULES] Error getting schedules:", errorText)
    throw new Error(`Failed to get schedules: ${response.status} - ${errorText}`)
  }
  
  const result = await response.json()
  console.log("[GET SCHEDULES] Schedules found:", result.length)
  return result
}

// Actualizar un horario
export async function updateSchedule(scheduleId: string, data: {
  date?: string
  start_time?: string
  end_time?: string
  available?: boolean
}) {
  console.log("[UPDATE SCHEDULE] iniciado")
  console.log("[UPDATE SCHEDULE] Schedule ID:", scheduleId)
  console.log("[UPDATE SCHEDULE] Update data:", data)
  
  const headers = await getHeaders()
  const token = localStorage.getItem("access_token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  console.log("[UPDATE SCHEDULE] URL:", `${API_BASE_URL}/schedules/${scheduleId}`)
  
  const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(data),
  })
  
  console.log("[UPDATE SCHEDULE] Response status:", response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("[UPDATE SCHEDULE] Error updating schedule:", errorText)
    throw new Error(`Failed to update schedule: ${response.status} - ${errorText}`)
  }
  
  const result = await response.json()
  console.log("[UPDATE SCHEDULE] Schedule updated:", result)
  return result
}

// Eliminar un horario
export async function deleteSchedule(scheduleId: string) {
  console.log("[DELETE SCHEDULE] iniciado")
  console.log("[DELETE SCHEDULE] Schedule ID:", scheduleId)
  
  const headers = await getHeaders()
  const token = localStorage.getItem("access_token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  console.log("[DELETE SCHEDULE] URL:", `${API_BASE_URL}/schedules/${scheduleId}`)
  
  const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
    method: "DELETE",
    headers: headers,
  })
  
  console.log("[DELETE SCHEDULE] Response status:", response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error("[DELETE SCHEDULE] Error deleting schedule:", errorText)
    throw new Error(`Failed to delete schedule: ${response.status} - ${errorText}`)
  }
  
  console.log("[DELETE SCHEDULE] Schedule deleted")
  return { success: true }
}
