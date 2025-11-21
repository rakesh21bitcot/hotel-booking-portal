"use client"

import { useState } from "react"
import Link from "next/link"

interface HotelCardProps {
  hotel?: {
    id: string
    name: string
    location: string
    image: string
    price: number
    rating: number
    reviewCount: number
  }
  id?: string
  name?: string
  location?: string
  image?: string
  price?: number
  rating?: number
  reviews?: number
  featured?: boolean
  delay?: number
}

export default function HotelCard({
  hotel,
  id = hotel?.id || "",
  name = hotel?.name || "",
  location = hotel?.location || "",
  image = hotel?.image || "",
  price = hotel?.price || 0,
  rating = hotel?.rating || 0,
  reviews = hotel?.reviewCount || 0,
  featured,
  delay = 0,
}: HotelCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  return (
    <Link href={`/hotel/${id}`}>
      <div className="group cursor-pointer animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
        <div className="relative overflow-hidden rounded-lg mb-4 bg-secondary aspect-video">
          {/* Image */}
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded font-semibold">View Details</button>
          </div>

          {/* Badge */}
          {featured && (
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsSaved(!isSaved)
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 transition"
          >
            <svg
              className={`w-5 h-5 ${isSaved ? "fill-red-500 text-red-500" : "text-white"}`}
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
        </div>

        {/* Content */}
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition">
            {name}
          </h3>

          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <span>{location}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.floor(rating) ? "text-primary" : "text-muted"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating} ({reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">${price}</span>
            <span className="text-sm text-muted-foreground">per night</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export { HotelCard }
