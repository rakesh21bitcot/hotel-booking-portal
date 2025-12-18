"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../hooks/useAuth"
import { loginSchema, type LoginInput } from "@/utils/validators"
import { errorHandler } from "@/lib/error-handler"
import { toast } from "sonner"
import { ROUTES } from "@/utils/constants"
import { forSuccess } from "@/utils/CommonService"

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
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
      const validated = loginSchema.parse(formData)
      const result = await login(validated)

      if (result.payload) {
        forSuccess("Login successful!")
        router.push(ROUTES.PUBLIC.HOTELS)
      }
    } catch (error) {
      if (error instanceof Error) {
        const parsed = JSON.parse(error.message)
        if (parsed[0]) {
          setErrors({ [parsed[0].path[0]]: parsed[0].message })
        }
      } else {
        errorHandler.handleErrorWithToast(error, "Login")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
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
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
        </div>
        
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="w-full px-4 py-2 bg-card border border-border rounded focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <div
          className={
            errors.password
              ? "flex items-center justify-between mt-1 mb-2"
              : "flex items-center justify-end mt-1 mb-2"
          }
        >
          {errors.password && (
            <p className="text-destructive text-sm mr-2">{errors.password}</p>
          )}
          <Link
            href={ROUTES.PUBLIC.FORGOT_PASSWORD}
            className="text-sm text-primary hover:text-primary/90 font-medium"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary cursor-pointer text-primary-foreground py-2 rounded font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  )
}
