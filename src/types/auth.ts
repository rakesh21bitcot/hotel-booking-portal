export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: "user" | "admin"
  createdAt: string
  updatedAt: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}
