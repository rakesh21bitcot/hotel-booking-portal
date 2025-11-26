"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/components/modules/auth/hooks/useAuth"
import { Loader } from "@/components/common/Loader"
import { ROUTES } from "@/utils/constants"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "user" | "admin"
}

export function ProtectedRoute({ children, requiredRole = "user" }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.PUBLIC.LOGIN)
      return
    }

    if (requiredRole === "admin" && user?.role !== "admin") {
      router.push(ROUTES.PUBLIC.HOME)
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader text="Loading..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole === "admin" && user?.role !== "admin") {
    return null
  }

  return <>{children}</>
}
