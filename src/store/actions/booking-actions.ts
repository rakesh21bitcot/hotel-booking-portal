import { apiClient } from "@/lib/api-client"
import { errorHandler } from "@/lib/error-handler"
import { Images } from "./hotel-actions"

export interface BookingData {
  userId: number
  hotelId: string
  roomId: string
  checkIn: string
  checkOut: string
  guestCount: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export interface BookingResponse {
  id: string
  userId: number
  hotelId: string
  roomId: string
  checkIn: string
  checkOut: string
  guestCount: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  price: number
  status: 'confirmed' | 'cancelled' | 'pending'
  createdAt: string
  updatedAt: string
  hotel?: {
    id: string
    name: string
    location: {
      address: string
      city: string
      state: string
      country: string
      coordinates: {
        latitude: number
        longitude: number
      }
    }
    images: Images[]
  }
  room?: {
    id: string
    name: string
    type: string
    price: number
  }
}

export interface CardDetails {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardholderName: string
}

// ============================================
// BOOKING ACTIONS
// ============================================

/**
 * Create a new booking
 */
export const createBooking = async (bookingData: BookingData): Promise<BookingResponse> => {
  const response = await errorHandler.handleApiCall(
    () => apiClient.post<{ booking: BookingResponse }>('/create-booking', bookingData),
    "Create Booking"
  )
  if (!response || !response.success || !response.data) {
    throw new Error("Failed to create booking")
  }
  return response.data.booking
}

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: string): Promise<BookingResponse> => {
  const response = await errorHandler.handleApiCall(
    () => apiClient.patch<{ booking: BookingResponse }>(`/booking/${bookingId}/cancel`, {}),
    "Cancel Booking"
  )
  if (!response || !response.success || !response.data) {
    throw new Error("Failed to cancel booking")
  }
  return response.data.booking
}

/**
 * Get user's bookings
 */
export const getUserBookings = async (): Promise<BookingResponse[]> => {
  const response = await errorHandler.handleApiCall(
    () => apiClient.get<{ bookings: BookingResponse[] }>(`/mybookings`),
    "Get User Bookings"
  )
  if (!response || !response.success || !response.data) {
    throw new Error("Failed to fetch bookings")
  }
  
  return response.data.bookings || []
}

// ============================================
// REDUX ACTION TYPES
// ============================================

export const BOOKING_ACTIONS = {
  SET_BOOKINGS_LOADING: 'SET_BOOKINGS_LOADING',
  SET_BOOKINGS: 'SET_BOOKINGS',
  ADD_BOOKING: 'ADD_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  SET_BOOKING_ERROR: 'SET_BOOKING_ERROR',
  CLEAR_BOOKING_ERROR: 'CLEAR_BOOKING_ERROR'
} as const

// ============================================
// REDUX ACTION CREATORS
// ============================================

export const setBookingsLoading = (loading: boolean) => ({
  type: BOOKING_ACTIONS.SET_BOOKINGS_LOADING,
  payload: loading
})

export const setBookings = (bookings: BookingResponse[]) => ({
  type: BOOKING_ACTIONS.SET_BOOKINGS,
  payload: bookings
})

export const addBooking = (booking: BookingResponse) => ({
  type: BOOKING_ACTIONS.ADD_BOOKING,
  payload: booking
})

export const updateBooking = (booking: BookingResponse) => ({
  type: BOOKING_ACTIONS.UPDATE_BOOKING,
  payload: booking
})

export const setBookingError = (error: string) => ({
  type: BOOKING_ACTIONS.SET_BOOKING_ERROR,
  payload: error
})

export const clearBookingError = () => ({
  type: BOOKING_ACTIONS.CLEAR_BOOKING_ERROR
})

// ============================================
// THUNK ACTIONS (for Redux)
// ============================================

/**
 * Create booking with Redux integration
 */
export const createBookingWithRedux = (bookingData: BookingData) => {
  return async (dispatch: any) => {
    try {
      dispatch(setBookingsLoading(true))
      dispatch(clearBookingError())

      const booking = await createBooking(bookingData)

      dispatch(addBooking(booking))
      return booking
    } catch (error: any) {
      dispatch(setBookingError(error.message || 'Failed to create booking'))
      throw error
    } finally {
      dispatch(setBookingsLoading(false))
    }
  }
}

/**
 * Cancel booking with Redux integration
 */
export const cancelBookingWithRedux = (bookingId: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(clearBookingError())

      const updatedBooking = await cancelBooking(bookingId)

      dispatch(updateBooking(updatedBooking))
      return updatedBooking
    } catch (error: any) {
      dispatch(setBookingError(error.message || 'Failed to cancel booking'))
      throw error
    }
  }
}

/**
 * Fetch user bookings with Redux integration
 */
export const fetchUserBookings = () => {
  return async (dispatch: any) => {
    try {
      dispatch(setBookingsLoading(true))
      dispatch(clearBookingError())

      const bookings = await getUserBookings()

      dispatch(setBookings(bookings))
      return bookings
    } catch (error: any) {
      dispatch(setBookingError(error.message || 'Failed to fetch bookings'))
      throw error
    } finally {
      dispatch(setBookingsLoading(false))
    }
  }
}
