"use client"
import Link from "next/link"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { addHotelToCart, removeHotelFromCart } from "@/store/actions/user-action"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/utils/constants"
import { toast } from "sonner"
import { forWarning } from "@/utils/CommonService"

interface RoomCardProps {
  id: string
  name: string
  type: string
  capacity: number
  price: number | string
  image: string
  amenities: string[]
}

export default function RoomCard({ id, name, type, capacity, price, image }: RoomCardProps) {
  const dispatch = useAppDispatch()
  const cart = useAppSelector((state) => state.user.cart)
  const authState = useAppSelector((state) => state.auth)
  const isAuthenticated = !!authState.access_token && !!authState.user
  const isInCart = cart.some((h) => h.id === id)
  const [isSaved, setIsSaved] = useState(isInCart)
  const router = useRouter()

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition animate-fade-in">
      {/* Image */}
      <div className="relative aspect-video bg-secondary overflow-hidden group">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            if (!isAuthenticated) {
              forWarning("Please login or sign up to save favourites.")
              router.push(ROUTES.PUBLIC.LOGIN)
              return
            }
            if (isInCart) {
              dispatch(removeHotelFromCart(id))
              setIsSaved(false)
            } else {
              dispatch(
                addHotelToCart({
                  id,
                  name,
                  location: '',
                  image,
                  price,
                  rating: 0,
                  reviewCount: 0,
                })
              )
              setIsSaved(true)
            }
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 transition z-10"
        >
          <svg
            className={`w-5 h-5 ${isInCart || isSaved ? "fill-red-500 text-red-500" : "text-white"}`}
            fill={isInCart || isSaved ? "currentColor" : "none"}
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
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-serif text-lg font-semibold text-foreground mb-1">{name}</h4>
            <span className="inline-block px-3 py-1 bg-secondary text-foreground text-xs rounded font-semibold">
              {type}
            </span>
          </div>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-2 mb-4 text-muted-foreground text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Up to {capacity} guests</span>
        </div>

        {/* Amenities */}
        <div className="flex gap-4 mb-6 text-muted-foreground">
          <div title="WiFi">
            <svg
              className="w-5 h-5 hover:text-primary transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          </div>
          <div title="TV">
            <svg
              className="w-5 h-5 hover:text-primary transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5.02-4.98a9 9 0 10-12.728 12.728A9 9 0 0015.98 7.02z"
              />
            </svg>
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-primary">${price}</span>
            <span className="text-xs text-muted-foreground ml-2">per night</span>
          </div>
          <Link
            href={`/room/${id}`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:bg-accent transition text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
