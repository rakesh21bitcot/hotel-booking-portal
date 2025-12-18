"use client"

import type React from "react"
import PriceBreakdown from "./PriceBreakdown"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { createBookingWithRedux } from "@/store/actions/booking-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { forSuccess } from "@/utils/CommonService"
import { ROUTES } from "@/utils/constants"
import { Loader2 } from "lucide-react"

export default function BookingPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // Get booking details from localStorage (stored by RoomDetails)
  const bookingDetails = (() => {
    try {
      const stored = localStorage.getItem('bookingDetails')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })()

  useEffect(() => {
    if (!bookingDetails?.roomId) {
      router.push(ROUTES.PUBLIC.HOTELS)
    }
  },[])

  const roomId = bookingDetails?.roomId || ''
  const hotelId = bookingDetails?.hotelId || ''
  const checkIn = bookingDetails?.checkIn || ''
  const checkOut = bookingDetails?.checkOut || ''
  const guests = bookingDetails?.guests || '1'
  const roomPrice = parseFloat(bookingDetails?.price || '0')

  const { user } = useAppSelector((state) => state.auth)

  const [userDetails, setUserDetails] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phone || "",
    specialRequests: "",
  })

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  })

  const [step, setStep] = useState<"personal" | "payment" | "confirm">("personal")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [bookingCompleted, setBookingCompleted] = useState(false)
  const [createdBooking, setCreatedBooking] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Use pre-calculated total price from localStorage
  const nights = bookingDetails?.nights ? parseInt(bookingDetails.nights) : 1
  const subtotal = roomPrice * nights
  const tax = subtotal * 0.1 // 10% tax
  const fees = 25

  // Validation functions
  const validateUserDetails = () => {
    const newErrors: Record<string, string> = {}

    if (!userDetails.firstName.trim()) newErrors.firstName = "First name is required"
    if (!userDetails.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!userDetails.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) newErrors.email = "Invalid email format"
    if (!userDetails.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    else if (!/^\d{10}$/.test(userDetails.phoneNumber.replace(/\s/g, ''))) newErrors.phoneNumber = "Phone number must be exactly 10 digits"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateCardDetails = () => {
    const newErrors: Record<string, string> = {}

    if (!cardDetails.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
    else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = "Card number must be exactly 16 digits"

    if (!cardDetails.expiryMonth) newErrors.expiryMonth = "Expiry month is required"
    if (!cardDetails.expiryYear) newErrors.expiryYear = "Expiry year is required"

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const expiryYear = parseInt(cardDetails.expiryYear)
    const expiryMonth = parseInt(cardDetails.expiryMonth)

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      newErrors.expiryMonth = "Card has expired"
    }

    if (!cardDetails.cvv.trim()) newErrors.cvv = "CVV is required"
    else if (!/^\d{3}$/.test(cardDetails.cvv)) newErrors.cvv = "CVV must be exactly 3 digits"

    if (!cardDetails.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserDetails((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      setCardDetails((prev) => ({ ...prev, [name]: formatted }))
    } else {
      setCardDetails((prev) => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleNextStep = () => {
    if (step === "personal") {
      if (validateUserDetails()) {
        setStep("payment")
      }
    } else if (step === "payment") {
      if (validateCardDetails()) {
        setStep("confirm")
      }
    }
  }

  const handlePrevStep = () => {
    if (step === "payment") {
      setStep("personal")
    } else if (step === "confirm") {
      setStep("payment")
    }
  }

  const handleCompleteBooking = async () => {
    if (!user?.id || !hotelId || !roomId || !checkIn || !checkOut) {
      toast.error("Missing booking information")
      return
    }
    setIsLoading(true)
    try {
      const bookingData = {
        userId: parseInt(user.id),
        hotelId,
        roomId,
        checkIn,
        checkOut,
        guestCount: parseInt(guests),
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber,
        totalPrice: (subtotal + tax + fees).toFixed(2),
      }

      const booking = await dispatch(createBookingWithRedux(bookingData))
      setIsLoading(false)
      // Clear booking details from localStorage after successful booking
      localStorage.removeItem('bookingDetails')

      // Set booking completed state and store booking details
      setCreatedBooking(booking)
      setBookingCompleted(true)

      forSuccess("Booking confirmed successfully!")
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.message || "Failed to create booking")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="bg-black min-h-screen">

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
                          value={userDetails.firstName}
                          onChange={handleUserDetailsChange}
                          placeholder="John"
                          className={`w-full px-4 py-3 bg-secondary border rounded focus:outline-none transition ${
                            errors.firstName ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                          }`}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-muted-foreground mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={userDetails.lastName}
                          onChange={handleUserDetailsChange}
                          placeholder="Doe"
                          className={`w-full px-4 py-3 bg-secondary border rounded focus:outline-none transition ${
                            errors.lastName ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                          }`}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleUserDetailsChange}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 bg-secondary border rounded focus:outline-none transition ${
                          errors.email ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={userDetails.phoneNumber}
                        onChange={handleUserDetailsChange}
                        placeholder="1234567890"
                        maxLength={10}
                        className={`w-full px-4 py-3 bg-secondary border rounded focus:outline-none transition ${
                          errors.phoneNumber ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                        }`}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">Special Requests</label>
                      <textarea
                        name="specialRequests"
                        value={userDetails.specialRequests}
                        onChange={handleUserDetailsChange}
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
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardDetailsChange(e)}
                        placeholder="123456789012"
                        maxLength={19}
                        className={`w-full px-4 py-3 bg-secondary border rounded focus:outline-none transition ${
                          errors.cardNumber ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-muted-foreground mb-2">Expiry Month</label>
                        <select
                          name="expiryMonth"
                          value={cardDetails.expiryMonth}
                          onChange={(e) => handleCardDetailsChange(e)}
                          className={`w-full px-4 py-3 bg-secondary border rounded focus:outline-none transition ${
                            errors.expiryMonth ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                          }`}
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                              {(i + 1).toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                        {errors.expiryMonth && (
                          <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-muted-foreground mb-2">Expiry Year</label>
                        <select
                          name="expiryYear"
                          value={cardDetails.expiryYear}
                          onChange={(e) => handleCardDetailsChange(e)}
                          className={`w-full px-4 py-3 bg-secondary border rounded focus:outline-none transition ${
                            errors.expiryYear ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                          }`}
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i
                            return (
                              <option key={year} value={year.toString()}>
                                {year}
                              </option>
                            )
                          })}
                        </select>
                        {errors.expiryYear && (
                          <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div></div>
                      <div>
                        <label className="block text-sm font-semibold text-muted-foreground mb-2">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardDetailsChange(e)}
                          placeholder="123"
                          maxLength={3}
                          className={`w-full px-4 py-3 bg-secondary border rounded focus:outline-none transition ${
                            errors.cvv ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                          }`}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-muted-foreground mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={cardDetails.cardholderName}
                        onChange={(e) => handleCardDetailsChange(e)}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 bg-secondary border rounded focus:outline-none transition ${
                          errors.cardholderName ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                        }`}
                      />
                      {errors.cardholderName && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
                      )}
                    </div>

                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <span className="text-sm text-muted-foreground">I agree to the terms and conditions</span>
                    </label>
                  </div>
                )}

                {step === "confirm" && !bookingCompleted && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">Confirm Booking</h2>

                    <div className="bg-secondary border border-border rounded p-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Guest Name:</span>
                        <span className="text-foreground font-semibold">
                          {userDetails.firstName} {userDetails.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-foreground font-semibold">{userDetails.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="text-foreground font-semibold">{userDetails.phoneNumber}</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="text-muted-foreground">Check-in Date:</span>
                        <span className="text-foreground font-semibold">{checkIn ? new Date(checkIn).toLocaleDateString() : 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-out Date:</span>
                        <span className="text-foreground font-semibold">{checkOut ? new Date(checkOut).toLocaleDateString() : 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Room Type:</span>
                        <span className="text-foreground font-semibold">{bookingDetails?.roomName || 'Room'}</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="text-muted-foreground">Hotel:</span>
                        <span className="text-foreground font-semibold">{bookingDetails?.hotelName || 'Hotel'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Guests:</span>
                        <span className="text-foreground font-semibold">{guests} Guest{guests !== '1' ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                )}

                {bookingCompleted && createdBooking && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">Booking Confirmed!</h2>

                    <div className="bg-green-500/10 border border-green-500/30 rounded p-6 text-center">
                      <p className="text-green-400 font-semibold mb-2">Your booking has been confirmed</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        A confirmation email has been sent to {userDetails?.email}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Booking Reference:</p>
                        <p className="text-lg text-foreground font-semibold">{createdBooking?.bookingId}</p>
                      </div>
                    </div>
                    {!bookingCompleted && (
                      <div className="bg-secondary border border-border rounded p-6 space-y-3">
                        <h3 className="font-semibold text-foreground mb-4">Booking Details</h3>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Guest Name:</span>
                          <span className="text-foreground font-semibold">
                            {userDetails.firstName} {userDetails.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hotel:</span>
                          <span className="text-foreground font-semibold">{bookingDetails?.hotelName || 'Hotel'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Room Type:</span>
                          <span className="text-foreground font-semibold">{bookingDetails?.roomName || 'Room'}</span>
                        </div>
                        <div className="border-t border-border pt-3 flex justify-between">
                          <span className="text-muted-foreground">Check-in:</span>
                          <span className="text-foreground font-semibold">{checkIn ? new Date(checkIn).toLocaleDateString() : 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-out:</span>
                          <span className="text-foreground font-semibold">{checkOut ? new Date(checkOut).toLocaleDateString() : 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="text-foreground font-semibold">${createdBooking.totalPrice || (subtotal + tax + fees).toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8 pt-8 border-t border-border">
                  {!bookingCompleted && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        disabled={step === "personal" || isLoading}
                        className="px-6 py-3 border cursor-pointer border-border rounded font-semibold hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={step === "confirm" ? handleCompleteBooking : handleNextStep}
                        className="flex-1 flex cursor-pointer items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded font-semibold hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {step === "confirm" ? "Confirm Booking" : "Continue"} {isLoading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
                      </button>
                    </>
                  )}
                  {bookingCompleted && (
                    <button
                      type="button"
                      onClick={() => router.push(ROUTES.PROTECTED.MYBOOKING)}
                      className="w-full px-6 cursor-pointer py-3 bg-primary text-primary-foreground rounded font-semibold hover:bg-accent transition"
                    >
                      View My Bookings
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Price Breakdown */}
            {!bookingCompleted && (
            <div>
              <PriceBreakdown roomPrice={roomPrice} nights={nights} tax={tax} fees={fees} discount={0} />

              {/* Hotel Summary */}
              <div className="bg-card border border-border rounded-lg p-6 mt-8">
                <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Hotel</p>
                    <p className="text-foreground font-semibold">{bookingDetails?.hotelName || 'Hotel'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Room Type</p>
                    <p className="text-foreground font-semibold">{bookingDetails?.roomName || 'Room'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Duration</p>
                    <p className="text-foreground font-semibold">{nights} Night{nights !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Guests</p>
                    <p className="text-foreground font-semibold">{guests} Guest{guests !== '1' ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
