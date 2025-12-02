 "use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ROUTES } from "@/utils/constants"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out  
        ${ hasScrolled 
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
          >
            <Link 
              href={ROUTES.PUBLIC.HOME} 
              className={`text-sm font-medium flex items-center gap-1 transition ${
                isActive(ROUTES.PUBLIC.HOME) ? "text-primary" : "text-white hover:text-primary"
              }`}
            >
              Home
            </Link>
          </div>
          {/* Hotels */}
          <div 
            className="relative"
          >
            <Link 
              href={ROUTES.PUBLIC.HOTELS} 
              className={`text-sm font-medium flex items-center gap-1 transition ${
                isActive(ROUTES.PUBLIC.HOTELS) || (typeof window !== "undefined" && window.location.pathname.startsWith('/hotel/')) 
                  ? "text-primary" 
                  : "text-white hover:text-primary"
              }`}
            >
              Hotels
            </Link>
          </div>

          {/* Destination */}
          <div 
            className="relative"
          >
            <Link 
              href={ROUTES.PUBLIC.DESTINATIONS} 
              className={`text-sm font-medium flex items-center gap-1 transition ${
                isActive(ROUTES.PUBLIC.DESTINATIONS) ? "text-primary" : "text-white hover:text-primary"
              }`}
            >
              Destination
            </Link>
          </div>

          {/* Blog */}
          <div 
            className="relative"
          >
            <Link 
              href={ROUTES.PUBLIC.BLOG} 
              className={`text-sm font-medium flex items-center gap-1 transition ${
                isActive(ROUTES.PUBLIC.BLOG) ? "text-primary" : "text-white hover:text-primary"
              }`}
            >
              Blog
            </Link>
          </div>

          {/* Contact */}
          <Link 
            href={ROUTES.PUBLIC.CONTACT} 
            className={`text-sm font-medium transition ${
              isActive(ROUTES.PUBLIC.CONTACT) ? "text-primary" : "text-white hover:text-primary"
            }`}
          >
            Contact
          </Link>

          <Link 
            href={ROUTES.PROTECTED.MYBOOKING} 
            className={`text-sm font-medium transition ${
              isActive(ROUTES.PROTECTED.MYBOOKING) ? "text-primary" : "text-white hover:text-primary"
            }`}
          >
            My Bookings
          </Link>
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex gap-4 items-center">
          {/* Shopping Bag with golden circle */}
          <Link href='/cart' className="p-2 hover:bg-white/10 rounded transition relative" title="Cart">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Link>
          
          {/* Sign In / Join Button */}
          <Link
            href={ROUTES.PUBLIC.LOGIN}
            className="button-split-hover px-8 py-3 rounded-lg font-semibold text-primary-foreground flex items-center justify-center gap-2 whitespace-nowrap h-[52px]"
            >
            <span>Sign In/Join?</span>
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden border-t transition-all duration-500 ${
          hasScrolled ? "bg-black/95 backdrop-blur-md border-border" : "bg-black/80 backdrop-blur-sm border-transparent"
        } animate-slide-down`}>
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
            <Link
              href={ROUTES.PUBLIC.HOME}
              className={`text-sm transition flex items-center justify-between w-full ${
                isActive(ROUTES.PUBLIC.HOME) ? "text-primary" : "text-white hover:text-primary"
              }`}
            >
              <span>Home</span>
            </Link>
            <Link 
              href={ROUTES.PUBLIC.HOTELS} 
              className={`text-sm transition ${
                isActive(ROUTES.PUBLIC.HOTELS) ? "text-primary" : "text-white hover:text-primary"
              }`}
            >
              Pages
            </Link>
            <Link 
              href={ROUTES.PUBLIC.HOTELS} 
              className={`text-sm transition ${
                isActive(ROUTES.PUBLIC.HOTELS) ? "text-primary" : "text-white hover:text-primary"
              }`}
            >
              Room
            </Link>
            <Link 
              href={ROUTES.PUBLIC.DESTINATIONS} 
              className={`text-sm transition ${
                isActive(ROUTES.PUBLIC.DESTINATIONS) ? "text-primary" : "text-white hover:text-primary"
              }`}
            >
              Destination
            </Link>
            <Link 
              href={ROUTES.PUBLIC.BLOG} 
              className={`text-sm transition ${
                isActive(ROUTES.PUBLIC.BLOG) ? "text-primary" : "text-white hover:text-primary"
              }`}
            >
              Blog
            </Link>
            <Link 
              href={ROUTES.PUBLIC.CONTACT} 
              className={`text-sm transition ${
                isActive(ROUTES.PUBLIC.CONTACT) ? "text-primary" : "text-white hover:text-primary"
              }`}
            >
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
