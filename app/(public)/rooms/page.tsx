"use client"

import { useState, useEffect } from "react"
import { useHotels } from "@/modules/hotel/hooks/useHotels"
import { HotelCard } from "@/components/HotelCard"
import { Loader } from "@/components/common/Loader"
import { EmptyState } from "@/components/common/EmptyState"
import { dummyHotels } from "@/utils/dummy-data"

export default function HotelsPage() {
  const { hotels, isLoading, getHotels } = useHotels()
  const [sortBy, setSortBy] = useState<"price" | "rating">("price")

  useEffect(() => {
    getHotels()
  }, [])

  const sortedHotels = [...(hotels.length > 0 ? hotels : dummyHotels)].sort((a, b) => {
    if (sortBy === "price") return a.pricePerNight - b.pricePerNight
    return b.rating - a.rating
  })

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-serif">Find Your Perfect Hotel</h1>
          <p className="text-muted-foreground">Browse our collection of luxury stays</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-muted-foreground">Showing {sortedHotels.length} results</div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "price" | "rating")}
              className="px-4 py-2 bg-card border border-border rounded text-sm"
            >
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : sortedHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <EmptyState title="No hotels found" description="Try adjusting your search criteria" />
        )}
      </div>
    </main>
  )
}
