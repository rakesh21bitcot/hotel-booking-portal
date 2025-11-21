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
  }

  handleError(error: unknown): ErrorResponse {
    console.error("[Error Handler]", error)

    if (error instanceof ApiError) {
      return this.handleApiError(error)
    }

    if (error instanceof Error) {
      return {
        type: "UNKNOWN",
        code: "ERROR",
        message: error.message,
      }
    }

    return {
      type: "UNKNOWN",
      code: "UNKNOWN_ERROR",
      message: this.errorMessages.UNKNOWN_ERROR,
    }
  }

  private handleApiError(error: ApiError): ErrorResponse {
    let type: ErrorType = "UNKNOWN"
    const message = this.errorMessages[error.code] || error.message

    if (error.statusCode === 0) {
      type = "NETWORK"
    } else if (error.statusCode === 401) {
      type = "AUTH"
      // Handle token refresh logic here if needed
    } else if (error.statusCode === 403) {
      type = "AUTH"
    } else if (error.statusCode === 400) {
      type = "VALIDATION"
    } else if (error.statusCode >= 500) {
      type = "SERVER"
    }

    return {
      type,
      code: error.code,
      message,
      statusCode: error.statusCode,
    }
  }

  showToast(error: ErrorResponse, duration = 4000): void {
    toast.error(error.message, { duration })
  }

  logError(error: ErrorResponse, context?: string): void {
    const logData = {
      timestamp: new Date().toISOString(),
      context,
      ...error,
    }

    // In production, send to error tracking service (Sentry, etc.)
    console.error("[Error Log]", JSON.stringify(logData, null, 2))
  }

  handleErrorWithToast(error: unknown, context?: string): ErrorResponse {
    const errorResponse = this.handleError(error)
    this.showToast(errorResponse)
    this.logError(errorResponse, context)
    return errorResponse
  }
}

export const errorHandler = new ErrorHandler()
