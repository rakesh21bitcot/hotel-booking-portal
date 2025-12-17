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
import { authApis } from "@/lib/APIs/authApis"

export function useAuth() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const authState = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = !!authState.access_token && !!authState.user
  const user: any = authState.user

  const login = async (credentials: LoginInput) => {
    setIsLoading(true)
    try {
      const response: any = await authApis.login({
        email: credentials.email,
        password: credentials.password,
      })

      if (!response.success || !response.data) {
        const errorMessage = response.error?.message || "Login failed. Please try again."
        const errorPath = response.error?.code === "401" || response.error?.code === "404" 
          ? ["password"] 
          : ["email"]
        
        throw new Error(
          JSON.stringify([
            { path: errorPath, message: errorMessage },
          ])
        )
      }

      const { user, token, refreshToken } = response.data.data

      dispatch(
        loginAction({
          access_token: token,
          refresh_token: refreshToken,
          user: user,
          token: token,
        })
      )

      // Also save to localStorage as backup
      if (typeof window !== "undefined") {
        localStorage.setItem("user_data", JSON.stringify(user))
      }

      return {
        payload: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      }
    } catch (error: any) {
      // Re-throw validation errors as-is
      if (error.message && error.message.startsWith("[")) {
        throw error
      }
      // Wrap other errors in the expected format
      throw new Error(
        JSON.stringify([
          { path: ["email"], message: error.message || "An unexpected error occurred" },
        ])
      )
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterInput) => {
    setIsLoading(true)
    try {
      const response: any = await authApis.register(userData)
      

      if (!response.success || !response.data) {
        const errorMessage = response.error?.message || "Registration failed. Please try again."
        const errorPath = response.error?.code === "409" 
          ? ["email"] 
          : ["email"]
        
        throw new Error(
          JSON.stringify([
            { path: errorPath, message: errorMessage },
          ])
        )
      }

      const { user } = response.data?.data
      
      return {
        payload: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      }
    } catch (error: any) {
      // Re-throw validation errors as-is
      if (error.message && error.message.startsWith("[")) {
        throw error
      }
      // Wrap other errors in the expected format
      throw new Error(
        JSON.stringify([
          { path: ["email"], message: error.message || "An unexpected error occurred" },
        ])
      )
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    openConfirmDialog({
      data: {
        title: "Sign out",
        message: "Are you sure you want to logout from EliteStay?",
      },
      confirmText: "Logout",
      cancelText: "Stay",
      onConfirm: async () => {
        setIsLoading(true)
        try {
          // Call logout API (this will clear storage on the API side)
          await authApis.logout()
        } catch (error) {
          // Even if API call fails, clear local state
          console.error("Logout API error:", error)
        } finally {
          dispatch(logoutAction())
          setIsLoading(false)
          
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
        }
      },
    })
  }

  const forgotPassword = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    try {
      const response = await authApis.forgotPassword(data)

      if (!response.success) {
        const errorMessage = response.error?.message || "Failed to send password reset email. Please try again."
        const errorPath = response.error?.code === "404" 
          ? ["email"] 
          : ["email"]
        
        throw new Error(
          JSON.stringify([
            { path: errorPath, message: errorMessage },
          ])
        )
      }

      return {
        payload: {
          email: data.email,
          message: response.data?.message || "Password reset link sent to your email",
        },
      }
    } catch (error: any) {
      // Re-throw validation errors as-is
      if (error.message && error.message.startsWith("[")) {
        throw error
      }
      // Wrap other errors in the expected format
      throw new Error(
        JSON.stringify([
          { path: ["email"], message: error.message || "An unexpected error occurred" },
        ])
      )
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (data: ResetPasswordInput) => {
    setIsLoading(true)
    try {
      const response = await authApis.resetPassword(data)

      if (!response.success) {
        const errorMessage = response.error?.message || "Failed to reset password. Please try again."
        const errorPath = response.error?.code === "400" || response.error?.code === "404"
          ? ["token"]
          : ["password"]
        
        throw new Error(
          JSON.stringify([
            { path: errorPath, message: errorMessage },
          ])
        )
      }

      return {
        payload: {
          message: response.data?.message || "Password reset successfully",
        },
      }
    } catch (error: any) {
      // Re-throw validation errors as-is
      if (error.message && error.message.startsWith("[")) {
        throw error
      }
      // Wrap other errors in the expected format
      throw new Error(
        JSON.stringify([
          { path: ["password"], message: error.message || "An unexpected error occurred" },
        ])
      )
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
