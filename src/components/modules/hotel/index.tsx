"use client"

import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hook"
import { HotelCard, SearchBar } from "./components"
import { fetchHotels, HotelFilters } from "@/store/actions/hotel-actions"
import { useAuth } from "../auth/hooks/useAuth"
import { API_CONFIG } from "@/lib/config"


export default function HotelComponent() {
  const dispatch = useAppDispatch()
  const {
    hotels,
    hotelsLoading,
    hotelsTotal,
    hotelsTotalPages,
    error
  } = useAppSelector((state) => state.hotel)
  const { user } = useAuth()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<HotelFilters>({
    location: "",
    userId: user?.id,
    minPrice: 0,
    maxPrice: 500,
    maxRating: 5,
    sortBy: 'featured'
  })

  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFeatured, setIsFeatured] = useState<boolean | null>(null)
  const [searchLocation, setSearchLocation] = useState("")

  // Fetch hotels on component mount and when filters change
  useEffect(() => {
    const hotelFilters: HotelFilters = {
      ...filters,
      maxRating: selectedRating || undefined,
      isFeatured: isFeatured || undefined
    }

    dispatch(fetchHotels(hotelFilters, currentPage, 12))
  }, [dispatch, filters, selectedRating, isFeatured, currentPage])

  // Handle filter changes
  const handlePriceRangeChange = (minPrice: number, maxPrice: number) => {
    setFilters(prev => ({
      ...prev,
      minPrice,
      maxPrice
    }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleRatingChange = (rating: number | null) => {
    setSelectedRating(rating)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleFeaturedChange = (featured: boolean | null) => {
    setIsFeatured(featured)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSearch = (searchFilters: { location: string; checkIn: string; checkOut: string; guests: string }) => {
    setFilters(prev => ({
      ...prev,
      location: searchFilters.location
    }))
    setCurrentPage(1) // Reset to first page when search changes
  }

  const handleLocationChange = (location: string) => {
    setSearchLocation(location)
  }

  const clearFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 500,
      minRating: 0,
      maxRating: 5,
      sortBy: 'featured'
    })
    setSelectedRating(null)
    setIsFeatured(null)
    setSearchLocation("")
    setCurrentPage(1)
  }


  return (
    <main className="bg-black min-h-screen">
      

      {/* Search Bar */}
      <div className="pt-24 pb-12 bg-secondary border-b border-border" >
        <div className="max-w-7xl mx-auto px-4">
          <SearchBar
            compact
            location={searchLocation}
            onLocationChange={handleLocationChange}
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64`}>
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-6 text-foreground">Filters</h3>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-semibold text-sm mb-4 text-foreground">Price Range</h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.maxPrice || 500}
                    onChange={(e) => handlePriceRangeChange(filters.minPrice || 0, Number.parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${filters.minPrice || 0}</span>
                    <span>${filters.maxPrice || 500}</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-sm mb-4 text-foreground">Rating</h4>
                <div className="space-y-3">
                  {[5, 4, 3].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => handleRatingChange(rating)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{rating}+ Stars</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured Hotels */}
              <div className="mb-8">
                <h4 className="font-semibold text-sm mb-4 text-foreground">Special Filters</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured === true}
                      onChange={(e) => handleFeaturedChange(e.target.checked ? true : null)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Featured Hotels Only</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full cursor-pointer px-4 py-2 border border-border rounded text-sm font-semibold hover:border-primary hover:text-primary transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{hotels.length}</span> of <span className="font-semibold text-foreground">{hotelsTotal}</span> results
                </p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={filters.sortBy}
                  onChange={(e) => {
                    const sortBy = e.target.value as "featured" | "price_low_to_high" | "price_high_to_low" | "highest_rating"
                    setFilters(prev => ({ ...prev, sortBy }))
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 bg-card border border-border rounded text-sm"
                  disabled={hotelsLoading}
                >
                  <option value="featured">Featured</option>
                  <option value="price_low_to_high">Price: Low to High</option>
                  <option value="price_high_to_low">Price: High to Low</option>
                  <option value="highest_rating">Highest Rating</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden cursor-pointer px-4 py-2 bg-card border border-border rounded text-sm flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  Filters
                </button>
              </div>
            </div>

            {/* Hotels Grid */}
            {hotelsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                    <div className="h-48 bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels?.map((hotel: any) => (
                  <HotelCard
                    key={hotel?.id}
                    id={hotel?.id}
                    name={hotel?.name}
                    location={`${hotel?.location?.city}, ${hotel?.location?.country}`}
                    rating={hotel?.rating}
                    price={hotel?.price}
                    image={hotel?.images[0]}
                    reviews={hotel?.reviewCount}
                    featured={hotel?.is_featured}
                    favourite={hotel?.isFavourite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No hotels found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 cursor-pointer px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {hotelsTotalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || hotelsLoading}
                  className="px-4 py-2 cursor-pointer border border-border rounded hover:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, hotelsTotalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(hotelsTotalPages - 4, currentPage - 2)) + i
                  if (pageNum > hotelsTotalPages) return null

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={hotelsLoading}
                      className={`px-4 py-2 cursor-pointer rounded transition ${
                        currentPage === pageNum
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(hotelsTotalPages, prev + 1))}
                  disabled={currentPage === hotelsTotalPages || hotelsLoading}
                  className="px-4 py-2 cursor-pointer border border-border rounded hover:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

     
    </main>
  )
}
