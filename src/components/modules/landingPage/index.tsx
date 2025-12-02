"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { HeroSection, BookingWidget, FeaturedDestinations, AmenitiesSection, TestimonialCard, ScrollAnimation } from "./components"
import { HotelCard } from "@/components/modules/hotel/components"
import { featuredHotels, testimonials } from "@/utils/dummy-data"
import { useEffect, useState } from "react"
import { ROUTES } from "@/utils/constants"

export default function Home() {
  const [counters, setCounters] = useState({ hotels: 0, guests: 0, satisfaction: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate counters
            const duration = 2000
            const steps = 60
            const interval = duration / steps

            let step = 0
            const timer = setInterval(() => {
              step++
              const progress = step / steps

              setCounters({
                hotels: Math.floor(5000 * progress),
                guests: Math.floor(2 * progress * 1000000),
                satisfaction: Math.floor(98 * progress),
              })

              if (step >= steps) {
                setCounters({
                  hotels: 5000,
                  guests: 2000000,
                  satisfaction: 98,
                })
                clearInterval(timer)
              }
            }, interval)

            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    const statsSection = document.querySelector("#stats-section")
    if (statsSection) {
      observer.observe(statsSection)
    }

    return () => {
      if (statsSection) {
        observer.unobserve(statsSection)
      }
    }
  }, [])

  return (
    <main className="bg-black min-h-screen">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Booking Widget Section */}
      {/* <section className="relative -mt-20 pb-20 bg-gradient-to-b from-transparent via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollAnimation animation="fade-up" delay={0}>
            <BookingWidget />
          </ScrollAnimation>
        </div>
      </section> */}

      {/* Featured Destinations Section */}
      <FeaturedDestinations />

      {/* Amenities Section */}
      <AmenitiesSection />

      {/* Featured Hotels Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollAnimation animation="fade-up" delay={0}>
          <div className="text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-wide mb-4 animate-fade-in-up">HAND-PICKED FOR YOU</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                Featured Hotels
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              Discover our curated selection of the finest hotels and resorts across the globe.
            </p>
          </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredHotels.map((hotel: any, index) => (
              <ScrollAnimation key={hotel.id} animation="zoom-in" delay={index * 100}>
                <HotelCard delay={index * 120} hotel={hotel} />
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-20 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollAnimation animation="fade-up" delay={0}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2 transition-all duration-500">
                  {counters.hotels.toLocaleString()}+
                </div>
              <p className="text-muted-foreground">Hotels Worldwide</p>
            </div>
            <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2 transition-all duration-500">
                  {counters.guests >= 1000000 
                    ? `${(counters.guests / 1000000).toFixed(1)}M+`
                    : `${counters.guests.toLocaleString()}+`
                  }
                </div>
              <p className="text-muted-foreground">Happy Guests</p>
            </div>
            <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2 transition-all duration-500">
                  {counters.satisfaction}%
                </div>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Guests review Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollAnimation animation="fade-up" delay={0}>
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold tracking-wide mb-4">WHAT GUESTS SAY</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Guest Reviews</h2>
          </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <ScrollAnimation key={i} animation="slide-up" delay={i * 100}>
                <TestimonialCard {...testimonial} delay={i * 120} />
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */} 
      <section className="py-20 bg-linear-to-r from-secondary to-card border-y border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollAnimation animation="zoom-in" delay={0}>
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Ready to Book Your Dream Stay?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Explore thousands of unique properties and find your perfect vacation destination.
          </p>
          <a
            href={ROUTES.PUBLIC.HOTELS}
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded font-semibold hover:bg-accent transition-all duration-300 text-lg hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
          >
            Start Exploring Now
          </a>
          </ScrollAnimation>
        </div>
      </section>

      <Footer />
    </main>
  )
}
