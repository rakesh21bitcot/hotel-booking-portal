import { Hotel, HotelListResponse, Room } from "@/store/actions/hotel-actions"
import { HOTEL_ACTIONS } from "@/store/actions/hotel-actions"

export interface HotelState {
  // Hotels list
  hotels: Hotel[] | any
  hotelsLoading: boolean
  hotelsTotal: number
  hotelsPage: number
  hotelsPageSize: number
  hotelsTotalPages: number

  // Hotel details
  currentHotel: Hotel | null
  hotelDetailsLoading: boolean

  // Room details
  currentRoom: Room | null
  roomDetailsLoading: boolean

  // Error state
  error: string | null
}

const initialState: HotelState = {
  hotels: [],
  hotelsLoading: false,
  hotelsTotal: 0,
  hotelsPage: 1,
  hotelsPageSize: 10,
  hotelsTotalPages: 0,

  currentHotel: null,
  hotelDetailsLoading: false,

  currentRoom: null,
  roomDetailsLoading: false,

  error: null
}

export const hotelReducer = (state: HotelState = initialState, action: any): HotelState => {
  switch (action.type) {
    case HOTEL_ACTIONS.SET_HOTELS_LOADING:
      return {
        ...state,
        hotelsLoading: action.payload
      }

    case HOTEL_ACTIONS.SET_HOTELS:
      const hotelsData = action.payload as HotelListResponse
      return {
        ...state,
        hotels: hotelsData.data,
        hotelsTotal: hotelsData.meta.total,
        hotelsPage: hotelsData.meta.page,
        hotelsPageSize: hotelsData.meta.limit,
        hotelsTotalPages: hotelsData.meta.totalPages
      }

    case HOTEL_ACTIONS.SET_HOTEL_DETAILS_LOADING:
      return {
        ...state,
        hotelDetailsLoading: action.payload
      }

    case HOTEL_ACTIONS.SET_HOTEL_DETAILS:
      return {
        ...state,
        currentHotel: action.payload
      }

    case HOTEL_ACTIONS.SET_ROOM_DETAILS_LOADING:
      return {
        ...state,
        roomDetailsLoading: action.payload
      }

    case HOTEL_ACTIONS.SET_ROOM_DETAILS:
      return {
        ...state,
        currentRoom: action.payload
      }

    case HOTEL_ACTIONS.CLEAR_HOTEL_DATA:
      return {
        ...state,
        hotels: [],
        currentHotel: null,
        currentRoom: null,
        error: null
      }

    case HOTEL_ACTIONS.SET_HOTEL_ERROR:
      return {
        ...state,
        error: action.payload
      }

    case HOTEL_ACTIONS.CLEAR_HOTEL_ERROR:
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}

export default hotelReducer
