"use client"
import { ROUTES } from "@/utils/constants"
import Link from "next/link"
import { useEffect, useState } from "react"

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(https://wowtheme7.com/tf/elitestay/assets/images/thumbs/banner-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content - Left Aligned */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="max-w-2xl">
          {/* Sub-headline */}
          <p 
            className={`text-primary text-sm font-semibold tracking-[0.2em] mb-6 transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            FIND UNIQUE HOMES IN VIBRANT PLACES
          </p>

          {/* Main Headline */}
          <h1 
            className={`font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            Trusted Hotels,<br />
            Seamless Booking
          </h1>

          {/* Booking Button */}
          
          <Link
            href={ROUTES.PUBLIC.HOTELS}
            className={`button-split-hover max-w-[220px] px-8 py-4 rounded font-semibold text-primary-foreground mb-8 flex items-center gap-2 transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <span>Booking today</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          {/* Rating Info */}
          <div 
            className={`flex items-center gap-3 text-foreground transition-all duration-1000 ease-out ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <span className="text-2xl">5.0</span>
            <span className="text-2xl text-primary">★★★★★</span>
            <span className="text-sm text-muted-foreground">From 2,000+ reviews</span>
          </div>
        </div>

        {/* Play Button - Right Side */}
        <button 
          className={`absolute cursor-pointer right-8 md:right-16 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-700 group ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <svg className="w-8 h-8 text-foreground ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default HeroSection
export { HeroSection }
