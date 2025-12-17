export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: "user" | "admin"
  createdAt: string
  updatedAt: string
  phone: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  data: {
    user: Profile
    token: string
    refreshToken: string
  }
}

interface Profile {
  profile: User
}