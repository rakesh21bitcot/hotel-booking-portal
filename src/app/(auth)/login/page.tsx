"use client"

import Link from "next/link"
import { LoginForm } from "@/modules/auth/components/LoginForm"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { ROUTES } from "@/utils/constants"

export default function LoginPage() {
  useAuthRedirect({ redirectIfLoggedIn: true })

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-block w-12 h-12 bg-primary rounded mb-4 flex items-center justify-center text-primary-foreground font-bold text-xl">
          ES
        </div>
        <h1 className="text-3xl font-bold font-serif mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to your EliteStay account</p>
      </div>

      <LoginForm />

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href={ROUTES.PUBLIC.REGISTER} className="text-primary hover:text-primary/90 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
