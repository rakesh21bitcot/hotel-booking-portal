"use client"

import { useEffect, useRef, useState } from "react"
import ScrollAnimation from "./ScrollAnimation"
import { destinations } from "@/utils/dummy-data"





export default function FeaturedDestinations() {
  const [isInViewport, setIsInViewport] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
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
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Text */}
        <ScrollAnimation animation="fade-up" delay={0}>
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <p className="text-primary text-xs sm:text-sm font-semibold tracking-[0.2em] mb-3 md:mb-4 uppercase">
              CRAFTING MEMORABLE EXPERIENCES
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight px-2">
              We're Dedicated To Providing You Unforgettable Experience. Whether You're Here For Business Or Leisure,
            </h2>
          </div>
        </ScrollAnimation>

        {/* Cards Container */}
        {isMobile ? (
          // Mobile/Tablet: Stack vertically or show in grid
          <div className="flex flex-col md:grid md:grid-cols-2 lg:hidden items-center gap-6 md:gap-8">
            {destinations.map((destination, index) => (
              <ScrollAnimation key={destination.id} animation="fade-up" delay={index * 100}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  <div className="relative h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <div className="flex items-center justify-between text-white">
                      <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold">{destination.name}</h3>
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-300"
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
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        ) : (
          // Desktop: Spread horizontally with animation
          <div ref={containerRef} className="relative min-h-[500px] lg:min-h-[600px] py-8 lg:py-12 overflow-x-hidden hidden lg:block">
            <div className="relative flex items-center justify-center" style={{ height: "450px" }}>
              {destinations.map((destination, index) => {
                const cardWidth = 300
                const gap = 24
                
                const initialX = index * -45
                const initialY = index * 25
                const initialRotate = (index - 2) * -8
                
                const finalX = (index - (destinations.length - 1) / 2) * (cardWidth + gap)
                const finalY = 0
                const finalRotate = 0

                return (
                  <div
                    key={destination.id}
                    className="absolute will-change-transform"
                    style={{
                      transform: isInViewport
                        ? `translate3d(${finalX}px, ${finalY}px, 0) rotate(${finalRotate}deg) scale(1)`
                        : `translate3d(${initialX}px, ${initialY}px, 0) rotate(${initialRotate}deg) scale(0.95)`,
                      transition: `transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1.4s ease-out`,
                      transitionDelay: isInViewport ? `${index * 100}ms` : "0ms",
                      zIndex: isInViewport ? 1 : destinations.length - index,
                      left: "50%",
                      marginLeft: "-150px",
                      opacity: isInViewport ? 1 : 0.75,
                      transformOrigin: "center center",
                    }}
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group w-[300px] transition-all duration-300 hover:shadow-2xl hover:scale-105">
                      <div className="relative h-[450px] overflow-hidden">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center justify-between text-white">
                          <h3 className="font-serif text-2xl font-bold">{destination.name}</h3>
                          <svg
                            className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300"
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
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

