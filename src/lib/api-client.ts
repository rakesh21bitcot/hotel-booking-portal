import type { ApiResponse } from "@/types/api"
import { API_CONFIG } from "./config"

/**
 * Custom API Error class for handling API errors
 */
export class ApiError extends Error {
  code: string
  statusCode: number
  details?: Record<string, unknown>
  response?: Response

  constructor(
    message: string,
    code: string = "API_ERROR",
    statusCode: number = 500,
    details?: Record<string, unknown>,
    response?: Response
  ) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.response = response

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  static fromResponse(response: Response, data?: unknown): ApiError {
    const statusCode = response.status
    let code = "API_ERROR"
    let message = `API request failed with status ${statusCode}`

    if (data && typeof data === "object") {
      const apiData = data as { error?: { code?: string; message?: string }; message?: string }
      code = apiData.error?.code || `HTTP_${statusCode}`
      message = apiData.error?.message || apiData.message || message
    }

    // Map HTTP status codes to error codes
    if (statusCode === 400) code = "VALIDATION_ERROR"
    else if (statusCode === 401) code = "AUTH_ERROR"
    else if (statusCode === 403) code = "UNAUTHORIZED"
    else if (statusCode === 404) code = "NOT_FOUND"
    else if (statusCode >= 500) code = "SERVER_ERROR"
    else if (statusCode === 0) code = "NETWORK_ERROR"

    return new ApiError(message, code, statusCode, data as Record<string, unknown>, response)
  }

  static fromNetworkError(error: Error): ApiError {
    return new ApiError(
      "Network connection failed. Please check your internet connection.",
      "NETWORK_ERROR",
      0,
      { originalError: error.message }
    )
  }

  static fromTimeoutError(): ApiError {
    return new ApiError("Request timeout. Please try again.", "TIMEOUT_ERROR", 408)
  }
}

/**
 * Request configuration options
 */
export interface RequestConfig extends RequestInit {
  timeout?: number
  baseURL?: string
  headers?: HeadersInit
}

/**
 * API Client class for making HTTP requests with error handling
 */
class ApiClient {
  private baseURL: string = API_CONFIG.baseURL
  private defaultTimeout: number = 30000 // 30 seconds
  private defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  }

  constructor(baseURL?: string) {
    if (baseURL) {
      this.baseURL = baseURL
    }
  }

  /**
   * Set default headers
   */
  setHeaders(headers: HeadersInit): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers }
  }

  /**
   * Get authorization token from cookies or storage
   */
  private getAuthToken(): string | null {
    if (typeof document === "undefined") return null

    // Try to get from cookies
    const cookies = document.cookie.split(";")
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("auth_token="))
    if (tokenCookie) {
      return tokenCookie.split("=")[1]?.trim() || null
    }

    // Try to get from localStorage (if using access_token)
    try {
      const accessToken = localStorage.getItem("auth_token")
      return accessToken
    } catch {
      return null
    }
  }

  /**
   * Build request headers with auth token
   */
  private buildHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers = new Headers(this.defaultHeaders)

    // Add auth token if available
    const token = this.getAuthToken()
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    // Merge custom headers
    if (customHeaders) {
      const customHeadersObj = customHeaders instanceof Headers ? customHeaders : new Headers(customHeaders)
      customHeadersObj.forEach((value, key) => {
        headers.set(key, value)
      })
    }

    return headers
  }

  /**
   * Create a timeout promise
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(ApiError.fromTimeoutError())
      }, timeout)
    })
  }

  /**
   * Make a fetch request with timeout and error handling
   */
  private async fetchWithTimeout(
    url: string,
    config: RequestConfig = {}
  ): Promise<Response> {
    const { timeout = this.defaultTimeout, ...fetchConfig } = config

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await Promise.race([
        fetch(url, {
          ...fetchConfig,
          signal: controller.signal,
        }),
        this.createTimeoutPromise(timeout),
      ])

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === "AbortError" || error.message.includes("timeout")) {
          throw ApiError.fromTimeoutError()
        }
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          throw ApiError.fromNetworkError(error)
        }
      }

      throw ApiError.fromNetworkError(error as Error)
    }
  }

  /**
   * Parse response and handle errors
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type")

    let data: unknown
    try {
      if (contentType?.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        data = text ? { message: text } : {}
      }
    } catch (error) {
      data = { message: "Failed to parse response" }
    }

    // If response is not ok, throw ApiError
    if (!response.ok) {
      throw ApiError.fromResponse(response, data)
    }

    // Return parsed response
    return data as ApiResponse<T>
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers = this.buildHeaders(config.headers)
    console.log(this.baseURL, url)
    try {
      const response = await this.fetchWithTimeout(url, {
        ...config,
        method: "GET",
        headers,
      })

      return this.parseResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw ApiError.fromNetworkError(error as Error)
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: unknown, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers = this.buildHeaders(config.headers)

    try {
      const response = await this.fetchWithTimeout(url, {
        ...config,
        method: "POST",
        headers,
        body: data ? JSON.stringify(data) : undefined,
      })

      return this.parseResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw ApiError.fromNetworkError(error as Error)
    }
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: unknown, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers = this.buildHeaders(config.headers)

    try {
      const response = await this.fetchWithTimeout(url, {
        ...config,
        method: "PUT",
        headers,
        body: data ? JSON.stringify(data) : undefined,
      })

      return this.parseResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw ApiError.fromNetworkError(error as Error)
    }
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers = this.buildHeaders(config.headers)

    try {
      const response = await this.fetchWithTimeout(url, {
        ...config,
        method: "PATCH",
        headers,
        body: data ? JSON.stringify(data) : undefined,
      })

      return this.parseResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw ApiError.fromNetworkError(error as Error)
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers = this.buildHeaders(config.headers)

    try {
      const response = await this.fetchWithTimeout(url, {
        ...config,
        method: "DELETE",
        headers,
      })

      return this.parseResponse<T>(response)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw ApiError.fromNetworkError(error as Error)
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export for custom instances
export { ApiClient }

