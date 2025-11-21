import { api } from "@/lib/api-client"
import type { Booking, GuestInfo } from "../types"

interface CreateBookingRequest {
  hotelId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
  guests: number
  guestInfo: GuestInfo
  totalPrice: number
}

export const bookingService = {
  createBooking: async (data: CreateBookingRequest): Promise<Booking> => {
    return api.post<Booking>("/bookings", data)
  },

  getBookingById: async (id: string): Promise<Booking> => {
    return api.get<Booking>(`/bookings/${id}`)
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    return api.get<Booking[]>(`/bookings/user/${userId}`)
  },

  cancelBooking: async (bookingId: string): Promise<Booking> => {
    return api.patch<Booking>(`/bookings/${bookingId}`, { status: "cancelled" })
  },

  updateBooking: async (bookingId: string, data: Partial<Booking>): Promise<Booking> => {
    return api.patch<Booking>(`/bookings/${bookingId}`, data)
  },
}
