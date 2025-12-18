"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../hooks/useAuth"
import { resetPasswordSchema, type ResetPasswordInput } from "@/utils/validators"
import { errorHandler } from "@/lib/error-handler"
import { toast } from "sonner"
import { ROUTES } from "@/utils/constants"
import Link from "next/link"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword, isLoading } = useAuth()
  const [formData, setFormData] = useState<ResetPasswordInput>({
    password: "",
    confirmPassword: "",
    token: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      setFormData((prev) => ({ ...prev, token }))
    } else {
      toast.error("Invalid reset link. Please request a new one.")
      router.push(ROUTES.PUBLIC.FORGOT_PASSWORD)
    }
  }, [searchParams, router])

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

    if (!formData.token) {
      toast.error("Invalid reset token. Please request a new password reset link.")
      router.push(ROUTES.PUBLIC.FORGOT_PASSWORD)
      return
    }

    try {
      const validated = resetPasswordSchema.parse(formData)
      const result = await resetPassword(validated)

      if (result.payload) {
        setIsSubmitted(true)
        toast.success("Password reset successfully!")
        setTimeout(() => {
          router.push(ROUTES.PUBLIC.LOGIN)
        }, 2000)
      }
    } catch (error) {
      if (error instanceof Error) {
        try {
          const parsed = JSON.parse(error.message)
          if (Array.isArray(parsed) && parsed[0]) {
            setErrors({ [parsed[0].path[0]]: parsed[0].message })
          } else {
            errorHandler.handleErrorWithToast(error, "Reset Password")
          }
        } catch {
          errorHandler.handleErrorWithToast(error, "Reset Password")
        }
      } else {
        errorHandler.handleErrorWithToast(error, "Reset Password")
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
        <h2 className="text-2xl font-bold mb-2">Password Reset Successful!</h2>
        <p className="text-muted-foreground mb-6">
          Your password has been reset successfully. You can now login with your new password.
        </p>
        <Link
          href={ROUTES.PUBLIC.LOGIN}
          className="inline-block bg-primary text-primary-foreground py-2 sm:py-2.5 px-6 rounded font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
        >
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
    <div className="text-center mb-8">
      <div className="inline-block w-12 h-12 bg-primary rounded mb-4 flex items-center justify-center text-primary-foreground font-bold text-xl">
        ES
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold font-serif mb-2">Reset Password</h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        Enter your new password below
      </p>
    </div>
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          New Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter new password (min 8 characters)"
          className="w-full px-4 py-2 sm:py-2.5 bg-card border border-border rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
        />
        {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          className="w-full px-4 py-2 sm:py-2.5 bg-card border border-border rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.token}
        className="w-full cursor-pointer bg-primary text-primary-foreground py-2 sm:py-2.5 rounded font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm sm:text-base"
      >
        {isLoading ? "Resetting..." : "Reset Password"}
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
    </div>
  )
}

