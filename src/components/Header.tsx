"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ROUTES } from "@/utils/constants"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/modules/auth/hooks/useAuth"
import { useAppSelector } from "@/store/hook"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()
  const favourites = useAppSelector((state) => state.favourite.favourites)

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
        before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:bg-gradient-to-b before:from-[rgba(0,0,0,0.7)] before:to-[rgba(30,30,30,0)] before:backdrop-blur before:z-[-1] 
        ${hasScrolled 
          ? "bg-black/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href={ROUTES.PUBLIC.HOME} className="flex items-center gap-3">
          <Image src="https://wowtheme7.com/tf/elitestay/assets/images/logo/logo.png" alt="Bitcot" width={150} height={150} />
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

          {isAuthenticated && (
            <Link 
              href={ROUTES.PROTECTED.MYBOOKING} 
              className={`text-sm font-medium transition ${
                isActive(ROUTES.PROTECTED.MYBOOKING) ? "text-primary" : "text-white hover:text-primary"
              }`}
            >
              My Bookings
            </Link>
          )}
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex gap-4 items-center">
          {/* Shopping Bag with golden circle */}
          {isAuthenticated && (
            <Link href={ROUTES.PROTECTED.CART} className="p-2 hover:bg-white/10 rounded transition relative" title="Liked Hotels">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 21C12 21 4 13.28 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.28 16 21 16 21H12Z"
                />
              </svg>
              {favourites?.length ? 
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              : ""}
            </Link>
          )}

          {isAuthenticated && (
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full cursor-pointer" onClick={() => setShowProfileDropdown((v) => !v)} ref={profileRef}>
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm">
                  {(user?.firstName || user?.email || "U").charAt(0).toUpperCase()}
                </span>
                <span className="text-sm text-white">
                  {user?.firstName || user?.email || "Profile"}
                </span>
              </div>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-black/95 text-white rounded-lg shadow-lg py-2 z-50 animate-fade-in border border-border">
                  <Link href={ROUTES.PROTECTED.PROFILE} className="block px-4 py-2 hover:bg-primary/10" onClick={() => setShowProfileDropdown(false)} >Profile</Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setShowProfileDropdown(false)
                    }}
                    className="w-full text-left cursor-pointer px-4 py-2 text-muted-foreground hover:bg-destructive hover:text-white rounded-b"
                  >Logout</button>
                </div>
              )}
            </div>
          )}

          {/* Sign In / Join Button */}
          {!isAuthenticated && (
            <Link
              href={ROUTES.PUBLIC.LOGIN}
              className="button-split-hover px-8 py-3 rounded-lg font-semibold text-primary-foreground flex items-center justify-center gap-2 whitespace-nowrap h-[52px]"
            >
              <span>Sign In/Sign Up?</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden p-2 transition-colors cursor-pointer ${hasScrolled ? "text-white" : "text-white"}`} 
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
              Hotels
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
            {isAuthenticated && (
              <Link
                href={ROUTES.PROTECTED.MYBOOKING} 
                className={`text-sm transition ${
                  isActive(ROUTES.PROTECTED.MYBOOKING) ? "text-primary" : "text-white hover:text-primary"
                }`}
              >
                My Bookings
              </Link>
            )}
            {isAuthenticated && (
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full cursor-pointer" onClick={() => setShowProfileDropdown((v) => !v)} ref={profileRef}>
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm">
                  {(user?.firstName || user?.email || "U").charAt(0).toUpperCase()}
                </span>
                <span className="text-sm text-white">
                  {user?.firstName || user?.email || "Profile"}
                </span>
              </div>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-black/95 text-white rounded-lg shadow-lg py-2 z-50 animate-fade-in border border-border">
                  <Link href={ROUTES.PROTECTED.PROFILE} className="block px-4 py-2 hover:bg-primary/10" onClick={() => setShowProfileDropdown(false)}>Profile</Link>
                  <button
                   type="button"
                   onClick={() => {
                     logout()
                     setShowProfileDropdown(false)
                   }}
                    className="w-full text-left cursor-pointer px-4 py-2 text-muted-foreground hover:bg-destructive hover:text-white rounded-b"
                  >Logout</button>
                </div>
              )}
            </div>
          )}

          {/* Sign In / Join Button */}
          {!isAuthenticated && (
            <Link
              href={ROUTES.PUBLIC.LOGIN}
              className="button-split-hover px-8 py-3 rounded-lg font-semibold text-primary-foreground flex items-center justify-center gap-2 whitespace-nowrap h-[52px]"
            >
              <span>Sign In/Sign Up?</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}

          </div>
        </div>
      )}
    </header>
  )
}
