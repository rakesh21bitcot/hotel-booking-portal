"use client"

import { ResetPasswordForm } from "@/components/modules/auth/components/ResetPasswordForm"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"

export default function ResetPasswordPage() {
  useAuthRedirect({ redirectIfLoggedIn: true })

  return (
    <ResetPasswordForm />
  )
}

