import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { HotelState, HotelSearchFilters } from "@/modules/hotel/types"
import { searchHotelsThunk, getHotelDetailThunk, getHotelsThunk } from "./hotelThunks"

const initialState: HotelState = {
  hotels: [],
  selectedHotel: null,
  filters: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
}

export const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<HotelSearchFilters>) => {
      state.filters = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetHotels: (state) => {
      state.hotels = []
      state.selectedHotel = null
      state.filters = null
    },
  },
  extraReducers: (builder) => {
    // Get hotels
    builder.addCase(getHotelsThunk.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(getHotelsThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.hotels = action.payload
      state.total = action.payload.length
    })
    builder.addCase(getHotelsThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Search hotels
    builder.addCase(searchHotelsThunk.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(searchHotelsThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.hotels = action.payload
      state.total = action.payload.length
    })
    builder.addCase(searchHotelsThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Get hotel detail
    builder.addCase(getHotelDetailThunk.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(getHotelDetailThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.selectedHotel = action.payload
    })
    builder.addCase(getHotelDetailThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })
  },
})

export const { setFilters, clearError, resetHotels } = hotelSlice.actions
export default hotelSlice.reducer

