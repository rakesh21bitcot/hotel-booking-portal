"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { HotelCard, SearchBar } from "./components"
import { allHotels } from "@/utils/dummy-data"


export default function HotelComponent() {
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState("featured")
  
  

  // Filter hotels
  const filteredHotels = allHotels.filter((hotel) => {
    const priceMatch = hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
    const ratingMatch = selectedRating === null || hotel.rating >= selectedRating
    return priceMatch && ratingMatch
  })

  // Sort hotels
  if (sortBy === "price-low") {
    filteredHotels.sort((a, b) => a.price - b.price)
  } else if (sortBy === "price-high") {
    filteredHotels.sort((a, b) => b.price - a.price)
  } else if (sortBy === "rating") {
    filteredHotels.sort((a, b) => b.rating - a.rating)
  }

  return (
    <main className="bg-black min-h-screen">
      

      {/* Search Bar */}
      <div className="pt-24 pb-12 bg-secondary border-b border-border" >
        <div className="max-w-7xl mx-auto px-4">
          <SearchBar compact />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
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
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
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
                        onChange={() => setSelectedRating(rating)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{rating}+ Stars</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setPriceRange([0, 500])
                  setSelectedRating(null)
                }}
                className="w-full px-4 py-2 border border-border rounded text-sm font-semibold hover:border-primary hover:text-primary transition"
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
                  Showing <span className="font-semibold text-foreground">{filteredHotels.length}</span> results
                </p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-card border border-border rounded text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden px-4 py-2 bg-card border border-border rounded text-sm flex items-center gap-2"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} {...hotel} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-12">
              <button className="px-4 py-2 border border-border rounded hover:border-primary transition">
                Previous
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded">1</button>
              <button className="px-4 py-2 border border-border rounded hover:border-primary transition">2</button>
              <button className="px-4 py-2 border border-border rounded hover:border-primary transition">3</button>
              <button className="px-4 py-2 border border-border rounded hover:border-primary transition">Next</button>
            </div>
          </div>
        </div>
      </div>

     
    </main>
  )
}
