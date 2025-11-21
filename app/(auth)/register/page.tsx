"use client"

import Link from "next/link"
import { RegisterForm } from "@/modules/auth/components"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { ROUTES } from "@/utils/constants"

export default function RegisterPage() {
  useAuthRedirect({ redirectIfLoggedIn: true })

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-block w-12 h-12 bg-primary rounded mb-4 flex items-center justify-center text-primary-foreground font-bold text-xl">
          ES
        </div>
        <h1 className="text-3xl font-bold font-serif mb-2">Create Account</h1>
        <p className="text-muted-foreground">Join EliteStay and start booking</p>
      </div>

      <RegisterForm />

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={ROUTES.PUBLIC.LOGIN} className="text-primary hover:text-primary/90 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
