"use client"

import Link from "next/link"
import { ROUTES } from "@/utils/constants"
import { HeroSection } from "@/components/HeroSection"
import { dummyHotels, dummyTestimonials } from "@/utils/dummy-data"
import { HotelCard } from "@/components/HotelCard"
import { TestimonialCard } from "@/components/TestimonialCard"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Hotels Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-2 font-serif">Featured Hotels</h2>
            <p className="text-muted-foreground">Handpicked luxury stays from around the world</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dummyHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href={ROUTES.PUBLIC.HOTELS}
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded font-medium hover:bg-primary/90 transition-colors"
            >
              Explore All Hotels
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Happy Guests</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2,000+</div>
              <p className="text-muted-foreground">Hotels & Resorts</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <p className="text-muted-foreground">Destinations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-2 font-serif">Guest Reviews</h2>
            <p className="text-muted-foreground">See what our guests have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dummyTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-serif">Ready to Book Your Stay?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover amazing hotels and book your perfect getaway today. Enjoy exclusive deals and 5-star service.
          </p>
          <Link
            href={ROUTES.PUBLIC.HOTELS}
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded font-medium hover:bg-primary/90 transition-colors"
          >
            Start Exploring
          </Link>
        </div>
      </section>
    </div>
  )
}
