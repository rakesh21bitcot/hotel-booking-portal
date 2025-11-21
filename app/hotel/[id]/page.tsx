"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import RoomCard from "@/components/RoomCard"
import RatingDisplay from "@/components/RatingDisplay"
import TestimonialCard from "@/components/TestimonialCard"
import { useState } from "react"
import { hotelData } from "@/utils/dummy-data"



export default function HotelDetailPage() {
  const [imageIndex, setImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % hotelData.images.length)
  }

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + hotelData.images.length) % hotelData.images.length)
  }

  return (
    <main className="bg-black min-h-screen">
      <Header />

      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-xs text-muted-foreground">
            <a href="/" className="hover:text-primary transition">
              Home
            </a>
            <span className="mx-2">/</span>
            <a href="/hotels" className="hover:text-primary transition">
              Hotels
            </a>
            <span className="mx-2">/</span>
            <span>{hotelData.name}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden group">
            <img
              src={hotelData.images[imageIndex] || "/placeholder.svg"}
              alt={hotelData.name}
              className="w-full h-full object-cover"
            />

            {/* Navigation Buttons */}
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
              {imageIndex + 1} / {hotelData.images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {hotelData.images.map((image, i) => (
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
        </div>

        {/* Header Info */}
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">{hotelData.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <span>{hotelData.location}</span>
              </div>
              <RatingDisplay rating={hotelData.rating} reviewCount={hotelData.reviews.length} />
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
        </div>

        {/* Description */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">About</h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
            {hotelData.description} Indulge in world-class amenities, exceptional service, and breathtaking views. Our
            hotel is perfectly situated for business travelers and tourists alike, offering easy access to major
            attractions and business districts.
          </p>
        </section>

        {/* Amenities */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {hotelData.amenities.map((amenity, i) => (
              <div key={i} className="text-center">
                <div className="text-primary text-4xl mb-2">✓</div>
                <span className="text-muted-foreground">{amenity}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Rooms */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">Available Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hotelData.rooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">Guest Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hotelData.reviews.map((review, i) => (
              <TestimonialCard key={i} {...review} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary border-y border-border py-16 mb-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Ready to Book?</h2>
            <p className="text-muted-foreground mb-6">Select a room above and proceed to checkout</p>
            <p className="text-2xl font-bold text-primary">From ${hotelData.price}/night</p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
