"use client"

import Link from "next/link"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { useBooking } from "@/modules/booking/hooks/useBooking"
import { ROUTES } from "@/utils/constants"
import { formatCurrency } from "@/utils/formatters"

export default function Dashboard() {
  const { user } = useAuth()
  const { bookings } = useBooking()

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-serif">Welcome, {user?.firstName}!</h1>
          <p className="text-muted-foreground">Manage your bookings and profile</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded border border-border">
            <p className="text-muted-foreground text-sm mb-2">Total Bookings</p>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </div>
          <div className="bg-card p-6 rounded border border-border">
            <p className="text-muted-foreground text-sm mb-2">Account Type</p>
            <p className="text-3xl font-bold capitalize">{user?.role}</p>
          </div>
          <div className="bg-card p-6 rounded border border-border">
            <p className="text-muted-foreground text-sm mb-2">Email</p>
            <p className="text-lg font-medium truncate">{user?.email}</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-card p-6 rounded border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-serif">Recent Bookings</h2>
            <Link href={ROUTES.PROTECTED.BOOKINGS} className="text-primary hover:text-primary/90 text-sm font-medium">
              View All
            </Link>
          </div>

          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex justify-between items-center p-4 bg-background rounded border border-border"
                >
                  <div>
                    <p className="font-medium">Hotel #{booking.hotelId}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(booking.totalPrice)}</p>
                    <p className="text-sm text-muted-foreground capitalize">{booking.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No bookings yet</p>
          )}
        </div>
      </div>
    </main>
  )
}
