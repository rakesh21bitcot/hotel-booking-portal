export interface Hotel {
  id: string
  name: string
  location: string
  rating: number
  reviewCount: number
  pricePerNight: number
  image: string
  amenities: string[]
  description: string
  images?: string[]
  checkInTime?: string
  checkOutTime?: string
  address?: string
  phone?: string
  email?: string
}

export interface HotelSearchFilters {
  location: string
  checkInDate: Date
  checkOutDate: Date
  guests: number
  minPrice?: number
  maxPrice?: number
  minRating?: number
  amenities?: string[]
  sortBy?: "price" | "rating" | "popularity"
}

export interface HotelState {
  hotels: Hotel[]
  selectedHotel: Hotel | null
  filters: HotelSearchFilters | null
  isLoading: boolean
  error: string | null
  total: number
  page: number
}
