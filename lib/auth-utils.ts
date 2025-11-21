import { storage } from "./storage"

export const authUtils = {
  // Save auth tokens
  saveAuthTokens: (token: string, refreshToken: string) => {
    storage.setToken(token)
    storage.setRefreshToken(refreshToken)

    // Also set in cookies for middleware
    if (typeof document !== "undefined") {
      document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`
      document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}`
    }
  },

  // Get auth tokens
  getAuthTokens: () => ({
    token: storage.getToken(),
    refreshToken: storage.getRefreshToken(),
  }),

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = storage.getToken()
    return !!token
  },

  // Clear auth data
  clearAuth: () => {
    storage.clearAll()

    // Clear cookies
    if (typeof document !== "undefined") {
      document.cookie = "auth_token=; path=/; max-age=0"
      document.cookie = "refresh_token=; path=/; max-age=0"
    }
  },

  // Parse JWT token
  parseToken: (token: string): Record<string, unknown> | null => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch {
      return null
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    const payload = authUtils.parseToken(token)
    if (!payload || !payload.exp) return true
    return Date.now() >= (payload.exp as number) * 1000
  },
}
