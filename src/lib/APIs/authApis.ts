import { API_CONFIG } from "../config"
import { storage } from "../storage"
import type { ApiResponse } from "@/types/api"
import type { AuthCredentials, AuthResponse, User } from "@/types/auth"
import type { ForgotPasswordInput, ResetPasswordInput, RegisterInput } from "@/utils/validators"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface RequestOptions extends RequestInit {
  method?: HttpMethod
  auth?: boolean
  signal?: AbortSignal
}

const withTimeout = (timeout = API_CONFIG.timeout) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  return { signal: controller.signal, clear: () => clearTimeout(id) }
}

const buildHeaders = (auth: boolean, extra?: HeadersInit): HeadersInit => {
  const headers: Record<string, string> = {
    ...(API_CONFIG.defaultHeaders as Record<string, string>),
    ...(extra as Record<string, string>),
  }

  if (auth) {
    const token = storage.getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { auth = false, method = "GET", body, ...rest } = options
  const { signal, clear } = withTimeout(options.signal ? undefined : API_CONFIG.timeout)

  try {
    const response = await fetch(`${API_CONFIG.baseURL}${path}`, {
      method,
      headers: buildHeaders(auth, options.headers),
      body,
      signal: options.signal ?? signal,
      ...rest,
    })

    const contentType = response.headers.get("content-type") || ""
    const isJson = contentType.includes("application/json")
    const data = isJson ? await response.json() : null

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: String(response.status),
          message: data?.message || response.statusText,
        },
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    const isAbort = error?.name === "AbortError"
    return {
      success: false,
      error: {
        code: isAbort ? "TIMEOUT" : "NETWORK_ERROR",
        message: isAbort ? "Request timed out" : error?.message || "Network error",
      },
    }
  } finally {
    clear()
  }
}

const persistSession = (payload: AuthResponse) => {
  storage.setToken(payload.token)
  storage.setRefreshToken(payload.refreshToken)
  storage.setUser(payload.user as unknown as Record<string, unknown>)
}

export const authApis = {
  login: async (credentials: AuthCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await request<AuthResponse>("/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (response.success && response.data) {
      persistSession(response.data as AuthResponse)
    }

    return response
  },

  register: async (payload: RegisterInput): Promise<ApiResponse<AuthResponse>> => {
    const response = await request<AuthResponse>("/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    if (response.success && response.data) {
      persistSession(response.data as AuthResponse)
    }

    return response
  },

  refreshToken: async (): Promise<ApiResponse<AuthResponse>> => {
    const refreshToken = storage.getRefreshToken()
    if (!refreshToken) {
      return {
        success: false,
        error: { code: "NO_REFRESH_TOKEN", message: "No refresh token available" },
      }
    }

    const response = await request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })

    if (response.success && response.data) {
      persistSession(response.data as AuthResponse)
    } else {
      storage.clearAll()
    }

    return response
  },

  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await request<{ message: string }>("/logout", {
      method: "POST",
      auth: true,
    })

    storage.clearAll()
    return response
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    return request<User>("/auth/me", {
      method: "GET",
      auth: true,
    })
  },

  forgotPassword: async (payload: ForgotPasswordInput): Promise<ApiResponse<{ message: string }>> => {
    return request<{ message: string }>("/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  resetPassword: async (payload: ResetPasswordInput): Promise<ApiResponse<{ message: string }>> => {
    return request<{ message: string }>("/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },
}
