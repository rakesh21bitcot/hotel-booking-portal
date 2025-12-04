"use client"

import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { dummyBlogPosts } from "@/utils/dummy-data"

export default function BlogDetails() {
  return (
    <main className="bg-background min-h-screen">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm md:text-base text-white/90 mb-2 tracking-wider uppercase">
            EXPERIENCE THE STORY
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-8">
            blog
          </h1>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="bg-[#fffef0] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {dummyBlogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-[#e5e5e5]"
              >
                {/* Image */}
                {post.image && (
                  <div className="relative aspect-video overflow-hidden bg-[#f5f5f5]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className={`p-6 md:p-8 ${!post.image ? "pt-8" : ""}`}>
                  {/* Date and Comments */}
                  <div className="flex items-center gap-6 text-xs md:text-sm text-[#666] mb-5">
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium">{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>Comments ({post.comments})</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-[#1a1a1a] mb-4 leading-tight group-hover:text-[#2d5016] transition-colors">
                    {post.title}
                  </h2>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[#2d5016] font-semibold text-sm md:text-base hover:text-[#3d7026] transition-colors group/link mt-4"
                  >
                    <span>Read More</span>
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover/link:translate-x-1"
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
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section - Beachside Escape */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/tropical-beach-resort.png')",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm md:text-base text-white/80 mb-4 tracking-wider uppercase">
            FIND UNIQUE PLACES
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-8">
            Book Your Beachside Escape Today
          </h2>
          <Link
            href="/hotels"
            className="inline-block px-8 py-4 bg-[#4A90E2] text-white rounded-lg font-semibold hover:bg-[#357ABD] transition transform hover:scale-105"
          >
            Make Reservation
          </Link>
        </div>
      </section>

    </main>
  )
}

