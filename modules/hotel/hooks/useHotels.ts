"use client"

import { useAppDispatch, useAppSelector } from "@/lib/store"
import { searchHotelsThunk, getHotelsThunk, getHotelDetailThunk } from "../store/hotelThunks"
import { setFilters } from "../store/hotelSlice"
import type { HotelSearchFilters } from "../types"

export function useHotels() {
  const dispatch = useAppDispatch()
  const { hotels, isLoading, error, selectedHotel, filters } = useAppSelector((state) => state.hotel)

  return {
    hotels,
    isLoading,
    error,
    selectedHotel,
    filters,

    searchHotels: async (searchFilters: HotelSearchFilters) => {
      dispatch(setFilters(searchFilters))
      return dispatch(searchHotelsThunk(searchFilters))
    },

    getHotels: async () => {
      return dispatch(getHotelsThunk())
    },

    getHotelDetail: async (id: string) => {
      return dispatch(getHotelDetailThunk(id))
    },
  }
}
