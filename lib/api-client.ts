interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

interface RequestOptions extends RequestInit {
  timeout?: number
}

const DEFAULT_TIMEOUT = 30000

export class ApiError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiCall<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    const url = `${baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.error?.code || "UNKNOWN_ERROR",
        response.status,
        data.error?.message || `API Error: ${response.statusText}`,
      )
    }

    return data.data || data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiError("NETWORK_ERROR", 0, "Network request failed")
    }

    throw new ApiError("UNKNOWN_ERROR", 500, "An unexpected error occurred")
  } finally {
    clearTimeout(timeoutId)
  }
}

// Convenience methods
export const api = {
  get: <T,>(endpoint: string, options?: RequestOptions) => apiCall<T>(endpoint, { ...options, method: "GET" }),

  post: <T,>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiCall<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T,>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiCall<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T,>(endpoint: string, options?: RequestOptions) => apiCall<T>(endpoint, { ...options, method: "DELETE" }),

  patch: <T,>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiCall<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
}
