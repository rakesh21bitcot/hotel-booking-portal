"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ROUTES } from "@/utils/constants"
import { featuredHotels } from "@/utils/dummy-data"

interface DropdownProps {
  isOpen: boolean
  onClose: () => void
}

// Home Dropdown with Hotel Cards
export function HomeDropdown({ isOpen, onClose }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      ref={dropdownRef}
      className="fixed top-20 left-0 right-0 bg-white shadow-2xl z-40 home-dropdown"
      onMouseEnter={() => {}} // Keep open on hover
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {featuredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-video cursor-pointer"
              onMouseEnter={() => setHoveredCard(hotel.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img
                src={hotel.image || "/placeholder.svg"}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Overlay on Hover with fade-in animation */}
              <div className={`absolute inset-0 bg-black/70 transition-all duration-500 ease-out ${
                hoveredCard === hotel.id ? "opacity-100" : "opacity-0"
              }`}>
                <Link
                  href={`${ROUTES.PUBLIC.HOTEL_DETAIL}/${hotel.id}`}
                  className="hotel-card-overlay-button absolute inset-0 flex items-center justify-center"
                  onClick={onClose}
                >
                  <div className="button-split-hover px-6 py-3 rounded-lg font-semibold text-primary-foreground flex items-center gap-2 text-sm whitespace-nowrap">
                    <span>View Details</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </Link>
              </div>

              {/* Hotel Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                <h4 className="text-white font-semibold text-sm md:text-base mb-1">{hotel.name}</h4>
                <p className="text-white/90 text-xs md:text-sm">{hotel.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Pages Dropdown
export function PagesDropdown({ isOpen, onClose }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const pagesLinks = [
    { label: "About Us", href: ROUTES.PUBLIC.HOME },
    { label: "Service", href: ROUTES.PUBLIC.HOME },
    { label: "Service Details", href: ROUTES.PUBLIC.HOME },
    { label: "Our Animations", href: ROUTES.PUBLIC.HOME },
    { label: "Offers", href: ROUTES.PUBLIC.HOME },
    { label: "Gallery", href: ROUTES.PUBLIC.HOME },
    { label: "Pricing", href: ROUTES.PUBLIC.HOME },
    { label: "Testimonial", href: ROUTES.PUBLIC.HOME },
    { label: "Book An Appointment", href: ROUTES.PUBLIC.HOME },
  ]

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl z-50 min-w-[200px] py-2 nav-dropdown"
      onMouseEnter={() => {}} // Keep open on hover
      onMouseLeave={onClose}
    >
      {pagesLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="block px-6 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-primary transition-colors"
          onClick={onClose}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}

// Room Dropdown
export function RoomDropdown({ isOpen, onClose }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const roomLinks = [
    { label: "Room", href: ROUTES.PUBLIC.HOTELS },
    { label: "Room Details", href: ROUTES.PUBLIC.HOTELS },
  ]

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl z-50 min-w-[180px] py-2 nav-dropdown"
      onMouseEnter={() => {}} // Keep open on hover
      onMouseLeave={onClose}
    >
      {roomLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="block px-6 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-primary transition-colors"
          onClick={onClose}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}

// Destination Dropdown
export function DestinationDropdown({ isOpen, onClose }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const destinationLinks = [
    { label: "Destination", href: ROUTES.PUBLIC.DESTINATIONS },
    { label: "Destination Details", href: ROUTES.PUBLIC.DESTINATIONS },
  ]

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl z-50 min-w-[200px] py-2 nav-dropdown"
      onMouseEnter={() => {}} // Keep open on hover
      onMouseLeave={onClose}
    >
      {destinationLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="block px-6 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-primary transition-colors"
          onClick={onClose}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}

// Blog Dropdown
export function BlogDropdown({ isOpen, onClose }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const blogLinks = [
    { label: "Blog", href: ROUTES.PUBLIC.BLOG },
    { label: "Blog Grid", href: ROUTES.PUBLIC.BLOG },
    { label: "Blog Details", href: ROUTES.PUBLIC.BLOG },
  ]

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl z-50 min-w-[180px] py-2 nav-dropdown"
      onMouseEnter={() => {}} // Keep open on hover
      onMouseLeave={onClose}
    >
      {blogLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="block px-6 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-primary transition-colors"
          onClick={onClose}
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}

