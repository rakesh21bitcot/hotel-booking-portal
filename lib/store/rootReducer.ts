import { combineReducers } from "@reduxjs/toolkit"
import { authReducer } from "@/Store/auth"
import { hotelReducer } from "@/Store/hotel"
import { bookingReducer } from "@/Store/booking"
import commonReducer from "./common/commonSlice"

export const rootReducer = combineReducers({
  common: commonReducer,
  auth: authReducer,
  hotel: hotelReducer,
  booking: bookingReducer,
})

export type RootState = ReturnType<typeof rootReducer>
