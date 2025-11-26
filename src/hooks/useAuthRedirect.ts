"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/components/modules/auth/hooks/useAuth"
import { ROUTES } from "@/utils/constants"

interface UseAuthRedirectOptions {
  redirectIfLoggedIn?: boolean
  redirectIfNotLoggedIn?: boolean
}

export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { redirectIfLoggedIn = false, redirectIfNotLoggedIn = false } = options

  useEffect(() => {
    if (isLoading) return

    if (redirectIfLoggedIn && isAuthenticated) {
      router.push(ROUTES.PROTECTED.DASHBOARD)
    }

    if (redirectIfNotLoggedIn && !isAuthenticated) {
      router.push(ROUTES.PUBLIC.LOGIN)
    }
  }, [isAuthenticated, isLoading, redirectIfLoggedIn, redirectIfNotLoggedIn, router])

  return { isLoading, isAuthenticated }
}
