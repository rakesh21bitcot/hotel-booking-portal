"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ROUTES } from "@/utils/constants"
import { 
  HomeDropdown, 
  PagesDropdown, 
  RoomDropdown, 
  DestinationDropdown, 
  BlogDropdown 
} from "@/components/HeaderDropdowns"
import { useDropdown } from "@/hooks/useDropdown"
import Image from "next/image"
import { featuredHotels } from "@/utils/dummy-data"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { activeDropdown, openDropdown, closeDropdown, toggleDropdown, isOpen } = useDropdown()

  useEffect(() => {
    // Initial fade-in on page load
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Change background when scrolled
      if (currentScrollY > 50) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        hasScrolled 
          ? "bg-black/95 backdrop-blur-md border-b border-border" 
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href={ROUTES.PUBLIC.HOME} className="flex items-center gap-3">
          <Image src="https://wowtheme7.com/tf/elitestay/assets/images/logo/logo.png" alt="EliteStay" width={150} height={150} />
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex gap-6 items-center absolute left-1/2 -translate-x-1/2">
          {/* Home */}
          <div 
            className="relative"
            onMouseEnter={() => openDropdown("home")}
            onMouseLeave={() => closeDropdown()}
          >
            <Link 
              href={ROUTES.PUBLIC.HOME} 
              className="text-sm text-primary font-medium flex items-center gap-1 transition"
            >
              Home
              <svg className={`w-3 h-3 transition-transform ${isOpen("home") ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>

          {/* Pages */}
          <div 
            className="relative"
            onMouseEnter={() => openDropdown("pages")}
            onMouseLeave={() => closeDropdown()}
          >
            <Link 
              href={ROUTES.PUBLIC.HOTELS} 
              className="text-sm text-white font-medium flex items-center gap-1 hover:text-primary transition"
            >
              Pages
              <svg className={`w-3 h-3 transition-transform ${isOpen("pages") ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <PagesDropdown isOpen={isOpen("pages")} onClose={closeDropdown} />
          </div>

          {/* Room */}
          <div 
            className="relative"
            onMouseEnter={() => openDropdown("room")}
            onMouseLeave={() => closeDropdown()}
          >
            <Link 
              href={ROUTES.PUBLIC.HOTELS} 
              className="text-sm text-white font-medium flex items-center gap-1 hover:text-primary transition"
            >
              Room
              <svg className={`w-3 h-3 transition-transform ${isOpen("room") ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <RoomDropdown isOpen={isOpen("room")} onClose={closeDropdown} />
          </div>

          {/* Destination */}
          <div 
            className="relative"
            onMouseEnter={() => openDropdown("destination")}
            onMouseLeave={() => closeDropdown()}
          >
            <Link 
              href={ROUTES.PUBLIC.DESTINATIONS} 
              className="text-sm text-white font-medium flex items-center gap-1 hover:text-primary transition"
            >
              Destination
              <svg className={`w-3 h-3 transition-transform ${isOpen("destination") ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <DestinationDropdown isOpen={isOpen("destination")} onClose={closeDropdown} />
          </div>

          {/* Blog */}
          <div 
            className="relative"
            onMouseEnter={() => openDropdown("blog")}
            onMouseLeave={() => closeDropdown()}
          >
            <Link 
              href={ROUTES.PUBLIC.BLOG} 
              className="text-sm text-white font-medium flex items-center gap-1 hover:text-primary transition"
            >
              Blog
              <svg className={`w-3 h-3 transition-transform ${isOpen("blog") ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <BlogDropdown isOpen={isOpen("blog")} onClose={closeDropdown} />
          </div>

          {/* Contact */}
          <Link 
            href={ROUTES.PUBLIC.CONTACT} 
            className="text-sm text-white font-medium hover:text-primary transition"
          >
            Contact
          </Link>
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex gap-4 items-center">
          {/* Shopping Bag with golden circle */}
          <button className="p-2 hover:bg-white/10 rounded transition relative" title="Cart">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          
          {/* Search Icon */}
          <button className="p-2 hover:bg-white/10 rounded transition" title="Search">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          
          {/* EXPLORE MORE Button */}
          <Link
            href={ROUTES.PUBLIC.HOTELS}
            className="button-split-hover px-8 py-3 rounded-lg font-semibold text-primary-foreground flex items-center justify-center gap-2 whitespace-nowrap h-[52px]"
            >
            <span>EXPLORE MORE</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden p-2 transition-colors ${hasScrolled ? "text-white" : "text-white"}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Home Dropdown Menu - Full Width (Outside nav for full viewport width) */}
      <HomeDropdown isOpen={isOpen("home")} onClose={closeDropdown} />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden border-t transition-all duration-500 ${
          hasScrolled ? "bg-black/95 backdrop-blur-md border-border" : "bg-black/80 backdrop-blur-sm border-transparent"
        } animate-slide-down`}>
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
            <div>
              <button
                onClick={() => toggleDropdown("home")}
                className="text-sm text-white hover:text-primary transition flex items-center justify-between w-full"
              >
                <span>Home</span>
                <svg className={`w-4 h-4 transition-transform ${isOpen("home") ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Mobile Home Dropdown */}
              {isOpen("home") && (
                <div className="mt-3 ml-4 grid grid-cols-2 gap-3">
                  {featuredHotels.map((hotel) => (
                    <Link
                      key={hotel.id}
                      href={`${ROUTES.PUBLIC.HOTEL_DETAIL}/${hotel.id}`}
                      className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-video"
                      onClick={() => {
                        closeDropdown()
                        setIsMenuOpen(false)
                      }}
                    >
                      <img
                        src={hotel.image || "/placeholder.svg"}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <h4 className="text-white font-semibold text-xs truncate">{hotel.name}</h4>
                        <p className="text-white/80 text-[10px] truncate">{hotel.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href={ROUTES.PUBLIC.HOTELS} className="text-sm text-white hover:text-primary transition">
              Pages
            </Link>
            <Link href={ROUTES.PUBLIC.HOTELS} className="text-sm text-white hover:text-primary transition">
              Room
            </Link>
            <Link href={ROUTES.PUBLIC.DESTINATIONS} className="text-sm text-white hover:text-primary transition">
              Destination
            </Link>
            <Link href={ROUTES.PUBLIC.BLOG} className="text-sm text-white hover:text-primary transition">
              Blog
            </Link>
            <Link href={ROUTES.PUBLIC.CONTACT} className="text-sm text-white hover:text-primary transition">
              Contact
            </Link>
            <Link
              href={ROUTES.PUBLIC.HOTELS}
              className="button-split-hover px-8 py-3 rounded-lg font-semibold text-primary-foreground flex items-center justify-center gap-2 whitespace-nowrap h-[52px]"
              >
              <span>EXPLORE MORE</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

          </div>
        </div>
      )}
    </header>
  )
}
