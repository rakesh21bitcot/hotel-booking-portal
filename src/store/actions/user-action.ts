import { apiClient } from "@/lib/api-client"
import { errorHandler } from "@/lib/error-handler"
import { User } from "@/types"
import { AppDispatch } from "@/store"
import { CartHotel, BookingItem, addToCart, removeFromCart, addBooking, cancelBooking } from "../reducers/userReducer"

// ============================================
// GET METHOD EXAMPLES
// ============================================

export const getUserDetails = async () => {
    try {
        const response = await apiClient.get<User>("/api/users/1")
        if (response.success && response.data) {
            // Handle success
            return response.data
        }
    } catch (error) {
        errorHandler.handleErrorWithToast(error, "Fetch User")
        throw error
    }
}

// Or use the wrapper
export const getUserDetailsWithWrapper = async () => {
    const user = await errorHandler.handleApiCall(
        () => apiClient.get<User>("/api/users/1"),
        "Fetch User"
    )
    return user
}

// ============================================
// POST METHOD EXAMPLES
// ============================================

/**
 * Example 1: Basic POST request with data
 */
export const createUser = async (userData: { name: string; email: string }) => {
    try {
        const response = await apiClient.post<User>("/api/users", userData)
        
        if (response.success && response.data) {
            // Handle success
            return response.data
        } else {
            throw new Error(response.error?.message || "Failed to create user")
        }
    } catch (error) {
        errorHandler.handleErrorWithToast(error, "Create User")
        throw error
    }
}

/**
 * Example 2: POST request with error handling wrapper
 */
export const createUserWithWrapper = async (userData: { name: string; email: string }) => {
    const user = await errorHandler.handleApiCall(
        () => apiClient.post<User>("/api/users", userData),
        "Create User"
    )
    return user
}

/**
 * Example 3: POST request with custom headers
 */
export const createUserWithCustomHeaders = async (userData: { name: string; email: string }) => {
    try {
        const response = await apiClient.post<User>(
            "/api/users",
            userData,
            {
                headers: {
                    "X-Custom-Header": "custom-value",
                    "Authorization": "Bearer custom-token"
                }
            }
        )
        
        if (response.success && response.data) {
            return response.data
        }
    } catch (error) {
        errorHandler.handleErrorWithToast(error, "Create User")
        throw error
    }
}

/**
 * Example 4: POST request with timeout
 */
export const createUserWithTimeout = async (userData: { name: string; email: string }) => {
    try {
        const response = await apiClient.post<User>(
            "/api/users",
            userData,
            {
                timeout: 10000 // 10 seconds
            }
        )
        
        if (response.success && response.data) {
            return response.data
        }
    } catch (error) {
        errorHandler.handleErrorWithToast(error, "Create User")
        throw error
    }
}

/**
 * Example 5: POST request for booking
 */
interface BookingData {
    hotelId: string
    checkIn: string
    checkOut: string
    guests: number
    rooms: number
}

interface BookingResponse {
    bookingId: string
    status: string
    totalAmount: number
}

export const createBooking = async (bookingData: BookingData) => {
    try {
        const response = await apiClient.post<BookingResponse>(
            "/api/bookings",
            bookingData
        )
        
        if (response.success && response.data) {
            return response.data
        } else {
            throw new Error(response.error?.message || "Failed to create booking")
        }
    } catch (error) {
        errorHandler.handleErrorWithToast(error, "Create Booking")
        throw error
    }
}

/**
 * Example 6: POST request without data (empty body)
 */
export const triggerAction = async () => {
    try {
        const response = await apiClient.post<{ message: string }>("/api/actions/trigger")
        
        if (response.success && response.data) {
            return response.data
        }
    } catch (error) {
        errorHandler.handleErrorWithToast(error, "Trigger Action")
        throw error
    }
}

/**
 * Example 7: POST request with form data (multipart/form-data)
 */
export const uploadFile = async (file: File, additionalData?: Record<string, string>) => {
    try {
        // For file uploads, you might want to use FormData
        const formData = new FormData()
        formData.append("file", file)
        
        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value)
            })
        }

        const response = await apiClient.post<{ fileUrl: string; fileName: string }>(
            "/api/upload",
            formData,
            {
                headers: {
                    // Don't set Content-Type for FormData, browser will set it with boundary
                }
            }
        )
        
        if (response.success && response.data) {
            return response.data
        }
    } catch (error) {
        errorHandler.handleErrorWithToast(error, "Upload File")
        throw error
    }
}

// ============================================
// CART ACTIONS (Redux)
// ============================================

export const addHotelToCart =
  (hotel: CartHotel) =>
  (dispatch: AppDispatch) => {
    dispatch(addToCart(hotel))
  }

export const removeHotelFromCart =
  (hotelId: string) =>
  (dispatch: AppDispatch) => {
    dispatch(removeFromCart(hotelId))
  }

// ============================================
// BOOKING ACTIONS (Redux)
// ============================================

export const addBookingToMyBookings =
  (booking: BookingItem) =>
  (dispatch: AppDispatch) => {
    dispatch(addBooking(booking))
  }

export const cancelBookingFromMyBookings =
  (bookingId: string) =>
  (dispatch: AppDispatch) => {
    dispatch(cancelBooking(bookingId))
  }