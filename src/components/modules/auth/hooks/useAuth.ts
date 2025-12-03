"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { login as loginAction, logout as logoutAction } from "@/store/reducers/authReducer"
import type { LoginInput } from "@/utils/validators"
import type { RegisterInput } from "@/utils/validators"
import { openConfirmDialog } from "@/utils/CommonService"

// Stores signup credentials (used only for validating future logins)
const SIGNUP_KEY = "eliteStaySignupUser"
// Stores current logged-in user details to keep the user logged in
const SESSION_KEY = "eliteStayLoggedInUser"

export function useAuth() {
  const dispatch = useAppDispatch()
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
      },
    })
  }

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
  }
}
