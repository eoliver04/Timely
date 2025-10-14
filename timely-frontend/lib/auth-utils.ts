// Utility to check if user is authenticated
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('access_token', token)
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('access_token')
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export function getUserRole(): string | null {
  const user = getUserFromToken()
  return user?.user_metadata?.role || user?.role || null
}

export function isAdmin(): boolean {
  return getUserRole() === 'admin'
}

export function isCliente(): boolean {
  return getUserRole() === 'cliente'
}

// Decode JWT token to get user info (simple version)
export function getUserFromToken(): any {
  const token = getAuthToken()
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}