import { api } from "@/lib/api-client"
import type { Hotel, HotelSearchFilters } from "../types"
import { dummyHotels } from "@/utils/dummy-data"

export const hotelService = {
  getHotels: async (): Promise<Hotel[]> => {
    try {
      return await api.get<Hotel[]>("/hotels")
    } catch {
      // Return dummy data in development
      return dummyHotels
    }
  },

  searchHotels: async (filters: HotelSearchFilters): Promise<Hotel[]> => {
    try {
      const params = new URLSearchParams({
        location: filters.location,
        checkInDate: filters.checkInDate.toISOString(),
        checkOutDate: filters.checkOutDate.toISOString(),
        guests: filters.guests.toString(),
      })

      if (filters.minPrice) params.append("minPrice", filters.minPrice.toString())
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
      if (filters.minRating) params.append("minRating", filters.minRating.toString())
      if (filters.sortBy) params.append("sortBy", filters.sortBy)

      return await api.get<Hotel[]>(`/hotels/search?${params}`)
    } catch {
      return dummyHotels.filter((hotel) => hotel.location.toLowerCase().includes(filters.location.toLowerCase()))
    }
  },

  getHotelById: async (id: string): Promise<Hotel> => {
    try {
      return await api.get<Hotel>(`/hotels/${id}`)
    } catch {
      const hotel = dummyHotels.find((h) => h.id === id)
      if (!hotel) throw new Error("Hotel not found")
      return hotel
    }
  },

  getHotelByLocation: async (location: string): Promise<Hotel[]> => {
    try {
      return await api.get<Hotel[]>(`/hotels/location/${location}`)
    } catch {
      return dummyHotels.filter((hotel) => hotel.location.toLowerCase().includes(location.toLowerCase()))
    }
  },
}
