import { ApiError } from "./api-client"
import { toast } from "sonner"

export type ErrorType = "NETWORK" | "VALIDATION" | "AUTH" | "SERVER" | "UNKNOWN"

export interface ErrorResponse {
  type: ErrorType
  code: string
  message: string
  details?: Record<string, unknown>
  statusCode?: number
}

class ErrorHandler {
  private errorMessages: Record<string, string> = {
    NETWORK_ERROR: "Network connection failed. Please check your internet.",
    TIMEOUT_ERROR: "Request timeout. Please try again.",
    VALIDATION_ERROR: "Please check your input and try again.",
    AUTH_ERROR: "Authentication failed. Please login again.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    FORBIDDEN: "Access denied.",
    NOT_FOUND: "Resource not found.",
    SERVER_ERROR: "Server error. Please try again later.",
    UNKNOWN_ERROR: "An unexpected error occurred.",
    HTTP_400: "Invalid request. Please check your input.",
    HTTP_401: "Authentication required. Please login again.",
    HTTP_403: "Access denied. You don't have permission.",
    HTTP_404: "Resource not found.",
    HTTP_500: "Internal server error. Please try again later.",
    HTTP_502: "Bad gateway. The server is temporarily unavailable.",
    HTTP_503: "Service unavailable. Please try again later.",
    HTTP_504: "Gateway timeout. The server took too long to respond.",
  }

  /**
   * Handle any error and convert it to ErrorResponse
   */
  handleError(error: unknown): ErrorResponse {
    console.error("[Error Handler]", error)

    // Handle ApiError instances
    if (error instanceof ApiError) {
      return this.handleApiError(error)
    }

    // Handle standard Error instances
    if (error instanceof Error) {
      // Check for network-related errors
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        return {
          type: "NETWORK",
          code: "NETWORK_ERROR",
          message: this.errorMessages.NETWORK_ERROR,
          details: { originalError: error.message },
        }
      }

      // Check for timeout errors
      if (error.message.includes("timeout") || error.message.includes("aborted")) {
        return {
          type: "NETWORK",
          code: "TIMEOUT_ERROR",
          message: this.errorMessages.TIMEOUT_ERROR,
          details: { originalError: error.message },
        }
      }

      return {
        type: "UNKNOWN",
        code: "ERROR",
        message: error.message || this.errorMessages.UNKNOWN_ERROR,
        details: { originalError: error.message },
      }
    }

    // Handle string errors
    if (typeof error === "string") {
      return {
        type: "UNKNOWN",
        code: "ERROR",
        message: error,
      }
    }

    // Handle unknown error types
    return {
      type: "UNKNOWN",
      code: "UNKNOWN_ERROR",
      message: this.errorMessages.UNKNOWN_ERROR,
      details: { error },
    }
  }

  /**
   * Handle API-specific errors
   */
  private handleApiError(error: ApiError): ErrorResponse {
    let type: ErrorType = "UNKNOWN"
    let message = error.message

    // Determine error type based on status code
    if (error.statusCode === 0) {
      type = "NETWORK"
      message = this.errorMessages.NETWORK_ERROR
    } else if (error.statusCode === 400) {
      type = "VALIDATION"
      message = this.errorMessages.VALIDATION_ERROR || error.message
    } else if (error.statusCode === 401) {
      type = "AUTH"
      message = this.errorMessages.AUTH_ERROR || this.errorMessages.HTTP_401
      // Handle token refresh logic here if needed
      this.handleTokenExpiry()
    } else if (error.statusCode === 403) {
      type = "AUTH"
      message = this.errorMessages.UNAUTHORIZED || this.errorMessages.HTTP_403
    } else if (error.statusCode === 404) {
      type = "UNKNOWN"
      message = this.errorMessages.NOT_FOUND || this.errorMessages.HTTP_404
    } else if (error.statusCode >= 500) {
      type = "SERVER"
      message = this.errorMessages.SERVER_ERROR || this.errorMessages[`HTTP_${error.statusCode}`] || error.message
    } else {
      // For other status codes, try to get a specific message
      message = this.errorMessages[`HTTP_${error.statusCode}`] || this.errorMessages[error.code] || error.message
    }

    return {
      type,
      code: error.code,
      message,
      statusCode: error.statusCode,
      details: error.details,
    }
  }

  /**
   * Handle token expiry - redirect to login if needed
   */
  private handleTokenExpiry(): void {
    if (typeof window !== "undefined") {
      // Clear auth tokens
      try {
        localStorage.removeItem("elitestay_token")
        localStorage.removeItem("elitestay_refresh_token")
        localStorage.removeItem("elitestay_user")
      } catch {
        // Ignore storage errors
      }

      // Clear cookies
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

      // Optionally redirect to login (uncomment if needed)
      // window.location.href = "/login"
    }
  }

  /**
   * Show error toast notification
   */
  showToast(error: ErrorResponse, duration = 4000): void {
    toast.error(error.message, {
      duration,
      description: error.details ? JSON.stringify(error.details) : undefined,
    })
  }

  /**
   * Log error for debugging and monitoring
   */
  logError(error: ErrorResponse, context?: string): void {
    const logData = {
      timestamp: new Date().toISOString(),
      context,
      ...error,
    }

    // In production, send to error tracking service (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error)
      // Example: LogRocket.captureException(error)
    }

    console.error("[Error Log]", JSON.stringify(logData, null, 2))
  }

  /**
   * Handle error and show toast notification
   */
  handleErrorWithToast(error: unknown, context?: string): ErrorResponse {
    const errorResponse = this.handleError(error)
    this.showToast(errorResponse)
    this.logError(errorResponse, context)
    return errorResponse
  }

  /**
   * Handle API call with automatic error handling
   */
  async handleApiCall<T>(
    apiCall: () => Promise<T>,
    context?: string,
    showToast: boolean = true
  ): Promise<T | null> {
    try {
      return await apiCall()
    } catch (error) {
      const errorResponse = this.handleError(error)
      if (showToast) {
        this.showToast(errorResponse)
      }
      this.logError(errorResponse, context)
      return null
    }
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.statusCode === 0 || error.code === "NETWORK_ERROR"
    }
    if (error instanceof Error) {
      return error.message.includes("Failed to fetch") || error.message.includes("NetworkError")
    }
    return false
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.statusCode === 401 || error.statusCode === 403 || error.code === "AUTH_ERROR"
    }
    return false
  }

  /**
   * Check if error is a validation error
   */
  isValidationError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.statusCode === 400 || error.code === "VALIDATION_ERROR"
    }
    return false
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error: unknown): string {
    const errorResponse = this.handleError(error)
    return errorResponse.message
  }
}

export const errorHandler = new ErrorHandler()
