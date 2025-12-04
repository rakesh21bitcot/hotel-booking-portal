"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../hooks/useAuth"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/utils/validators"
import { errorHandler } from "@/lib/error-handler"
import { toast } from "sonner"
import { ROUTES } from "@/utils/constants"
import Link from "next/link"

export function ForgotPasswordForm() {
  const router = useRouter()
  const { forgotPassword, isLoading } = useAuth()
  const [formData, setFormData] = useState<ForgotPasswordInput>({
    email: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const validated = forgotPasswordSchema.parse(formData)
      const result = await forgotPassword(validated)

      if (result.payload) {
        setIsSubmitted(true)
        toast.success("Password reset link sent to your email!")
      }
    } catch (error) {
      if (error instanceof Error) {
        try {
          const parsed = JSON.parse(error.message)
          if (Array.isArray(parsed) && parsed[0]) {
            setErrors({ [parsed[0].path[0]]: parsed[0].message })
          } else {
            errorHandler.handleErrorWithToast(error, "Forgot Password")
          }
        } catch {
          errorHandler.handleErrorWithToast(error, "Forgot Password")
        }
      } else {
        errorHandler.handleErrorWithToast(error, "Forgot Password")
      }
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center">
        <div className="inline-flex w-16 h-16 bg-primary/20 rounded-full mb-4 items-center justify-center">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
        <p className="text-muted-foreground mb-6">
          We've sent a password reset link to <strong>{formData.email}</strong>
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Please check your inbox and click on the link to reset your password.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={ROUTES.PUBLIC.LOGIN}
            className="text-primary hover:text-primary/90 font-medium text-sm"
          >
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="inline-block w-12 h-12 bg-primary rounded mb-4 flex items-center justify-center text-primary-foreground font-bold text-xl">
                ES
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif mb-2">Forgot Password</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password
            </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
        <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
            </label>
            <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="w-full px-4 py-2 sm:py-2.5 bg-card border border-border rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
        </div>

        <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 sm:py-2.5 rounded font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm sm:text-base"
        >
            {isLoading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center">
            <Link
            href={ROUTES.PUBLIC.LOGIN}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
            Back to Login
            </Link>
        </div>
        </form>
        <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href={ROUTES.PUBLIC.LOGIN} className="text-primary hover:text-primary/90 font-medium">
                Sign in
            </Link>
            </p>
        </div>
    </div>
  )
}

