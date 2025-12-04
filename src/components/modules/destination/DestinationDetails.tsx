"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { BookingWidget } from "@/components/modules/landingPage/components"
import { destinations, hotelPackages } from "@/utils/dummy-data"

export default function DestinationDetails() {
  const featuredPackage = hotelPackages.find((pkg) => pkg.featured)
  const regularPackages = hotelPackages.filter((pkg) => !pkg.featured)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset
        const section = parallaxRef.current.closest('section')
        if (section) {
          const rect = section.getBoundingClientRect()
          const sectionTop = rect.top + window.pageYOffset
          const sectionHeight = rect.height
          
          // Only apply parallax when section is in viewport
          if (scrolled >= sectionTop - window.innerHeight && scrolled <= sectionTop + sectionHeight) {
            const offset = (scrolled - sectionTop) * 0.5
            parallaxRef.current.style.transform = `translateY(${offset}px)`
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="bg-background min-h-screen">

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/luxury-hotel-lobby.png')",
              filter: "blur(2px)",
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mb-12">
          <p className="text-sm md:text-base text-white/90 mb-2 tracking-wider uppercase">
            EXPERIENCE THE STORY
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-8">
            destination
          </h1>
        </div>
      </section>

      {/* Introductory Section */}
      <section className="bg-[#fffef0] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-[#666] mb-3 tracking-wider uppercase font-semibold">
            CRAFTING MEMORABLE EXPERIENCES
          </p>
          <p className="text-lg md:text-xl lg:text-2xl text-[#333] max-w-4xl mx-auto leading-relaxed">
            WE'RE DEDICATED TO PROVIDING YOU UNFORGETTABLE EXPERIENCE. WHETHER YOU'RE HERE FOR BUSINESS OR LEISURE,
          </p>
        </div>
      </section>

      {/* Destination Cards Section */}
      <section className="bg-[#fffef0] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {destinations.map((destination, index) => (
              <div key={destination.id} className="flex items-center">
                <Link
                  href={`/destinations/${destination.id}`}
                  className="group relative overflow-hidden rounded-lg"
                >
                  <div className="relative w-[200px] h-[150px] md:w-[250px] md:h-[180px] overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-serif text-lg md:text-xl font-bold text-white">
                        {destination.name}
                      </h3>
                    </div>
                  </div>
                </Link>
                {index < destinations.length - 1 && (
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-[#2d5016] mx-2 md:mx-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Packages Section */}
      <section className="bg-[#fffef0] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs md:text-sm text-[#666] mb-3 tracking-wider uppercase font-semibold">
              WHERE LUXURY MEETS WARMTH
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] max-w-4xl mx-auto leading-tight">
              Discover Exclusive Hotel Packages For Every Taste & Occasion
            </h2>
          </div>

          {/* Room Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 auto-rows-fr">
            {/* Featured Large Card - Spans 2 rows */}
            {featuredPackage && (
              <div className="md:row-span-2 group">
                <Link
                  href={`/hotel/${featuredPackage.id}`}
                  className="block relative h-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-full min-h-[500px] md:min-h-[650px]">
                    <img
                      src={featuredPackage.image}
                      alt={featuredPackage.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Price Tag */}
                    <div className="absolute top-4 left-4 bg-[#ff6b35] text-white px-4 py-2 rounded-lg font-bold text-sm md:text-base shadow-lg">
                      ${featuredPackage.price} Per Night
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                        {featuredPackage.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white text-sm md:text-base">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{featuredPackage.guests} Guest</span>
                        </div>
                        <span className="text-white/60">|</span>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>{featuredPackage.beds} Beds</span>
                        </div>
                        <span className="text-white/60">|</span>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <span>{featuredPackage.area}m²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Regular Cards */}
            {regularPackages.map((pkg) => (
              <div key={pkg.id} className="group">
                <Link
                  href={`/hotel/${pkg.id}`}
                  className="block relative h-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-video min-h-[280px] md:min-h-[300px]">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Price Tag */}
                    <div className="absolute top-4 left-4 bg-[#ff6b35] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                      ${pkg.price} Per Night
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      <h3 className="font-serif text-lg md:text-xl font-bold text-white mb-3 line-clamp-2">
                        {pkg.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-white text-xs md:text-sm">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{pkg.guests} Guest</span>
                        </div>
                        <span className="text-white/60">|</span>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>{pkg.beds} Beds</span>
                        </div>
                        <span className="text-white/60">|</span>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <span>{pkg.area}m²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-[#fffef0] py-12 md:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link
            href="/hotels"
            className="inline-block px-8 py-4 bg-[#ff6b35] text-white rounded-lg font-semibold hover:bg-[#e55a2b] transition transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            EXPLORE MORE
          </Link>
        </div>
      </section>

      {/* Scrolling Text Banner - Separate Section Below */}
      <section className="bg-[#fffef0] py-20 md:py-20 overflow-hidden relative">
        <div className="relative w-full min-h-[120px] md:min-h-[150px]">
          <div 
            className="flex items-center gap-12 md:gap-16 lg:gap-20 animate-scroll scroll-container"
            onMouseEnter={(e) => {
              e.currentTarget.style.animationPlayState = 'paused'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.animationPlayState = 'running'
            }}
          >
            {/* Multiple Sets for Seamless Infinite Loop - Need at least 2 identical sets */}
            {[...Array(4)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center gap-12 md:gap-16 lg:gap-20 shrink-0">
                {/* Beach Icon */}
                <div className="shrink-0">
                  <svg
                    className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[#d4af37]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    {/* Sun with rays */}
                    <circle cx="20" cy="4" r="2.5" />
                    <path d="M20 1v6M20 7v6M17 4h6M23 4h-6" />
                    {/* Umbrella */}
                    <path d="M12 3v14M8 7c0-2.5 2-5 4-5s4 2.5 4 5M8 7h8M9 11h6" />
                    {/* Beach/Waves */}
                    <path d="M2 18c3-1.5 6-1.5 9 0s6 1.5 9 0" strokeLinecap="round" />
                  </svg>
                </div>
                
                {/* Text */}
                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#1a1a1a] whitespace-nowrap">
                  Luxury Hotel & Resort
                </h2>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background Image Section with Parallax - Separate Section Below */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <div 
          ref={parallaxRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-bg"
          style={{
            backgroundImage: "url('https://wowtheme7.com/tf/elitestay/assets/images/thumbs/marquee-three-2-bg.jpg')",
            willChange: 'transform',
          }}
        />
      </section>

    </main>
  )
}

