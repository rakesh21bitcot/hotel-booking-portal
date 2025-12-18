"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import moment from 'moment'
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"

import { ROUTES } from "@/utils/constants"
import { useAppSelector, useAppDispatch } from "@/store/hook"
import { fetchBookingById, clearCurrentBooking } from "@/store/actions/booking-actions"
import { ArrowLeft, Calendar, Users, MapPin, Phone, Mail, Bed } from "lucide-react"

export default function MyBookingDetailsPage() {
  const params = useParams()
  const bookingId = params.id as string
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { currentBooking, currentBookingLoading, error } = useAppSelector((state) => state.booking)

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingById(bookingId)).catch((error: any) => {
        toast.error(error.message || 'Failed to fetch booking details')
      })
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentBooking())
    }
  }, [bookingId, dispatch])

  if (currentBookingLoading) {
    return (
      <main className="bg-black min-h-screen">
        <section className="pt-24 pb-12 bg-secondary border-b border-border">
          <div className="max-w-4xl mx-auto px-4">
            <div className="h-8 bg-muted rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          </div>
        </section>
        <section className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-card border border-border rounded-lg p-8 animate-pulse">
            <div className="h-64 bg-muted rounded-lg mb-6"></div>
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (error || !currentBooking) {
    return (
      <main className="bg-black min-h-screen">
        <section className="pt-24 pb-12 bg-secondary border-b border-border">
          <div className="max-w-4xl mx-auto px-4">
            <button
              type="button"
              onClick={() => router.push(ROUTES.PROTECTED.MYBOOKING)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Bookings
            </button>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Booking Details</h1>
          </div>
        </section>
        <section className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-red-600 font-medium mb-4">
              {error || "Booking not found"}
            </p>
            <button
              type="button"
              onClick={() => router.push(ROUTES.PROTECTED.MYBOOKING)}
              className="px-4 cursor-pointer py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
              Back to My Bookings
            </button>
          </div>
        </section>
      </main>
    )
  }

  const booking = currentBooking
  const checkInDate = moment(new Date(booking.checkIn))
  const checkOutDate = moment(new Date(booking.checkOut))
  const nights = checkOutDate.diff(checkInDate, 'days')

  return (
    <main className="bg-black min-h-screen">
      <section className="pt-24 pb-12 bg-secondary border-b border-border">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => router.push(ROUTES.PROTECTED.MYBOOKING)}
            className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Bookings
          </button>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Booking Details</h1>
          <p className="text-muted-foreground">
            Complete information about your booking #{booking?.bookingId}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Hotel Image */}
          <div className="relative w-full h-64 overflow-hidden">
            <img
              src={booking.hotel?.images?.[0]?.url || "/placeholder.svg"}
              alt={booking.hotel?.images?.[0]?.alt || "Hotel"}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  booking.status === "Confirmed"
                    ? "bg-green-500/80 text-black"
                    : booking.status === "Cancelled"
                    ? "bg-red-500/80 text-black"
                    : booking.status === "Ongoing"
                    ? "bg-blue-500/80 text-black"
                    : "bg-yellow-500/80 text-black"
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>

          <div className="p-8">
            {/* Hotel Info */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                {booking.hotel?.name}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>{booking.hotel?.location?.address}, {booking.hotel?.location?.city}, {booking.hotel?.location?.state}, {booking.hotel?.location?.country}</span>
              </div>
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground mb-4">Guest Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Guest Name</p>
                      <p className="font-medium">{booking.firstName} {booking.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{booking.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{booking.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Number of Guests</p>
                      <p className="font-medium">{booking.guestCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground mb-4">Stay Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Check-in</p>
                      <p className="font-medium">{checkInDate.format("dddd, MMMM DD, YYYY")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Check-out</p>
                      <p className="font-medium">{checkOutDate.format("dddd, MMMM DD, YYYY")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{nights} Night{nights !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bed className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Room Type</p>
                      <p className="font-medium">{booking.room?.name || 'Standard Room'}</p>
                      <p className="text-sm text-muted-foreground">{booking.room?.beds?.[0]?.type} bed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="border-t border-border pt-6 mb-6">
              <h3 className="font-semibold text-lg text-foreground mb-4">Booking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                  <p className="font-mono text-sm font-medium">{booking?.bookingId}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Created</p>
                  <p className="font-medium">{moment(new Date(booking?.createdAt)).format("MMM DD, YYYY")}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p className="font-medium">{moment(new Date(booking?.updatedAt)).format("MMM DD, YYYY")}</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-foreground">Total Amount</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">${booking.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                This includes all taxes and fees. Payment was processed at the time of booking.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}