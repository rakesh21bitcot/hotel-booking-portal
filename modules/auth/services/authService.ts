import { api } from "@/lib/api-client"
import type { AuthUser, LoginRequest, RegisterRequest } from "../types"

interface LoginResponse {
  user: AuthUser
  token: string
  refreshToken: string
}

interface RegisterResponse {
  user: AuthUser
  token: string
  refreshToken: string
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/login", credentials)
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>("/auth/register", data)
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout")
  },

  refreshToken: async (token: string): Promise<{ token: string }> => {
    return api.post("/auth/refresh", { refreshToken: token })
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    return api.get<AuthUser>("/auth/me")
  },

  resetPassword: async (email: string): Promise<{ message: string }> => {
    return api.post("/auth/forgot-password", { email })
  },

  updatePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post("/auth/change-password", { oldPassword, newPassword })
  },
}
