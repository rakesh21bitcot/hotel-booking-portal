"use client"

import type React from "react"

import { ProtectedRouteWrapper } from "@/modules/auth/components/ProtectedRouteWrapper"
import { ProtectedLayout } from "@/components/layouts/ProtectedLayout"

export default function ProtectedLayoutGroup({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRouteWrapper>
      <ProtectedLayout>{children}</ProtectedLayout>
    </ProtectedRouteWrapper>
  )
}
