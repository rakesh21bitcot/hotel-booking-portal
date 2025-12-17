import { BookingResponse } from "@/store/actions/booking-actions"
import { BOOKING_ACTIONS } from "@/store/actions/booking-actions"

export interface BookingState {
  bookings: BookingResponse[]
  bookingsLoading: boolean
  error: string | null
}

const initialState: BookingState = {
  bookings: [],
  bookingsLoading: false,
  error: null
}

export const bookingReducer = (state: BookingState = initialState, action: any): BookingState => {
  switch (action.type) {
    case BOOKING_ACTIONS.SET_BOOKINGS_LOADING:
      return {
        ...state,
        bookingsLoading: action.payload
      }

    case BOOKING_ACTIONS.SET_BOOKINGS:
      return {
        ...state,
        bookings: action.payload
      }

    case BOOKING_ACTIONS.ADD_BOOKING:
      return {
        ...state,
        bookings: [action.payload, ...state.bookings]
      }

    case BOOKING_ACTIONS.UPDATE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? action.payload : booking
        )
      }

    case BOOKING_ACTIONS.SET_BOOKING_ERROR:
      return {
        ...state,
        error: action.payload
      }

    case BOOKING_ACTIONS.CLEAR_BOOKING_ERROR:
      return {
        ...state,
        error: null
      }

    case BOOKING_ACTIONS.CLEAR_BOOKINGS:
      return {
        ...state,
        bookings: []
      }

    default:
      return state
  }
}

export default bookingReducer
