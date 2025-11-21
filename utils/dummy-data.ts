import type { Destination, User } from "@/types"

export const dummyUser: User = {
  id: "1",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  avatar: "/placeholder-user.jpg",
  role: "user",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
}

export const dummyHotels = [
  {
    id: "1",
    name: "Luxury Beach Resort",
    location: "Miami, Florida",
    rating: 4.8,
    reviewCount: 2150,
    pricePerNight: 250,
    image: "/beachfront-resort.jpg",
    amenities: ["Pool", "WiFi", "Gym", "Restaurant"],
    description: "Beautiful beachfront resort with world-class amenities",
  },
  {
    id: "2",
    name: "Mountain Lodge",
    location: "Aspen, Colorado",
    rating: 4.6,
    reviewCount: 890,
    pricePerNight: 180,
    image: "/cozy-mountain-lodge.png",
    amenities: ["Fireplace", "WiFi", "Mountain View", "Bar"],
    description: "Cozy mountain retreat perfect for nature lovers",
  },
]

export const dummyRooms = [
  {
    id: "101",
    hotelId: "1",
    name: "Deluxe Ocean View",
    type: "Deluxe",
    capacity: 2,
    price: 250,
    amenities: ["King Bed", "Ocean View", "Balcony", "Mini Bar"],
  },
  {
    id: "102",
    hotelId: "1",
    name: "Presidential Suite",
    type: "Suite",
    capacity: 4,
    price: 500,
    amenities: ["Multiple Beds", "Jacuzzi", "Ocean View", "Dining Area"],
  },
]

export const dummyTestimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Travel Enthusiast",
    rating: 5,
    message: "Excellent service and beautiful rooms. Highly recommended!",
    avatar: "/serene-woman.png",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Business Traveler",
    rating: 5,
    message: "Great location, comfortable beds, and friendly staff.",
    avatar: "/man-face.png",
  },
  {
    id: "3",
    name: "Emma Davis",
    role: "Leisure Traveler",
    rating: 4,
    message: "Perfect for a relaxing vacation. Will definitely stay again.",
    avatar: "/diverse-woman-smiling.png",
  },
]

export const hotelData = {
  id: "1",
  name: "Luxury Grand Hotel",
  location: "New York, USA",
  description: "Experience luxury at its finest in our iconic hotel located in the heart of Manhattan.",
  rating: 4.8,
  // reviews: 1250,
  price: 250,
  images: [
    "/placeholder.svg?key=74aex",
    "/placeholder.svg?key=h8b66",
    "/placeholder.svg?key=quajy",
    "/placeholder.svg?key=tlkyb",
  ],
  amenities: ["WiFi", "TV", "AC", "Restaurant", "Gym", "Pool", "Parking", "Coffee"],
  rooms: [
    {
      id: "r1",
      name: "Deluxe Room",
      type: "Deluxe",
      capacity: 2,
      price: 250,
      image: "/placeholder.svg?key=l1uqe",
      amenities: ["WiFi", "TV", "AC"],
    },
    {
      id: "r2",
      name: "Suite",
      type: "Suite",
      capacity: 4,
      price: 450,
      image: "/placeholder.svg?key=dqpns",
      amenities: ["WiFi", "TV", "AC", "Kitchenette"],
    },
    {
      id: "r3",
      name: "Presidential Suite",
      type: "Suite",
      capacity: 6,
      price: 800,
      image: "/placeholder.svg?key=i6vlx",
      amenities: ["WiFi", "TV", "AC", "Kitchenette", "Jacuzzi"],
    },
  ],
  reviews: [
    {
      name: "Sarah Johnson",
      role: "Verified Guest",
      avatar: "/placeholder.svg?key=ffi5b",
      rating: 5,
      text: "Absolutely stunning hotel! The staff was incredibly helpful and the rooms were immaculate.",
      date: "2 weeks ago",
    },
    {
      name: "Michael Chen",
      role: "Verified Guest",
      avatar: "/placeholder.svg?key=agwp6",
      rating: 5,
      text: "Best hotel experience I have ever had. Everything was perfect from check-in to check-out.",
      date: "1 month ago",
    },
    {
      name: "Emma Davis",
      role: "Verified Guest",
      avatar: "/placeholder.svg?key=naszx",
      rating: 4,
      text: "Great location and beautiful rooms. Highly recommend for anyone visiting NYC.",
      date: "3 weeks ago",
    },
  ],
}

// Mock data
export const featuredHotels = [
  {
    id: "1",
    name: "Luxury Grand Hotel",
    location: "New York, USA",
    image: "/luxury-hotel-room.png",
    price: 250,
    rating: 4.8,
    reviews: 1250,
    featured: true,
  },
  {
    id: "2",
    name: "Beachfront Paradise",
    location: "Miami, USA",
    image: "/beachfront-resort.jpg",
    price: 180,
    rating: 4.9,
    reviews: 890,
    featured: true,
  },
  {
    id: "3",
    name: "Mountain Retreat",
    location: "Denver, USA",
    image: "/cozy-mountain-lodge.png",
    price: 220,
    rating: 4.7,
    reviews: 650,
  },
  {
    id: "4",
    name: "Urban Boutique",
    location: "San Francisco, USA",
    image: "/boutique-hotel-interior.jpg",
    price: 200,
    rating: 4.6,
    reviews: 720,
  },
]

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Travel Enthusiast",
    avatar: "/serene-woman.png",
    rating: 5,
    text: "EliteStay made booking my vacation so easy! The interface is intuitive and the prices are unbeatable.",
    date: "2 weeks ago",
  },
  {
    name: "Michael Chen",
    role: "Business Traveler",
    avatar: "/man-face.png",
    rating: 5,
    text: "I travel every month for work and EliteStay is now my go-to platform. Reliable and trustworthy.",
    date: "1 month ago",
  },
  {
    name: "Emma Davis",
    role: "Adventure Seeker",
    avatar: "/diverse-woman-smiling.png",
    rating: 4,
    text: "Great selection of unique properties. Found hidden gems that I would never have discovered elsewhere.",
    date: "3 weeks ago",
  },
]

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Coxsbazar",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    name: "Bandarban",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
  },
  {
    id: "3",
    name: "sylhet",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
  },
  {
    id: "4",
    name: "Cumilla",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
  },
  {
    id: "5",
    name: "Dhaka",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
  },
]

export const dummyBlogPosts = [
  {
    id: "1",
    date: "09 APR 2021",
    comments: 0,
    title: "Eal Stories From The Road Where Every Journey Leaves A Mark",
    excerpt: "Discover amazing travel stories and experiences from around the world...",
    image: "https://wowtheme7.com/tf/elitestay/assets/images/thumbs/blog-thumb1.jpg",
    slug: "real-stories-from-the-road",
  },
  {
    id: "2",
    date: "02 APR 2021",
    comments: 12,
    title: "Eal Stories From The Road Where Every Journey Leaves A Mark",
    excerpt: "Explore the hidden gems and unforgettable moments from our travel adventures...",
    image: "/luxury-hotel-bedroom.jpg",
    slug: "travel-adventures-2021",
  },
  {
    id: "3",
    date: "03 APR 2021",
    comments: 0,
    title: "Eal Stories From The Road Where Every Journey Leaves A Mark",
    excerpt: "Join us as we share incredible destinations and travel tips...",
    image: "/luxury-hotel-room.png",
    slug: "destination-guide-2021",
  },
  {
    id: "4",
    date: "03 APR 2021",
    comments: 0,
    title: "Eal Stories From The Road Where Every Journey Leaves A Mark",
    excerpt: "Experience luxury resorts and breathtaking views from around the globe...",
    image: "/tropical-beach-resort.png",
    slug: "luxury-resorts-guide",
  },
]

export const hotelPackages = [
  {
    id: "1",
    name: "Premier Oceanview Villa Fxcv",
    price: 99,
    guests: 4,
    beds: 2,
    area: 400,
    image: "/luxury-hotel-lobby.png",
    featured: true, // This will be the large card
  },
  {
    id: "2",
    name: "Luxury Seaside Villa",
    price: 99,
    guests: 4,
    beds: 2,
    area: 400,
    image: "/modern-skyscraper-hotel.jpg",
    featured: false,
  },
  {
    id: "3",
    name: "Elite Oceanfront Retreat",
    price: 99,
    guests: 4,
    beds: 2,
    area: 400,
    image: "/luxury-hotel-bedroom.jpg",
    featured: false,
  },
  {
    id: "4",
    name: "Signature Coastal Villa",
    price: 99,
    guests: 4,
    beds: 2,
    area: 400,
    image: "/boutique-hotel-interior.jpg",
    featured: false,
  },
  {
    id: "5",
    name: "Exclusive Oceanview Escape",
    price: 99,
    guests: 4,
    beds: 2,
    area: 400,
    image: "/luxury-hotel-room.png",
    featured: false,
  },
  {
    id: "6",
    name: "Deluxe Beachfront Suite",
    price: 99,
    guests: 4,
    beds: 2,
    area: 400,
    image: "/beachfront-resort.jpg",
    featured: false,
  },
]

