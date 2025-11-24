"use client"

import { useAppDispatch, useAppSelector } from "@/lib/store"
import { createBookingThunk, getBookingDetailThunk, getUserBookingsThunk } from "@/Store/booking"
import { addBookingItem, removeBookingItem, clearBookingItems } from "@/Store/booking"
import type { BookingItem, GuestInfo } from "../types"

export function useBooking() {
  const dispatch = useAppDispatch()
  const { bookingItems, currentBooking, bookings, isLoading, error } = useAppSelector((state) => state.booking)

  return {
    bookingItems,
    currentBooking,
    bookings,
    isLoading,
    error,

    addItem: (item: BookingItem) => {
      dispatch(addBookingItem(item))
    },

    removeItem: (roomId: string) => {
      dispatch(removeBookingItem(roomId))
    },

    clearItems: () => {
      dispatch(clearBookingItems())
    },

    createBooking: async (
      hotelId: string,
      roomId: string,
      checkInDate: Date,
      checkOutDate: Date,
      guests: number,
      guestInfo: GuestInfo,
      totalPrice: number,
    ) => {
      return dispatch(
        createBookingThunk({
          hotelId,
          roomId,
          checkInDate,
          checkOutDate,
          guests,
          guestInfo,
          totalPrice,
        }),
      )
    },

    getBookingDetail: async (bookingId: string) => {
      return dispatch(getBookingDetailThunk(bookingId))
    },

    getUserBookings: async (userId: string) => {
      return dispatch(getUserBookingsThunk(userId))
    },
  }
}
