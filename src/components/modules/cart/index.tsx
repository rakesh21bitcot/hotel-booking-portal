 "use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAppSelector, useAppDispatch } from "@/store/hook"
import { removeHotelFromCart } from "@/store/actions/user-action"
import { HotelCard } from "@/components/modules/hotel/components"
import Link from "next/link"

export default function CartPage() {
  const dispatch = useAppDispatch()
  const cart = useAppSelector((state) => state.user.cart)

  const total = cart.reduce((sum, hotel) => sum + hotel.price, 0)

  return (
    <main className="bg-black min-h-screen">
      <Header />

      <section className="pt-24 pb-12 bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Your Liked Hotels</h1>
          <p className="text-muted-foreground">
            Review the hotels you&apos;ve liked and proceed to booking when you&apos;re ready.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6">You haven&apos;t liked any hotels yet.</p>
            <Link
              href="/hotels"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Browse Hotels
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-[2fr,1fr] gap-8 items-start">
            {/* Cart list */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cart.map((hotel) => (
                  <div key={hotel.id}>
                    <HotelCard
                      id={hotel.id}
                      name={hotel.name}
                      location={hotel.location}
                      image={hotel.image}
                      price={hotel.price}
                      rating={hotel.rating}
                      reviews={hotel.reviewCount}
                    />

                   
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <aside className="bg-card border border-border rounded-lg p-6 h-fit lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-semibold text-lg text-foreground mb-4">Cart Summary</h2>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hotels</span>
                  <span className="text-foreground font-medium">{cart.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated total per night</span>
                  <span className="text-foreground font-semibold">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/booking"
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
              >
                Proceed to booking
              </Link>
            </aside>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
