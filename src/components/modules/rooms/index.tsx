"use client"

import { use, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hook"
import { RoomDetails } from "./components"
import { fetchRoomDetails } from "@/store/actions/hotel-actions"

interface PageProps {
  params: Promise<{ id: string; roomId?: string }>
}

export default function RoomPage({ params }: PageProps) {
  const { id: hotelId, roomId } = use(params)
  const dispatch = useAppDispatch()

  const {
    currentHotel,
    currentRoom,
    roomDetailsLoading,
    error
  } = useAppSelector((state) => state.hotel)

  useEffect(() => {
    // Try to get room details if we have both hotel and room IDs
    if (hotelId && roomId) {
      dispatch(fetchRoomDetails(hotelId, roomId))
    }
  }, [dispatch, hotelId, roomId])

  // Show loading state
  if (roomDetailsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-muted rounded mb-4 mx-auto w-48"></div>
          <div className="h-4 bg-muted rounded mb-2 mx-auto w-32"></div>
          <div className="h-64 bg-muted rounded mt-8 mx-auto w-96"></div>
        </div>
      </div>
    )
  }

  // Show error if no hotel context
  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Room Access Error</h1>
          <p className="text-muted-foreground mb-6">
            Please navigate to this room from the hotel details page.
          </p>
          <a
            href="/hotels"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition inline-block"
          >
            Browse Hotels
          </a>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Error Loading Room</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <a
            href={`/hotel/${hotelId}`}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition inline-block mr-4"
          >
            Back to Hotel
          </a>
          <a
            href="/hotels"
            className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition inline-block"
          >
            Browse Hotels
          </a>
        </div>
      </div>
    )
  }

  // Show room not found
  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Room Not Found</h1>
          <p className="text-muted-foreground mb-6">The room you're looking for doesn't exist.</p>
          <a
            href={`/hotel/${hotelId}`}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition inline-block mr-4"
          >
            Back to Hotel
          </a>
          <a
            href="/hotels"
            className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition inline-block"
          >
            Browse Hotels
          </a>
        </div>
      </div>
    )
  }

  // Convert API room data to component format
  const roomData = {
    id: currentRoom.id,
    name: currentRoom.title,
    type: currentRoom.view || "Standard",
    capacity: currentRoom.quantity,
    price: currentRoom.base_price,
    image: currentRoom.images[0]?.url || "/placeholder.svg",
    amenities: currentRoom.amenities,
    description: currentRoom.description,
    images: currentRoom.images.map(img => img.url),
    hotelId: currentRoom.hotel.id,
  }

  const hotelData = {
    id: currentRoom.hotel.id,
    name: currentRoom.hotel.name,
    location: currentRoom.hotel.location,
    rating: currentRoom.hotel.rating,
    reviewCount: currentRoom.hotel.reviewCount
  }

  return <RoomDetails room={roomData} hotel={hotelData} />
}