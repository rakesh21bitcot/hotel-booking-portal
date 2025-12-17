 "use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hook"
import { HotelCard } from "@/components/modules/hotel/components"
import Link from "next/link"
import { fetchFavourites } from "@/store/actions/favourite-actions"

export default function CartPage() {
  const dispatch = useAppDispatch()
  const favourites = useAppSelector((state) => state.favourite.favourites)
  const favouritesLoading = useAppSelector((state) => state.favourite.favouritesLoading)
  const error = useAppSelector((state) => state.favourite.error)

  useEffect(() => {
    dispatch(fetchFavourites())
  }, [dispatch])

  return (
    <main className="bg-black min-h-screen">

      <section className="pt-24 pb-12 bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Your Favourite Hotels</h1>
          <p className="text-muted-foreground">
            Review the hotels you&apos;ve added to favourites and proceed to booking when you&apos;re ready.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {favouritesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : favourites.length === 0 ? (
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
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 items-start">
            {/* Favourites list */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {favourites?.map((favourite) => (
                  <div key={favourite?.id}>
                    <HotelCard
                      id={favourite?.hotelId}
                      name={favourite?.hotel?.name}
                      location={`${favourite?.hotel?.location?.city}, ${favourite?.hotel?.location?.country}`}
                      image={favourite?.hotel?.images[0]}
                      price={Number(favourite?.hotel?.price)}
                      rating={favourite?.hotel?.rating}
                      reviews={favourite?.hotel?.reviewCount}
                      favourite={favourite?.hotel?.isFavourite}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

    </main>
  )
}
