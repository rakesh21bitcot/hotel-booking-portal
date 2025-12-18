"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { RoomCard, RatingDisplay } from "../components"
import { TestimonialCard } from "@/components/modules/landingPage/components"
import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { addHotelToCart, removeHotelFromCart } from "@/store/actions/user-action"
import { fetchHotelDetails, Reviews } from "@/store/actions/hotel-actions"
import { useRouter, useParams } from "next/navigation"
import { ROUTES } from "@/utils/constants"
import { forWarning } from "@/utils/CommonService"


export default function HotelDetailPage() {
  const [imageIndex, setImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useParams()
  const hotelId = params.id as string

  // Redux state
  const { currentHotel, hotelDetailsLoading, error } = useAppSelector((state) => state.hotel)
  const cart = useAppSelector((state) => state.user.cart)
  const authState = useAppSelector((state) => state.auth)
  const isAuthenticated = !!authState.access_token && !!authState.user
  const isInCart = currentHotel ? cart.some((h) => h.id === currentHotel.id) : false
  
  // Fetch hotel details on component mount
  useEffect(() => {
    if (hotelId) {
      dispatch(fetchHotelDetails(hotelId))
    }
  }, [dispatch, hotelId])

  const nextImage = () => {
    if (currentHotel?.images) {
      setImageIndex((prev) => (prev + 1) % currentHotel.images.length)
    }
  }

  const prevImage = () => {
    if (currentHotel?.images) {
      setImageIndex((prev) => (prev - 1 + currentHotel.images.length) % currentHotel.images.length)
    }
  }

  // Show loading state
  if (hotelDetailsLoading) {
    return (
      <main className="bg-black min-h-screen">
        <div className="pt-20 max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-secondary rounded-lg mb-8"></div>
            <div className="h-8 bg-secondary rounded mb-4"></div>
            <div className="h-4 bg-secondary rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-secondary rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Show error state
  if (error) {
    return (
      <main className="bg-black min-h-screen">
        <div className="pt-20 max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Hotel</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <button
              onClick={() => router.push('/hotels')}
              className="px-6 cursor-pointer py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
            >
              Back to Hotels
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Show not found state
  if (!currentHotel) {
    return (
      <main className="bg-black min-h-screen">
        <div className="pt-20 max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Hotel Not Found</h1>
            <p className="text-muted-foreground mb-8">The hotel you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/hotels')}
              className="px-6 cursor-pointer py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
            >
              Back to Hotels
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-black min-h-screen">
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
            <span>{currentHotel?.name}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden group">
            <img
              src={currentHotel?.images[imageIndex].url}
              alt={currentHotel?.images[imageIndex].alt}
              className="w-full h-full object-cover"
            />

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded text-sm text-white">
              {imageIndex + 1} / {currentHotel?.images?.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {currentHotel?.images?.map((image, i) => (
              <button
                key={i}
                onClick={() => setImageIndex(i)}
                className={`h-20 cursor-pointer w-28 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                  i === imageIndex ? "border-primary" : "border-border"
                }`}
              >
                <img src={image?.url || "/placeholder.svg"} alt={image?.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Header Info */}
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">{currentHotel?.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <span>{`${currentHotel?.location?.city}, ${currentHotel?.location?.country}`}</span>
              </div>
              <RatingDisplay rating={currentHotel?.rating} reviewCount={currentHotel?.reviewCount} />
            </div>

            <div className="flex gap-3">
              <button className=" cursor-pointer p-3 border border-border rounded-lg hover:border-primary transition">
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
            {currentHotel?.description}
          </p>
        </section>

        {/* Amenities */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {currentHotel?.amenities?.map((amenity, i) => (
              <div key={i} className="text-center">
                <div className="text-primary text-4xl mb-2">✓</div>
                <span className="text-muted-foreground">{amenity?.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Rooms */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">Available Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentHotel?.rooms?.map((room) => (
              <RoomCard
                key={room.id}
                id={room.id}
                hotelId={currentHotel.id}
                name={room.title}
                type={room?.beds[0]?.type}
                price={room?.base_price}
                capacity={room.quantity}
                image={room.images[0].url}
                amenities={room?.amenities?.slice(0, 3)}
              />
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-8">Guest Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentHotel?.reviews?.map((review: Reviews, i) => {
            return (
              <TestimonialCard key={i} {...review}/>
            )
          })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary border-y border-border py-16 mb-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Ready to Book?</h2>
            <p className="text-muted-foreground mb-6">Select a room above and proceed to checkout</p>
            <p className="text-2xl font-bold text-primary">
              From ${currentHotel.price}/Night
            </p>
          </div>
        </section>
      </div>

     
    </main>
  )
}
