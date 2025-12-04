"use client"

import { ForgotPasswordForm } from "@/components/modules/auth/components/ForgotPasswordForm"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"

export default function ForgotPasswordPage() {
  useAuthRedirect({ redirectIfLoggedIn: true })

  return (
   <ForgotPasswordForm />
  )
}

