"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAppSelector, useAppDispatch } from "@/store/hook"
import { cancelBookingFromMyBookings } from "@/store/actions/user-action"
import { useRouter } from "next/navigation"
import { openConfirmDialog } from "@/utils/CommonService"

export default function MyBookingsPage() {
  const dispatch = useAppDispatch()
  const bookings = useAppSelector((state) => state.user.bookings)
  const router = useRouter()

  const handleCancelBooking = (bookingId: string) => {
    openConfirmDialog({
      data: {
        title: "Cancel Booking",
        message: "Are you sure you want to cancel this booking?",
      },
      confirmText: "Yes",
      cancelText: "Cancel",
      onConfirm: () => {
        dispatch(cancelBookingFromMyBookings(bookingId))
      },
      onCancel: () => {
        console.log("Canceled")
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
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">You don&apos;t have any bookings yet.</p>
            <p className="text-sm text-muted-foreground">
              Browse hotels, add them to your cart, and complete a booking to see it listed here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                onClick={() => router.push(`/hotel/${booking.hotelId}`)}
                className="bg-card border border-border rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer hover:border-primary/60 transition"
              >
                {/* Image */}
                <div className="relative w-full aspect-video overflow-hidden">
                  <img
                    src={booking.hotelImage || "/placeholder.svg"}
                    alt={booking.hotelName}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "Confirmed"
                        ? "bg-green-500/80 text-black"
                        : "bg-red-500/80 text-black"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-lg font-semibold text-foreground">
                        {booking.hotelName}
                      </h2>
                      <p className="text-sm text-muted-foreground">{booking.location}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guest</span>
                      <span className="text-foreground font-medium">{booking.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="text-foreground font-medium">{booking.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="text-foreground font-medium">{booking.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nights</span>
                      <span className="text-foreground font-medium">{booking.nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room Type</span>
                      <span className="text-foreground font-medium">{booking.roomType}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total amount</p>
                      <p className="text-xl font-bold text-primary">${booking.totalAmount.toFixed(2)}</p>
                    </div>

                    {booking.status === "Confirmed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCancelBooking(booking.id as string)
                        }}
                        className="px-4 py-2 border border-border rounded-lg text-xs font-semibold text-muted-foreground hover:border-red-500 hover:text-red-500 transition"
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


