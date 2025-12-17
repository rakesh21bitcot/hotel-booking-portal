import { apiClient } from "@/lib/api-client"
import { errorHandler } from "@/lib/error-handler"

// ============================================
// HOTEL TYPES
// ============================================

export interface HotelFilters {
  userId?:string
  location?: string
  minRating?: number
  maxRating?: number
  minPrice?: number
  maxPrice?: number
  isFeatured?: boolean
  sortBy?:  "featured" | "price_low_to_high" | "price_high_to_low" | "highest_rating"
}

export interface Images {
  url: string;
  alt: string
}

export interface amenities {
  icon: string;
  id: string;
  title: string;
}

export interface Hotel {
  id: string
  name: string
  description: string
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
  rating: number
  reviewCount: number
  price: number | string;
  currency: string
  amenities: amenities[]
  propertyType: string
  policies: {
    checkInTime: string
    checkOutTime: string
    cancellation: string
    petPolicy: string
  }
  rooms: Room[]
  createdAt: string
  updatedAt: string
  reviews: Reviews[]
  isFavourite: boolean
}

export interface beds {
  count: number;
  type: string
}

export interface Reviews {
  user_name: string;
  date: string;
  comment: string;
  id: string;
  rating: number;
}

export interface Room {
  id: string
  beds: beds[]
  view: string
  title: string
  addons: any[]
  images: { url: string }[]
  quantity: number
  amenities: string[]
  size_sqft: number
  base_price: number
  description: string
  air_conditioned: boolean
  capacity_adults: number
  capacity_children: number
  hotel: {
    id: string
    name: string
    location: any;
    rating: number
    reviewCount: number
  }
}

interface pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface HotelListResponse {
  data: Hotel[]
  meta: pagination
}

export interface HotelDetailsResponse extends Hotel {}

export interface RoomDetailsResponse extends Room {}

// ============================================
// HOTEL ACTIONS
// ============================================

/**
 * Get hotels list with filters and pagination
 */
export const getHotels = async (
  filters: HotelFilters = { sortBy: 'featured' },
  page = 1,
  limit = 10
): Promise<HotelListResponse> => {
  const queryParams = new URLSearchParams()

  // Add pagination
  queryParams.append('page', page.toString())
  queryParams.append('limit', limit.toString())

  // Add filters
  if (filters.location) queryParams.append('location', filters.location)
  if (filters.userId) queryParams.append('userId', filters.userId)
  if (filters.minRating !== undefined) queryParams.append('minRating', filters.minRating.toString())
  if (filters.maxRating !== undefined) queryParams.append('maxRating', filters.maxRating.toString())
  if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString())
  if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString())
  if (filters.isFeatured !== undefined) queryParams.append('isFeatured', filters.isFeatured.toString())
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)

  const queryString = queryParams.toString()
  const endpoint = `/hotels${queryString ? `?${queryString}` : ''}`

  const response = await errorHandler.handleApiCall(
    () => apiClient.get<HotelListResponse>(endpoint),
    "Fetch Hotels"
  )

  if (!response || !response.success || !response.data) {
    throw new Error("Failed to fetch hotels")
  }

  return response.data
}

/**
 * Get hotel details by ID
 */
export const getHotelDetails = async (hotelId: string): Promise<HotelDetailsResponse> => {
  const response = await errorHandler.handleApiCall(
    () => apiClient.get<HotelDetailsResponse>(`/hotel/${hotelId}`),
    "Fetch Hotel Details"
  )

  if (!response || !response.success || !response.data) {
    throw new Error("Failed to fetch hotel details")
  }

  return response.data
}

/**
 * Get room details within a hotel
 */
export const getRoomDetails = async (hotelId: string, roomId: string): Promise<RoomDetailsResponse> => {
  const response: any = await errorHandler.handleApiCall(
    () => apiClient.get<RoomDetailsResponse>(`/hotel/${hotelId}/${roomId}`),
    "Fetch Room Details"
  )

  if (!response || !response.success || !response.data) {
    throw new Error("Failed to fetch room details")
  }
  return response.data
}

// ============================================
// REDUX ACTION TYPES
// ============================================

export const HOTEL_ACTIONS = {
  SET_HOTELS_LOADING: 'SET_HOTELS_LOADING',
  SET_HOTELS: 'SET_HOTELS',
  SET_HOTEL_DETAILS_LOADING: 'SET_HOTEL_DETAILS_LOADING',
  SET_HOTEL_DETAILS: 'SET_HOTEL_DETAILS',
  SET_ROOM_DETAILS_LOADING: 'SET_ROOM_DETAILS_LOADING',
  SET_ROOM_DETAILS: 'SET_ROOM_DETAILS',
  CLEAR_HOTEL_DATA: 'CLEAR_HOTEL_DATA',
  SET_HOTEL_ERROR: 'SET_HOTEL_ERROR',
  CLEAR_HOTEL_ERROR: 'CLEAR_HOTEL_ERROR'
} as const

// ============================================
// REDUX ACTION CREATORS
// ============================================

export const setHotelsLoading = (loading: boolean) => ({
  type: HOTEL_ACTIONS.SET_HOTELS_LOADING,
  payload: loading
})

export const setHotels = (data: HotelListResponse) => ({
  type: HOTEL_ACTIONS.SET_HOTELS,
  payload: data
})

export const setHotelDetailsLoading = (loading: boolean) => ({
  type: HOTEL_ACTIONS.SET_HOTEL_DETAILS_LOADING,
  payload: loading
})

export const setHotelDetails = (hotel: Hotel) => ({
  type: HOTEL_ACTIONS.SET_HOTEL_DETAILS,
  payload: hotel
})

export const setRoomDetailsLoading = (loading: boolean) => ({
  type: HOTEL_ACTIONS.SET_ROOM_DETAILS_LOADING,
  payload: loading
})

export const setRoomDetails = (room: Room) => ({
  type: HOTEL_ACTIONS.SET_ROOM_DETAILS,
  payload: room
})

export const clearHotelData = () => ({
  type: HOTEL_ACTIONS.CLEAR_HOTEL_DATA
})

export const setHotelError = (error: string) => ({
  type: HOTEL_ACTIONS.SET_HOTEL_ERROR,
  payload: error
})

export const clearHotelError = () => ({
  type: HOTEL_ACTIONS.CLEAR_HOTEL_ERROR
})

// ============================================
// THUNK ACTIONS (for Redux)
// ============================================

/**
 * Fetch hotels list with Redux integration
 */
export const fetchHotels = (filters: HotelFilters = { sortBy: 'featured' }, page = 1, limit = 10) => {
  return async (dispatch: any) => {
    try {
      dispatch(setHotelsLoading(true))
      dispatch(clearHotelError())

      const hotelsData = await getHotels(filters, page, limit)

      dispatch(setHotels(hotelsData))
    } catch (error: any) {
      dispatch(setHotelError(error.message || 'Failed to fetch hotels'))
    } finally {
      dispatch(setHotelsLoading(false))
    }
  }
}

/**
 * Fetch hotel details with Redux integration
 */
export const fetchHotelDetails = (hotelId: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(setHotelDetailsLoading(true))
      dispatch(clearHotelError())

      const hotelData = await getHotelDetails(hotelId)
debugger
      dispatch(setHotelDetails(hotelData))
    } catch (error: any) {
      dispatch(setHotelError(error.message || 'Failed to fetch hotel details'))
    } finally {
      dispatch(setHotelDetailsLoading(false))
    }
  }
}

/**
 * Fetch room details with Redux integration
 */
export const fetchRoomDetails = (hotelId: string, roomId: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(setRoomDetailsLoading(true))
      dispatch(clearHotelError())

      const roomData = await getRoomDetails(hotelId, roomId)

      dispatch(setRoomDetails(roomData))
    } catch (error: any) {
      dispatch(setHotelError(error.message || 'Failed to fetch room details'))
    } finally {
      dispatch(setRoomDetailsLoading(false))
    }
  }
}
