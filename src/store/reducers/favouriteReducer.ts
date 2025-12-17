import { FavouriteHotel, GetFavouriteHotel } from "@/store/actions/favourite-actions"
import { FAVOURITE_ACTIONS } from "@/store/actions/favourite-actions"

export interface FavouriteState {
  favourites: GetFavouriteHotel[]
  favouritesLoading: boolean
  error: string | null
}

const initialState: FavouriteState = {
  favourites: [],
  favouritesLoading: false,
  error: null
}

export const favouriteReducer = (state: FavouriteState = initialState, action: any): FavouriteState => {
  switch (action.type) {
    case FAVOURITE_ACTIONS.SET_FAVOURITES_LOADING:
      return {
        ...state,
        favouritesLoading: action.payload
      }

    case FAVOURITE_ACTIONS.SET_FAVOURITES:
      return {
        ...state,
        favourites: action.payload
      }

    case FAVOURITE_ACTIONS.ADD_TO_FAVOURITES:
      return {
        ...state,
        favourites: [...state.favourites, action.payload]
      }

    case FAVOURITE_ACTIONS.REMOVE_FROM_FAVOURITES:
      return {
        ...state,
        favourites: state.favourites.filter(fav => fav.hotelId !== action.payload)
      }

    case FAVOURITE_ACTIONS.SET_FAVOURITE_ERROR:
      return {
        ...state,
        error: action.payload
      }

    case FAVOURITE_ACTIONS.CLEAR_FAVOURITE_ERROR:
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}

export default favouriteReducer
