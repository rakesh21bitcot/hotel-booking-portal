export interface Room {
  id: string
  hotelId: string
  name: string
  type: string
  capacity: number
  price: number
  amenities: string[]
}

export interface BookingItem {
  roomId: string
  hotelId: string
  quantity: number
  checkInDate: Date
  checkOutDate: Date
  price: number
}

export interface Booking {
  id: string
  userId: string
  hotelId: string
  roomId: string
  checkInDate: Date
  checkOutDate: Date
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled"
  guestInfo: GuestInfo
  createdAt: Date
  updatedAt: Date
}

export interface GuestInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialRequests?: string
}

export interface BookingState {
  bookingItems: BookingItem[]
  currentBooking: Booking | null
  bookings: Booking[]
  isLoading: boolean
  error: string | null
  total: number
}
