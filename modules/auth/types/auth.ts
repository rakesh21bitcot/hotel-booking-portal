export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: "user" | "admin"
}
