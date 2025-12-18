"use client"

import { useEffect } from "react"

import { useAppSelector, useAppDispatch } from "@/store/hook"
import { fetchUserBookings, cancelBookingWithRedux } from "@/store/actions/booking-actions"
import { useRouter } from "next/navigation"
import { openConfirmDialog } from "@/utils/CommonService"
import { toast } from "sonner"
import moment from 'moment'

export default function MyBookingsPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { bookings, bookingsLoading, error } = useAppSelector((state) => state.booking)
  const router = useRouter()

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserBookings())
    }
  }, [dispatch, user?.id])

  const handleCancelBooking = async (bookingId: string) => {
    openConfirmDialog({
      data: {
        title: "Cancel Booking",
        message: "Are you sure you want to cancel this booking? This action cannot be undone.",
      },
      confirmText: "Yes, Cancel",
      cancelText: "Keep Booking",
      onConfirm: async () => {
        try {
          await dispatch(cancelBookingWithRedux(bookingId))
          toast.success("Booking cancelled successfully")
          await dispatch(fetchUserBookings())
        } catch (error: any) {
          toast.error(error.message || "Failed to cancel booking")
        }
      },
      onCancel: () => {
        console.log("Cancel action cancelled")
      },
    })
  }
  

  return (
    <main className="bg-black min-h-screen">
      <section className="pt-24 pb-12 bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage all your confirmed stays in one place.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {bookingsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">You don&apos;t have any bookings yet.</p>
            <p className="text-sm text-muted-foreground">
              Browse hotels, add them to your cart, and complete a booking to see it listed here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookings?.map((booking) => (
              <article
                key={booking.id}
                onClick={() => router.push(`/hotel/${booking.hotelId}`)}
                className={`bg-card border rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer  transition ${
                  booking.status === "Cancelled"
                    ? "border-red-500/50"
                    : "border-border hover:border-primary/60"
                }`}
              >
                {/* Image */}
                <div className="relative w-full aspect-video overflow-hidden">
                  <img
                    src={booking.hotel?.images?.[0]?.url || "/placeholder.svg"}
                    alt={booking.hotel?.images?.[0]?.alt || "Hotel"}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "Confirmed"
                        ? "bg-green-500/80 text-black"
                        : booking.status === "Cancelled"
                        ? "bg-red-500/80 text-black"
                        : "bg-yellow-500/80 text-black"
                    }`}
                  >
                    {booking?.status.charAt(0).toUpperCase() + booking?.status.slice(1)}
                  </span>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-lg font-semibold text-foreground">
                        {booking?.hotel?.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">{booking?.hotel?.location?.address}, {booking?.hotel?.location?.city}, {booking?.hotel?.location?.country}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guest</span>
                      <span className="text-foreground font-medium">{`${booking.firstName} ${booking.lastName}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="text-foreground font-medium">{moment(new Date(booking.checkIn)).format("DD, MMM, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="text-foreground font-medium">{moment(new Date(booking.checkOut)).format("DD, MMM, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="text-foreground font-medium">{booking.guestCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room</span>
                      <span className="text-foreground font-medium">{booking.room?.beds[0].type}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total amount</p>
                      <p className="text-xl font-bold text-primary">${booking?.totalPrice?.toFixed(2) || ''}</p>
                    </div>

                    {booking.status !== "Cancelled" && booking.status !== "Ongoing" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCancelBooking(booking.id as string)
                        }}
                        className="px-4 cursor-pointer py-2 border border-border rounded-lg text-xs font-semibold text-muted-foreground hover:border-red-500 hover:text-red-500 transition"
                      >
                        Cancel booking
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}


