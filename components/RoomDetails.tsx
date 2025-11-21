"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PriceBreakdown from "@/components/PriceBreakdown"
import RatingDisplay from "@/components/RatingDisplay"

interface RoomDetailsProps {
  room: {
    id: string
    name: string
    type: string
    capacity: number
    price: number
    image: string
    amenities: string[]
    description?: string
    images?: string[]
    hotelId?: string
  }
  hotel?: {
    id: string
    name: string
    location: string
  }
}

export default function RoomDetails({ room, hotel }: RoomDetailsProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [isSaved, setIsSaved] = useState(false)

  // Calculate nights
  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 1

  // Calculate prices
  const subtotal = room.price * nights
  const tax = subtotal * 0.1 // 10% tax
  const fees = 25 // Service fee
  const total = subtotal + tax + fees

  // Use room.images if available, otherwise use room.image
  const images = room.images || [room.image]
  const currentImage = images[imageIndex] || "/placeholder.svg"

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleBookNow = () => {
    // Navigate to booking page with room details
    const params = new URLSearchParams({
      roomId: room.id,
      checkIn,
      checkOut,
      guests: guests.toString(),
    })
    if (hotel) {
      params.append("hotelId", hotel.id)
    }
    window.location.href = `/booking?${params.toString()}`
  }

  return (
    <main className="bg-background min-h-screen">
      <Header />

      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition">
              Home
            </Link>
            <span className="mx-2">/</span>
            {hotel && (
              <>
                <Link href="/hotels" className="hover:text-primary transition">
                  Hotels
                </Link>
                <span className="mx-2">/</span>
                <Link href={`/hotel/${hotel.id}`} className="hover:text-primary transition">
                  {hotel.name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span>{room.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden group">
                <img
                  src={currentImage}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded text-sm text-white">
                      {imageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {images.map((image, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i)}
                      className={`h-20 w-28 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                        i === imageIndex ? "border-primary" : "border-border"
                      }`}
                    >
                      <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Room Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">{room.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="inline-block px-3 py-1 bg-secondary text-foreground text-sm rounded font-semibold">
                      {room.type}
                    </span>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Up to {room.capacity} guests</span>
                    </div>
                  </div>
                  {hotel && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      <span>{hotel.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className="p-3 border border-border rounded-lg hover:border-primary transition"
                  >
                    <svg
                      className={`w-5 h-5 ${isSaved ? "fill-red-500 text-red-500" : ""}`}
                      fill={isSaved ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button className="p-3 border border-border rounded-lg hover:border-primary transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C9.822 10.938 11.956 9 14.5 9c.993 0 1.953.138 2.863.403M6.883 17.116A8.226 8.226 0 005 12.25A8.25 8.25 0 1013.75 21"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description */}
              {room.description && (
                <section>
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">About This Room</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {room.description}
                  </p>
                </section>
              )}

              {/* Amenities */}
              <section>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">Room Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {room.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="text-primary text-xl">✓</div>
                      <span className="text-muted-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Room Features */}
              <section className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Room Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-muted-foreground">Capacity: {room.capacity} guests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-muted-foreground">Room Type: {room.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-muted-foreground">Check-in: 3:00 PM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-muted-foreground">Check-out: 11:00 AM</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Price Display */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">${room.price}</span>
                    <span className="text-muted-foreground ml-2">per night</span>
                  </div>
                  <RatingDisplay rating={4.5} reviewCount={128} />
                </div>

                {/* Booking Form */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Book This Room</h3>
                  
                  {/* Check In */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Check In</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Check Out */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Check Out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Breakdown */}
                  {checkIn && checkOut && (
                    <PriceBreakdown
                      roomPrice={room.price}
                      nights={nights}
                      tax={tax}
                      fees={fees}
                    />
                  )}

                  {/* Book Now Button */}
                  <button
                    onClick={handleBookNow}
                    disabled={!checkIn || !checkOut}
                    className="button-split-hover w-full px-6 py-4 text-primary-foreground rounded-lg font-semibold hover:bg-accent hover:text-primary-foreground transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Book Now</span>
                    
                  </button>

                  {(!checkIn || !checkOut) && (
                    <p className="text-xs text-muted-foreground text-center">
                      Please select check-in and check-out dates
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

