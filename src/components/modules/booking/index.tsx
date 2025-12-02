"use client"

import type React from "react"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PriceBreakdown from "./PriceBreakdown"
import { useState } from "react"
import { useAppDispatch } from "@/store/hook"
import { addBookingToMyBookings } from "@/store/actions/user-action"
import { useRouter } from "next/navigation"

export default function BookingPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const [step, setStep] = useState<"personal" | "payment" | "confirm">("personal")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (step === "personal") {
      setStep("payment")
    } else if (step === "payment") {
      setStep("confirm")
    }
  }

  const handlePrevStep = () => {
    if (step === "payment") {
      setStep("personal")
    } else if (step === "confirm") {
      setStep("payment")
    }
  }

  const handleCompleteBooking = () => {
    const bookingId = `ELITE-${Date.now()}`

    dispatch(
      addBookingToMyBookings({
        id: bookingId,
        hotelId: "1",
        hotelName: "Luxury Grand Hotel",
        location: "New York, USA",
        hotelImage: "/placeholder.svg",
        checkIn: "Dec 20, 2024",
        checkOut: "Dec 25, 2024",
        nights: 5,
        roomType: "Deluxe Room",
        totalAmount: 250 * 5 + 125 + 50,
        status: "Confirmed",
        guestName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
      })
    )

    router.push("/my-booking")
  }

  return (
    <main className="bg-black min-h-screen">
      <Header />

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="flex justify-between mb-12">
            {["Personal", "Payment", "Confirm"].map((label, i) => {
              const steps = ["personal", "payment", "confirm"] as const
              const isActive = steps.indexOf(step) >= i
              return (
                <div key={label} className="flex-1">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className={isActive ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                  </div>
                  {i < 2 && <div className={`h-1 mt-4 ${isActive ? "bg-primary" : "bg-secondary"}`}></div>}
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8">
                {step === "personal" && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">Personal Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-muted-foreground mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="w-full px-4 py-3 bg-secondary border border-border rounded focus:border-primary focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-muted-foreground mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="w-full px-4 py-3 bg-secondary border border-border rounded focus:border-primary focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-secondary border border-border rounded focus:border-primary focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 bg-secondary border border-border rounded focus:border-primary focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">Special Requests</label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any special requests?"
                        rows={4}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded focus:border-primary focus:outline-none transition"
                      />
                    </div>
                  </div>
                )}

                {step === "payment" && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">Payment Information</h2>

                    <div>
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 bg-secondary border border-border rounded focus:border-primary focus:outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-muted-foreground mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-secondary border border-border rounded focus:border-primary focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-muted-foreground mb-2">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-3 bg-secondary border border-border rounded focus:border-primary focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <span className="text-sm text-muted-foreground">I agree to the terms and conditions</span>
                    </label>
                  </div>
                )}

                {step === "confirm" && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">Confirm Booking</h2>

                    <div className="bg-secondary border border-border rounded p-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Guest Name:</span>
                        <span className="text-foreground font-semibold">
                          {formData.firstName} {formData.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-foreground font-semibold">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="text-foreground font-semibold">{formData.phone}</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="text-muted-foreground">Check-in Date:</span>
                        <span className="text-foreground font-semibold">Dec 20, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-out Date:</span>
                        <span className="text-foreground font-semibold">Dec 25, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Room Type:</span>
                        <span className="text-foreground font-semibold">Deluxe Room</span>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 rounded p-6 text-center">
                      <p className="text-green-400 font-semibold mb-2">Booking Confirmed!</p>
                      <p className="text-sm text-muted-foreground">
                        A confirmation email has been sent to {formData.email}
                      </p>
                      <p className="text-sm text-foreground font-semibold mt-3">Booking Reference: ELITE-2024-12345</p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8 pt-8 border-t border-border">
                  <button
                    onClick={handlePrevStep}
                    disabled={step === "personal"}
                    className="px-6 py-3 border border-border rounded font-semibold hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={step === "confirm" ? handleCompleteBooking : handleNextStep}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded font-semibold hover:bg-accent transition"
                  >
                    {step === "confirm" ? "Complete Booking" : "Continue"}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar - Price Breakdown */}
            <div>
              <PriceBreakdown roomPrice={250} nights={5} tax={125} fees={50} discount={0} />

              {/* Hotel Summary */}
              <div className="bg-card border border-border rounded-lg p-6 mt-8">
                <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Hotel</p>
                    <p className="text-foreground font-semibold">Luxury Grand Hotel</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Room Type</p>
                    <p className="text-foreground font-semibold">Deluxe Room</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Duration</p>
                    <p className="text-foreground font-semibold">5 Nights</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
