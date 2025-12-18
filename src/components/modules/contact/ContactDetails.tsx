"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { BookingWidget } from "@/components/modules/landingPage/components"

export default function ContactDetails() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Thank you for your message! We'll get back to you soon.")
      setFormData({ name: "", email: "", message: "" })
    }, 1000)
  }

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
            Contact us
          </h1>
        </div>
      </section>

      {/* Main Content - Contact Form Section */}
      <section className="bg-[#fffef0] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Get In Touch */}
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2d5016] mb-6">
                Contact Us
              </h2>
              <p className="text-[#666] text-base md:text-lg leading-relaxed mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              {/* Contact Information */}
              <div className="space-y-6 mb-8">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <svg
                      className="w-6 h-6 text-[#2d5016]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#333] font-medium">Location</p>
                    <p className="text-[#666] text-sm">
                      56 Main street, 2nd block Melbourne, Australia
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <svg
                      className="w-6 h-6 text-[#2d5016]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#333] font-medium">Phone</p>
                    <p className="text-[#666] text-sm">+1(368) 667 89 54</p>
                    <p className="text-[#666] text-sm">+236 (056) 396 22</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <svg
                      className="w-6 h-6 text-[#2d5016]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#333] font-medium">Email</p>
                    <p className="text-[#666] text-sm">elitestayhotel@email.com</p>
                    <p className="text-[#666] text-sm">www.elitestay.com</p>
                  </div>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-4 mb-8">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#2d5016] text-white flex items-center justify-center hover:bg-[#3d7026] transition"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#2d5016] text-white flex items-center justify-center hover:bg-[#3d7026] transition"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#2d5016] text-white flex items-center justify-center hover:bg-[#3d7026] transition"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#2d5016] text-white flex items-center justify-center hover:bg-[#3d7026] transition"
                  aria-label="Pinterest"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c5.084 0 9.426-3.163 11.177-7.617-.15-.706-.895-4.424.178-7.556.19-.896 1.222-5.89 1.222-5.89s-.312-.625-.312-1.548c0-1.45.84-2.534 1.888-2.534.89 0 1.32.669 1.32 1.47 0 .896-.57 2.237-.864 3.48-.246 1.043.523 1.9 1.554 1.9 1.866 0 3.298-1.967 3.298-4.807 0-2.514-1.797-4.27-4.365-4.27-2.97 0-4.714 2.227-4.714 4.525 0 .896.345 1.86.777 2.38a.312.312 0 01.07.302c-.076.32-.244 1.002-.277 1.142-.043.18-.14.22-.323.133-1.21-.563-1.966-2.336-1.966-3.76 0-3.07 2.233-5.89 6.436-5.89 3.38 0 6.006 2.406 6.006 5.617 0 3.36-2.116 6.06-5.05 6.06-.987 0-1.915-.513-2.23-1.598 0 0-.49 1.867-.608 2.324-.22.843-.816 1.897-1.214 2.54.916.283 1.883.436 2.888.436 6.627 0 12-5.372 12-12S18.627 0 12 0z" />
                  </svg>
                </a>
              </div>

              {/* Small Image */}
              <div className="mt-8">
                <img
                  src="/luxury-hotel-bedroom.jpg"
                  alt="Hotel room"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2d5016] mb-2">
                Fill Up The Form
              </h2>
              <p className="text-[#666] text-sm mb-6">
                Your email address will not be published. Required fields are marked *
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="relative group">
                  <label
                    htmlFor="name"
                    className={`block text-[#333] font-medium mb-2 transition-all duration-300 ${
                      focusedField === "name" || formData.name
                        ? "text-[#2d5016] transform scale-105"
                        : ""
                    }`}
                  >
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                        focusedField === "name" || formData.name
                          ? "text-[#2d5016] scale-110"
                          : "text-[#999]"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg bg-white text-[#333] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#2d5016]/20 focus:border-[#2d5016] focus:shadow-lg focus:shadow-[#2d5016]/20 ${
                        errors.name
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500 form-input-error"
                          : "border-[#ddd] hover:border-[#2d5016]/50"
                      } ${focusedField === "name" ? "transform scale-[1.01]" : ""}`}
                      placeholder="Enter your name"
                    />
                    {formData.name && !errors.name && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-fade-in">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 form-error-message flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="relative group">
                  <label
                    htmlFor="email"
                    className={`block text-[#333] font-medium mb-2 transition-all duration-300 ${
                      focusedField === "email" || formData.email
                        ? "text-[#2d5016] transform scale-105"
                        : ""
                    }`}
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                        focusedField === "email" || formData.email
                          ? "text-[#2d5016] scale-110"
                          : "text-[#999]"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg bg-white text-[#333] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#2d5016]/20 focus:border-[#2d5016] focus:shadow-lg focus:shadow-[#2d5016]/20 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500 form-input-error"
                          : "border-[#ddd] hover:border-[#2d5016]/50"
                      } ${focusedField === "email" ? "transform scale-[1.01]" : ""}`}
                      placeholder="Enter your email"
                    />
                    {formData.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-fade-in">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 form-error-message flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="relative group">
                  <label
                    htmlFor="message"
                    className={`block text-[#333] font-medium mb-2 transition-all duration-300 ${
                      focusedField === "message" || formData.message
                        ? "text-[#2d5016] transform scale-105"
                        : ""
                    }`}
                  >
                    Enter Your Message here <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div
                      className={`absolute left-4 top-4 transition-all duration-300 ${
                        focusedField === "message" || formData.message
                          ? "text-[#2d5016] scale-110"
                          : "text-[#999]"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      rows={6}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg bg-white text-[#333] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#2d5016]/20 focus:border-[#2d5016] focus:shadow-lg focus:shadow-[#2d5016]/20 resize-none ${
                        errors.message
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500 form-input-error"
                          : "border-[#ddd] hover:border-[#2d5016]/50"
                      } ${focusedField === "message" ? "transform scale-[1.01]" : ""}`}
                      placeholder="Enter your message"
                    />
                    {formData.message && !errors.message && (
                      <div className="absolute right-4 bottom-4 text-green-500 animate-fade-in">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-2 form-error-message flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button-split-hover cursor-pointer w-full px-6 py-4 text-primary-foreground rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Us Message
                        <svg
                          className="w-5 h-5 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Section - Beachside Escape */}
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
            className="inline-block px-8 py-4 bg-[#4A90E2] text-white rounded-lg font-semibold hover:bg-[#357ABD] transition"
          >
            Make Reservation
          </Link>
        </div>
      </section>

    </main>
  )
}

