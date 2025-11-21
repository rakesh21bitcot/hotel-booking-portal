import { createAsyncThunk } from "@reduxjs/toolkit"
import { bookingService } from "../services/bookingService"
import { errorHandler } from "@/lib/error-handler"
import type { GuestInfo } from "../types"

interface CreateBookingPayload {
  hotelId: string
  roomId: string
  checkInDate: Date
  checkOutDate: Date
  guests: number
  guestInfo: GuestInfo
  totalPrice: number
}

export const createBookingThunk = createAsyncThunk(
  "booking/create",
  async (payload: CreateBookingPayload, { rejectWithValue }) => {
    try {
      return await bookingService.createBooking({
        hotelId: payload.hotelId,
        roomId: payload.roomId,
        checkInDate: payload.checkInDate.toISOString(),
        checkOutDate: payload.checkOutDate.toISOString(),
        guests: payload.guests,
        guestInfo: payload.guestInfo,
        totalPrice: payload.totalPrice,
      })
    } catch (error) {
      const errorResponse = errorHandler.handleError(error)
      return rejectWithValue(errorResponse.message)
    }
  },
)

export const getBookingDetailThunk = createAsyncThunk(
  "booking/getDetail",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      return await bookingService.getBookingById(bookingId)
    } catch (error) {
      const errorResponse = errorHandler.handleError(error)
      return rejectWithValue(errorResponse.message)
    }
  },
)

export const getUserBookingsThunk = createAsyncThunk(
  "booking/getUserBookings",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await bookingService.getUserBookings(userId)
    } catch (error) {
      const errorResponse = errorHandler.handleError(error)
      return rejectWithValue(errorResponse.message)
    }
  },
)
