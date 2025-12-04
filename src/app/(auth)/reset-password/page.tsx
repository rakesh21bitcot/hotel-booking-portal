"use client"

import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/modules/auth/components/ResetPasswordForm"
import { Loader } from "@/components/common/Loader"
import { useAuthRedirect } from "@/hooks"

export default function ResetPasswordPage() {
  useAuthRedirect({ redirectIfLoggedIn: true })
  return (
    <Suspense fallback={
      <div className="w-full max-w-md mx-auto flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading..." />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

