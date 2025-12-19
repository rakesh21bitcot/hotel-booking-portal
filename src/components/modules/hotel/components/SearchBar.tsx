"use client"

import { useState } from "react"

interface SearchBarProps {
  compact?: boolean
  location?: string
  onLocationChange?: (location: string) => void
  onSearch?: (filters: { location: string; checkIn: string; checkOut: string; guests: string }) => void
}

export default function SearchBar({
  compact = false,
  location: externalLocation,
  onLocationChange,
  onSearch
}: SearchBarProps) {
  const [internalLocation, setInternalLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("1")

  // Use external location if provided, otherwise use internal state
  const location = externalLocation !== undefined ? externalLocation : internalLocation
  const setLocation = onLocationChange || setInternalLocation

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ location, checkIn, checkOut, guests })
    } else {
      console.log("[v0] Searching for hotels:", { location, checkIn, checkOut, guests })
    }
  }

  if (compact) {
    return (
      <div className="flex flex-col md:flex-row gap-3 bg-card border border-border rounded p-4">
        <div className="flex-1 flex items-center gap-2 bg-secondary rounded px-4">
          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
        <div className="flex-1 flex items-center bg-secondary cursor-pointer rounded px-4">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-transparent calender_icon outline-none w-full text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:text-primary! [&::-webkit-calendar-picker-indicator]:order-first! [&::-webkit-calendar-picker-indicator]:mr-2!"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-8 cursor-pointer py-2 bg-primary text-primary-foreground rounded font-semibold hover:bg-accent transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 max-w-4xl mx-auto">
      {/* Location */}
      <div className="flex flex-col">
        <label className="text-xs text-muted-foreground mb-2 font-semibold">Location</label>
        <div className="flex items-center gap-2 bg-secondary rounded px-4 py-3">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Check-in Date */}
      <div className="flex flex-col">
        <label className="text-xs text-muted-foreground mb-2 font-semibold">Check-in</label>
        <div className="bg-secondary rounded px-4 py-3">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-transparent outline-none w-full text-foreground cursor-pointer [&::-webkit-calendar-picker-indicator]:text-primary! [&::-webkit-calendar-picker-indicator]:order-first! [&::-webkit-calendar-picker-indicator]:mr-2!"
          />
        </div>
      </div>

      {/* Check-out Date */}
      <div className="flex flex-col">
        <label className="text-xs text-muted-foreground mb-2 font-semibold">Check-out</label>
        <div className="bg-secondary rounded px-4 py-3">
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="bg-transparent outline-none w-full text-foreground cursor-pointer [&::-webkit-calendar-picker-indicator]:text-primary! [&::-webkit-calendar-picker-indicator]:order-first! [&::-webkit-calendar-picker-indicator]:mr-2!"
          />
        </div>
      </div>

      {/* Guests & Search */}
      <div className="flex flex-col">
        <label className="text-xs text-muted-foreground mb-2 font-semibold">Guests</label>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-secondary rounded px-4 py-3">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="bg-transparent outline-none w-full text-foreground"
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4+</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="px-6 cursor-pointer py-3 bg-primary text-primary-foreground rounded hover:bg-accent transition font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search
          </button>
        </div>
      </div>
    </div>
  )
}
