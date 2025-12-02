import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface CartHotel {
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
}

export interface BookingItem {
  id: string;
  hotelId: string;
  hotelName: string;
  location: string;
  hotelImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  totalAmount: number;
  status: "Confirmed" | "Cancelled";
  guestName: string;
  email: string;
}

interface InitialStateType {
  dob: Date;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_image: string;
  id: string;
  cart: CartHotel[];
  bookings: BookingItem[];
}

const initialState: InitialStateType = {
  dob: new Date(),
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  profile_image: "",
  id: "",
  cart: [],
  bookings: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    update: (state, action) => {
      const { dob, email, first_name, last_name, phone, profile_image, id } = action.payload;
      state.dob = dob;
      state.email = email;
      state.first_name = first_name;
      state.last_name = last_name;
      state.phone = phone;
      state.profile_image = profile_image;
      state.id = id;
      Cookies.set("id", id);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(state));
      }
    },
    addToCart: (state, action: PayloadAction<CartHotel>) => {
      const exists = state.cart.some((hotel) => hotel.id === action.payload.id);
      if (!exists) {
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((hotel) => hotel.id !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    addBooking: (state, action: PayloadAction<BookingItem>) => {
      state.bookings.unshift(action.payload);
    },
    cancelBooking: (state, action: PayloadAction<string>) => {
      const booking = state.bookings.find((b) => b.id === action.payload);
      if (booking) {
        booking.status = "Cancelled";
      }
    },
  },
});

export const { update, addToCart, removeFromCart, clearCart, addBooking, cancelBooking } = userSlice.actions;

export default userSlice.reducer;
