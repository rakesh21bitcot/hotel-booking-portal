import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "@/modules/auth/store/authSlice"
import hotelReducer from "@/modules/hotel/store/hotelSlice"
import bookingReducer from "@/modules/booking/store/bookingSlice"
import commonReducer from "./common/commonSlice"

export const rootReducer = combineReducers({
  common: commonReducer,
  auth: authReducer,
  hotel: hotelReducer,
  booking: bookingReducer,
})

export type RootState = ReturnType<typeof rootReducer>
