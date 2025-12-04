"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ROUTES } from "@/utils/constants"
import type React from "react"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()

  // Auth routes where Header and Footer should be hidden
  const authRoutes = [
    ROUTES.PUBLIC.LOGIN,
    ROUTES.PUBLIC.REGISTER,
    ROUTES.PUBLIC.FORGOT_PASSWORD,
    ROUTES.PUBLIC.RESET_PASSWORD,
  ]

  const isAuthRoute = authRoutes.includes(pathname)

  return (
    <>
      {!isAuthRoute && <Header />}
      {children}
      {!isAuthRoute && <Footer />}
    </>
  )
}

