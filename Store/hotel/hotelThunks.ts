import { createAsyncThunk } from "@reduxjs/toolkit"
import { hotelService } from "@/modules/hotel/services/hotelService"
import { errorHandler } from "@/lib/error-handler"
import type { HotelSearchFilters } from "@/modules/hotel/types"

export const getHotelsThunk = createAsyncThunk("hotel/getHotels", async (_, { rejectWithValue }) => {
  try {
    return await hotelService.getHotels()
  } catch (error) {
    const errorResponse = errorHandler.handleError(error)
    return rejectWithValue(errorResponse.message)
  }
})

export const searchHotelsThunk = createAsyncThunk(
  "hotel/searchHotels",
  async (filters: HotelSearchFilters, { rejectWithValue }) => {
    try {
      return await hotelService.searchHotels(filters)
    } catch (error) {
      const errorResponse = errorHandler.handleError(error)
      return rejectWithValue(errorResponse.message)
    }
  },
)

export const getHotelDetailThunk = createAsyncThunk("hotel/getHotelDetail", async (id: string, { rejectWithValue }) => {
  try {
    return await hotelService.getHotelById(id)
  } catch (error) {
    const errorResponse = errorHandler.handleError(error)
    return rejectWithValue(errorResponse.message)
  }
})

