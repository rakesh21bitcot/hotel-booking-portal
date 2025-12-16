"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../hooks/useAuth"
import { registerSchema, type RegisterInput } from "@/utils/validators"
import { errorHandler } from "@/lib/error-handler"
import { toast } from "sonner"
import { ROUTES } from "@/utils/constants"

export function RegisterForm() {
  const router = useRouter()
  const { register, isLoading } = useAuth()
  const [formData, setFormData] = useState<RegisterInput>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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
      const validated = registerSchema.parse(formData)
      const result = await register(validated)
      
      if (result.payload) {
        toast.success("Account created successfully!")
        router.push(ROUTES.PUBLIC.LOGIN)
      }
    } catch (error) {
      if (error instanceof Error) {
        try {
          const parsed = JSON.parse(error.message)
          if (Array.isArray(parsed) && parsed[0]) {
            setErrors({ [parsed[0].path[0]]: parsed[0].message })
          }
        } catch {
          errorHandler.handleErrorWithToast(error, "Registration")
        }
      } else {
        errorHandler.handleErrorWithToast(error, "Registration")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            className="w-full px-4 py-2 bg-card border border-border rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            className="w-full px-4 py-2 bg-card border border-border rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full px-4 py-2 bg-card border border-border rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password (min 8 characters)"
          className="w-full px-4 py-2 bg-card border border-border rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          className="w-full px-4 py-2 bg-card border border-border rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground py-2 rounded font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  )
}
