import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { BookingState, BookingItem } from "@/modules/booking/types"
import { createBookingThunk, getBookingDetailThunk, getUserBookingsThunk } from "./bookingThunks"

const initialState: BookingState = {
  bookingItems: [],
  currentBooking: null,
  bookings: [],
  isLoading: false,
  error: null,
  total: 0,
}

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBookingItem: (state, action: PayloadAction<BookingItem>) => {
      state.bookingItems.push(action.payload)
    },
    removeBookingItem: (state, action: PayloadAction<string>) => {
      state.bookingItems = state.bookingItems.filter((item) => item.roomId !== action.payload)
    },
    clearBookingItems: (state) => {
      state.bookingItems = []
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Create booking
    builder.addCase(createBookingThunk.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(createBookingThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.currentBooking = action.payload
      state.bookingItems = []
    })
    builder.addCase(createBookingThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Get booking detail
    builder.addCase(getBookingDetailThunk.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(getBookingDetailThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.currentBooking = action.payload
    })
    builder.addCase(getBookingDetailThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Get user bookings
    builder.addCase(getUserBookingsThunk.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(getUserBookingsThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.bookings = action.payload
      state.total = action.payload.length
    })
    builder.addCase(getUserBookingsThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })
  },
})

export const { addBookingItem, removeBookingItem, clearBookingItems, clearError } = bookingSlice.actions
export default bookingSlice.reducer

