"use client"

import { useEffect, useRef, useState } from "react"
import ScrollAnimation from "./ScrollAnimation"
import { JSX } from "react/jsx-dev-runtime"

interface Amenity {
    id: string
    title: string
    icon: JSX.Element
    highlighted?: boolean
  }
  
  const amenities: Amenity[] = [
    {
      id: "1",
      title: "Rooftop Lounge facilities",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          {/* Building structure */}
          <path d="M4 20h16M4 20V8l8-4 8 4v12" />
          {/* Windows */}
          <rect x="6" y="12" width="3" height="3" />
          <rect x="11" y="12" width="3" height="3" />
          <rect x="15" y="12" width="3" height="3" />
          {/* Rooftop lounge - umbrella and chairs */}
          <path d="M8 8l2-1 2 1M9 8v2M11 8v2" />
          <circle cx="9" cy="10" r="0.8" />
          <circle cx="11" cy="10" r="0.8" />
        </svg>
      ),
    },
    {
      id: "2",
      title: "Picnic Area with BBQ Facilities",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          {/* BBQ Grill base */}
          <rect x="6" y="16" width="12" height="3" rx="1" />
          <rect x="8" y="12" width="8" height="4" rx="1" />
          {/* Grill lines */}
          <line x1="9" y1="12" x2="9" y2="16" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="15" y1="12" x2="15" y2="16" />
          {/* Smoke lines - three wavy lines */}
          <path d="M8 10 Q10 8 12 10 Q14 8 16 10" strokeLinecap="round" />
          <path d="M9 8 Q11 6 13 8 Q15 6 17 8" strokeLinecap="round" />
          <path d="M10 6 Q12 4 14 6 Q16 4 18 6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "3",
      title: "Outdoor Badminton",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          {/* Shuttlecock - circle top and feathered bottom */}
          <circle cx="12" cy="7" r="2.5" />
          <path d="M12 9.5 L9 18 L12 16 L15 18 Z" />
          <line x1="9" y1="18" x2="15" y2="18" />
        </svg>
      ),
    },
    {
      id: "4",
      title: "Children's Playground",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          {/* Swing set structure */}
          <line x1="6" y1="20" x2="6" y2="8" />
          <line x1="18" y1="20" x2="18" y2="8" />
          <line x1="6" y1="8" x2="18" y2="8" />
          {/* Swings */}
          <line x1="9" y1="12" x2="9" y2="16" />
          <circle cx="9" cy="17" r="1.5" />
          <line x1="15" y1="12" x2="15" y2="16" />
          <circle cx="15" cy="17" r="1.5" />
          {/* Climbing frame elements */}
          <line x1="12" y1="8" x2="12" y2="12" />
          <circle cx="12" cy="13" r="1" />
        </svg>
      ),
    },
    {
      id: "5",
      title: "Live Music or Cultural Dance",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {/* Acoustic guitar - more detailed */}
          <ellipse cx="12" cy="14" rx="5.5" ry="7.5" />
          <rect x="10.5" y="5" width="3" height="9" rx="0.5" />
          <circle cx="12" cy="14" r="1.8" />
          <line x1="9.5" y1="10" x2="14.5" y2="10" />
          <line x1="9.5" y1="18" x2="14.5" y2="18" />
          <line x1="12" y1="5" x2="12" y2="6" />
          <line x1="10" y1="7" x2="14" y2="7" />
        </svg>
      ),
      highlighted: true,
    },
  ]

export default function AmenitiesSection() {
  const [isInViewport, setIsInViewport] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [windowWidth, setWindowWidth] = useState(1024)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setWindowWidth(window.innerWidth)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-12 md:py-16 lg:py-20 amenities-section-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Text */}
        <ScrollAnimation animation="fade-up" delay={0}>
          <div className="text-center mb-8 md:mb-10 lg:mb-6">
            <p className="text-primary text-xs sm:text-sm font-semibold tracking-[0.2em] mb-3 md:mb-4 uppercase">
              DEDICATED TO YOUR COMFORT
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight px-2">
              World-class Amenities To Elevate Your Stayed Experience
            </h2>
          </div>
        </ScrollAnimation>

        {/* Cards Container - Mobile: Stack, Tablet: Grid, Desktop: Spread */}
        <div ref={containerRef} className="amenities-container">
          {isMobile ? (
            // Mobile: Stack vertically with animation
            <div className="flex flex-col items-center gap-6 md:hidden">
              {amenities.map((amenity, index) => (
                <ScrollAnimation key={amenity.id} animation="fade-up" delay={index * 100}>
                  <div 
                    className={`amenity-card amenity-card-mobile ${amenity.highlighted ? "amenity-card-highlighted" : ""} ${selectedCard === amenity.id ? "amenity-card-selected" : ""}`}
                    onClick={() => setSelectedCard(selectedCard === amenity.id ? null : amenity.id)}
                  >
                    <div className={`amenity-icon amenity-icon-mobile ${amenity.highlighted ? "amenity-icon-highlighted" : ""} ${selectedCard === amenity.id ? "amenity-icon-selected" : ""}`}>
                      {amenity.icon}
                    </div>
                    <h3 className={`amenity-title amenity-title-mobile ${selectedCard === amenity.id ? "amenity-title-selected" : ""}`}>{amenity.title}</h3>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          ) : (
            // Desktop/Tablet: Spread horizontally with diagonal animation
            <div className="amenities-inner hidden md:block">
              {amenities.map((amenity, index) => {
                // Responsive card width
                const cardWidth = windowWidth >= 1024 ? 280 : windowWidth >= 768 ? 240 : 200
                const gap = windowWidth >= 1024 ? 20 : 16
                
                // Initial position: overlapped and fanned diagonally
                const initialX = index * -45
                const initialY = index * 25
                const initialRotate = (index - 2) * -8
                
                // Final position: spread out horizontally
                const finalX = (index - (amenities.length - 1) / 2) * (cardWidth + gap)
                const finalY = 0
                const finalRotate = 0

                return (
                  <div
                    key={amenity.id}
                    className={`amenity-card-wrapper ${isInViewport ? "separated-state" : "initial-state"}`}
                    style={{
                      transform: isInViewport
                        ? `translate3d(${finalX}px, ${finalY}px, 0) rotate(${finalRotate}deg) scale(1)`
                        : `translate3d(${initialX}px, ${initialY}px, 0) rotate(${initialRotate}deg) scale(0.95)`,
                      transitionDelay: isInViewport ? `${index * 120}ms` : "0ms",
                      zIndex: isInViewport ? 1 : amenities.length - index,
                      left: "50%",
                      marginLeft: windowWidth >= 1024 ? "-140px" : windowWidth >= 768 ? "-120px" : "-100px",
                    }}
                  >
                    <div 
                      className={`amenity-card ${amenity.highlighted ? "amenity-card-highlighted" : ""} ${selectedCard === amenity.id ? "amenity-card-selected" : ""}`}
                      onClick={() => setSelectedCard(selectedCard === amenity.id ? null : amenity.id)}
                    >
                      <div className={`amenity-icon ${amenity.highlighted ? "amenity-icon-highlighted" : ""} ${selectedCard === amenity.id ? "amenity-icon-selected" : ""}`}>
                        {amenity.icon}
                      </div>
                      <h3 className={`amenity-title ${selectedCard === amenity.id ? "amenity-title-selected" : ""}`}>{amenity.title}</h3>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

