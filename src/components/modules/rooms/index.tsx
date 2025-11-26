"use client"

import { use } from "react"
import { RoomDetails } from "./components"
import { dummyRooms, hotelData } from "@/utils/dummy-data"

interface PageProps {
  params: Promise<{ id: string }>
}

interface RoomData {
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

export default function RoomPage({ params }: PageProps) {
  const { id } = use(params)

  // Find room in dummy data
  // First check hotelData.rooms, then dummyRooms
  const foundRoom = hotelData.rooms.find((r) => r.id === id)
  let hotel = { id: hotelData.id, name: hotelData.name, location: hotelData.location }
  let room: RoomData | undefined

  if (foundRoom) {
    // Create enhanced room object with description and images
    room = {
      id: foundRoom.id,
      name: foundRoom.name,
      type: foundRoom.type,
      capacity: foundRoom.capacity,
      price: foundRoom.price,
      image: foundRoom.image,
      amenities: foundRoom.amenities,
      description: `Experience luxury and comfort in our ${foundRoom.name}. This ${foundRoom.type} room offers spacious accommodations perfect for ${foundRoom.capacity} guests, featuring premium amenities and elegant furnishings.`,
      images: [
        foundRoom.image,
        "/luxury-hotel-room.png",
        "/luxury-hotel-bedroom.jpg",
      ],
      hotelId: hotelData.id,
    }
  } else {
    const dummyRoom = dummyRooms.find((r) => r.id === id)
    if (dummyRoom) {
      // Create a more complete room object from dummyRoom
      room = {
        id: dummyRoom.id,
        name: dummyRoom.name,
        type: dummyRoom.type,
        capacity: dummyRoom.capacity,
        price: dummyRoom.price,
        image: "/deluxe-hotel-room.png", // Default image
        amenities: dummyRoom.amenities,
        description: `Experience luxury and comfort in our ${dummyRoom.name}. This ${dummyRoom.type} room offers spacious accommodations perfect for ${dummyRoom.capacity} guests.`,
        images: [
          "/deluxe-hotel-room.png",
          "/luxury-hotel-room.png",
          "/luxury-hotel-bedroom.jpg",
        ],
        hotelId: dummyRoom.hotelId,
      }
      // Find hotel for this room
      const roomHotel = hotelData.id === dummyRoom.hotelId 
        ? hotel 
        : { id: dummyRoom.hotelId, name: "Luxury Beach Resort", location: "Miami, Florida" }
      hotel = roomHotel
    }
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Room Not Found</h1>
          <p className="text-muted-foreground mb-6">The room you're looking for doesn't exist.</p>
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

  return <RoomDetails room={room} hotel={hotel} />
}