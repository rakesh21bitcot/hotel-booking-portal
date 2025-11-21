"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Loader } from "@/components/common/Loader"
import { ROUTES } from "@/utils/constants"

interface ProtectedRouteWrapperProps {
  children: React.ReactNode
  requiredRole?: "user" | "admin"
}

export function ProtectedRouteWrapper({ children, requiredRole = "user" }: ProtectedRouteWrapperProps) {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || isLoading) return

    if (!isAuthenticated) {
      router.push(ROUTES.PUBLIC.LOGIN)
      return
    }

    if (requiredRole === "admin" && user?.role !== "admin") {
      router.push(ROUTES.PUBLIC.HOME)
    }
  }, [isMounted, isLoading, isAuthenticated, user?.role, requiredRole, router])

  if (!isMounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader text="Verifying access..." />
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
