import { apiClient } from "@/lib/api-client"
import { errorHandler } from "@/lib/error-handler"
import { Hotel } from "./hotel-actions"
import { forSuccess } from "@/utils/CommonService"

export interface FavouriteHotel {
  id: string
  name: string
  location: string
  image: string
  price: number | string
  rating: number
  reviewCount: number
  hotelId: string
  userId: string
  createdAt: string
}

export interface GetFavouriteHotel {
  id: string
  hotelId: string
  userId: string
  createdAt: string
  hotel: Hotel;
}

// ============================================
// FAVOURITE ACTIONS
// ============================================

/**
 * Add hotel to favourites
 */
export const addToFavourites = async (hotelId: string): Promise<FavouriteHotel> => {
  const response = await errorHandler.handleApiCall(
    () => apiClient.post<FavouriteHotel>('/favourite', { hotelId }),
    "Add to Favourites"
  )

  if (!response || !response.success || !response.data) {
    throw new Error("Failed to add hotel to favourites")
  }

  return response.data
}

/**
 * Get user's favourite hotels
 */
export const getFavourites = async (): Promise<GetFavouriteHotel[]> => {
  const response = await errorHandler.handleApiCall(
    () => apiClient.get<{ favourites: GetFavouriteHotel[] }>('/favourite'),
    "Get Favourites"
  )

  if (!response || !response.success || !response.data) {
    throw new Error("Failed to fetch favourites")
  }
  return response.data.favourites || []
}

/**
 * Remove hotel from favourites
 */
export const removeFromFavourites = async (hotelId: string): Promise<void> => {
  const response = await errorHandler.handleApiCall(
    () => apiClient.delete(`/favourite/${hotelId}`),
    "Remove from Favourites"
  )

  if (!response || !response.success) {
    throw new Error("Failed to remove hotel from favourites")
  }
}

// ============================================
// REDUX ACTION TYPES
// ============================================

export const FAVOURITE_ACTIONS = {
  SET_FAVOURITES_LOADING: 'SET_FAVOURITES_LOADING',
  SET_FAVOURITES: 'SET_FAVOURITES',
  ADD_TO_FAVOURITES: 'ADD_TO_FAVOURITES',
  REMOVE_FROM_FAVOURITES: 'REMOVE_FROM_FAVOURITES',
  SET_FAVOURITE_ERROR: 'SET_FAVOURITE_ERROR',
  CLEAR_FAVOURITE_ERROR: 'CLEAR_FAVOURITE_ERROR'
} as const

// ============================================
// REDUX ACTION CREATORS
// ============================================

export const setFavouritesLoading = (loading: boolean) => ({
  type: FAVOURITE_ACTIONS.SET_FAVOURITES_LOADING,
  payload: loading
})

export const setFavourites = (favourites: GetFavouriteHotel[]) => ({
  type: FAVOURITE_ACTIONS.SET_FAVOURITES,
  payload: favourites
})

export const addToFavouritesAction = (favourite: FavouriteHotel) => ({
  type: FAVOURITE_ACTIONS.ADD_TO_FAVOURITES,
  payload: favourite
})

export const removeFromFavouritesAction = (hotelId: string) => ({
  type: FAVOURITE_ACTIONS.REMOVE_FROM_FAVOURITES,
  payload: hotelId
})

export const setFavouriteError = (error: string) => ({
  type: FAVOURITE_ACTIONS.SET_FAVOURITE_ERROR,
  payload: error
})

export const clearFavouriteError = () => ({
  type: FAVOURITE_ACTIONS.CLEAR_FAVOURITE_ERROR
})

// ============================================
// THUNK ACTIONS (for Redux)
// ============================================

/**
 * Fetch user's favourite hotels with Redux integration
 */
export const fetchFavourites = () => {
  return async (dispatch: any) => {
    try {
      dispatch(setFavouritesLoading(true))
      dispatch(clearFavouriteError())

      const favourites = await getFavourites()

      dispatch(setFavourites(favourites))
    } catch (error: any) {
      dispatch(setFavouriteError(error.message || 'Failed to fetch favourites'))
    } finally {
      dispatch(setFavouritesLoading(false))
    }
  }
}

/**
 * Add hotel to favourites with Redux integration
 */
export const addFavourite = (hotelId: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(clearFavouriteError())

      const favourite = await addToFavourites(hotelId)
      forSuccess('Added to whishlist.')
      dispatch(addToFavouritesAction(favourite))
    } catch (error: any) {
      dispatch(setFavouriteError(error.message || 'Failed to add to favourites'))
    }
  }
}

/**
 * Remove hotel from favourites with Redux integration
 */
export const removeFavourite = (hotelId: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(clearFavouriteError())

      await removeFromFavourites(hotelId)
      forSuccess('Remove from whishlist.')
      dispatch(removeFromFavouritesAction(hotelId))
    } catch (error: any) {
      dispatch(setFavouriteError(error.message || 'Failed to remove from favourites'))
    }
  }
}
