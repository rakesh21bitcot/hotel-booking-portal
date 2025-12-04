"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { login as loginAction, logout as logoutAction } from "@/store/reducers/authReducer"
import type { LoginInput } from "@/utils/validators"
import type { RegisterInput } from "@/utils/validators"
import type { ForgotPasswordInput, ResetPasswordInput } from "@/utils/validators"
import { openConfirmDialog } from "@/utils/CommonService"
import { ROUTES } from "@/utils/constants"

// Stores signup credentials (used only for validating future logins)
const SIGNUP_KEY = "eliteStaySignupUser"
// Stores current logged-in user details to keep the user logged in
const SESSION_KEY = "eliteStayLoggedInUser"
// Stores password reset tokens
const RESET_TOKEN_KEY = "eliteStayResetTokens"

export function useAuth() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const authState = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = !!authState.access_token && !!authState.user
  const user = authState.user

  const login = async (credentials: LoginInput) => {
    setIsLoading(true)
    try {
      if (typeof window === "undefined") {
        return { payload: null }
      }

      // Read signup data from sessionStorage only
      const stored = window.sessionStorage.getItem(SIGNUP_KEY)
      if (!stored) {
        // No registered user
        throw new Error(
          JSON.stringify([
            { path: ["email"], message: "No account found with this email. Please sign up first." },
          ])
        )
      }

      const storedUser = JSON.parse(stored) as {
        email: string
        password: string
        firstName?: string
        lastName?: string
      }

      if (storedUser.email !== credentials.email || storedUser.password !== credentials.password) {
        throw new Error(
          JSON.stringify([
            { path: ["password"], message: "Email or password is incorrect." },
          ])
        )
      }

      const fakeToken = "local-session-token"

      dispatch(
        loginAction({
          access_token: fakeToken,
          refresh_token: fakeToken,
          user: {
            email: storedUser.email,
            firstName: storedUser.firstName,
            lastName: storedUser.lastName,
          },
          token: fakeToken,
        })
      )

      // Mark active login session (separate from signup credentials)
      const session = {
        email: storedUser.email,
        firstName: storedUser.firstName,
        lastName: storedUser.lastName,
      }
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))

      return {
        payload: {
          email: storedUser.email,
          firstName: storedUser.firstName,
          lastName: storedUser.lastName,
        },
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterInput) => {
    setIsLoading(true)
    try {
      if (typeof window === "undefined") {
        return { payload: null }
      }

      const userToStore = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      }

      // Persist signup credentials ONLY in sessionStorage for future logins
      window.sessionStorage.setItem(SIGNUP_KEY, JSON.stringify(userToStore))

      // Also create an active session on successful signup
      const session = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      }
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))

      const fakeToken = "local-session-token"

      dispatch(
        loginAction({
          access_token: fakeToken,
          refresh_token: fakeToken,
          user: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
          },
          token: fakeToken,
        })
      )

      return {
        payload: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    openConfirmDialog({
      data: {
        title: "Sign out",
        message: "Are you sure you want to logout from EliteStay?",
      },
      confirmText: "Logout",
      cancelText: "Stay",
      onConfirm: () => {
        if (typeof window !== "undefined") {
          // Clear only the active login session in localStorage; keep signup data in sessionStorage
          window.localStorage.removeItem(SESSION_KEY)
        }
        dispatch(logoutAction())
        
        // Check if user is on a protected route and redirect to home
        const protectedRoutes = [
          ROUTES.PROTECTED.DASHBOARD,
          ROUTES.PROTECTED.MYBOOKING,
          ROUTES.PROTECTED.BOOKINGS,
          ROUTES.PROTECTED.PROFILE,
          ROUTES.PROTECTED.WISHLIST,
          ROUTES.PROTECTED.SETTINGS,
          ROUTES.PROTECTED.CART,
          ROUTES.PROTECTED.CHANGEPASSWORD,
          ROUTES.ADMIN.DASHBOARD,
          ROUTES.ADMIN.HOTELS,
          ROUTES.ADMIN.BOOKINGS,
          ROUTES.ADMIN.USERS,
        ]
        
        const isOnProtectedRoute = protectedRoutes.some((route) => 
          pathname.startsWith(route)
        )
        
        if (isOnProtectedRoute) {
          router.push(ROUTES.PUBLIC.HOME)
        }
      },
    })
  }

  const forgotPassword = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    try {
      if (typeof window === "undefined") {
        return { payload: null }
      }

      // Check if user exists
      const stored = window.sessionStorage.getItem(SIGNUP_KEY)
      if (!stored) {
        throw new Error(
          JSON.stringify([
            { path: ["email"], message: "No account found with this email address." },
          ])
        )
      }

      const storedUser = JSON.parse(stored) as {
        email: string
        password: string
        firstName?: string
        lastName?: string
      }

      if (storedUser.email !== data.email) {
        throw new Error(
          JSON.stringify([
            { path: ["email"], message: "No account found with this email address." },
          ])
        )
      }

      // Generate reset token (in real app, this would be sent via email)
      const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(7)}`
      
      // Store reset tokens (in real app, this would be in database)
      const resetTokens = JSON.parse(window.localStorage.getItem(RESET_TOKEN_KEY) || "{}")
      resetTokens[resetToken] = {
        email: data.email,
        expiresAt: Date.now() + 3600000, // 1 hour from now
      }
      window.localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(resetTokens))

      // In a real app, you would send an email with the reset link
      // For demo purposes, we'll log it to console
      console.log(`Password reset link: ${window.location.origin}/reset-password?token=${resetToken}`)

      return {
        payload: {
          email: data.email,
          message: "Password reset link sent to your email",
        },
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (data: ResetPasswordInput) => {
    setIsLoading(true)
    try {
      if (typeof window === "undefined") {
        return { payload: null }
      }

      // Validate reset token
      const resetTokens = JSON.parse(window.localStorage.getItem(RESET_TOKEN_KEY) || "{}")
      const tokenData = resetTokens[data.token]

      if (!tokenData) {
        throw new Error(
          JSON.stringify([
            { path: ["token"], message: "Invalid or expired reset token. Please request a new one." },
          ])
        )
      }

      // Check if token is expired
      if (Date.now() > tokenData.expiresAt) {
        delete resetTokens[data.token]
        window.localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(resetTokens))
        throw new Error(
          JSON.stringify([
            { path: ["token"], message: "Reset token has expired. Please request a new one." },
          ])
        )
      }

      // Update password in stored user data
      const stored = window.sessionStorage.getItem(SIGNUP_KEY)
      if (!stored) {
        throw new Error(
          JSON.stringify([
            { path: ["token"], message: "User account not found." },
          ])
        )
      }

      const storedUser = JSON.parse(stored) as {
        email: string
        password: string
        firstName?: string
        lastName?: string
      }

      if (storedUser.email !== tokenData.email) {
        throw new Error(
          JSON.stringify([
            { path: ["token"], message: "Invalid reset token." },
          ])
        )
      }

      // Update password
      const updatedUser = {
        ...storedUser,
        password: data.password,
      }
      window.sessionStorage.setItem(SIGNUP_KEY, JSON.stringify(updatedUser))

      // Remove used token
      delete resetTokens[data.token]
      window.localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(resetTokens))

      return {
        payload: {
          message: "Password reset successfully",
        },
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  }
}
