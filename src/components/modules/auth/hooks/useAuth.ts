"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { login as loginAction, logout as logoutAction } from "@/store/reducers/authReducer"
import type { LoginInput } from "@/utils/validators"
import type { RegisterInput } from "@/utils/validators"
import { apiClient } from "@/lib/api-client"
import { errorHandler } from "@/lib/error-handler"

export function useAuth() {
  const dispatch = useAppDispatch()
  const authState = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = !!authState.access_token && !!authState.user
  const user = authState.user

  const login = async (credentials: LoginInput) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post<{
        user: unknown
        token: string
        refreshToken: string
      }>("/api/mock-auth", credentials)

      if (response.success && response.data) {
        dispatch(
          loginAction({
            access_token: response.data.token,
            refresh_token: response.data.refreshToken,
            user: response.data.user,
            token: response.data.token,
          })
        )
        return { payload: response.data }
      } else {
        throw new Error(response.error?.message || "Login failed")
      }
    } catch (error) {
      // Error is already handled by apiClient, but we can add additional handling here
      errorHandler.handleErrorWithToast(error, "Login")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterInput) => {
    setIsLoading(true)
    try {
      // Mock registration - in real app, this would call a register API
      const response = await apiClient.post<{
        user: unknown
        token: string
        refreshToken: string
      }>("/api/mock-auth", {
        email: userData.email,
        password: userData.password,
      })

      if (response.success && response.data) {
        const userDataObj = typeof response.data.user === "object" && response.data.user !== null 
          ? response.data.user as Record<string, unknown>
          : {}
        
        dispatch(
          loginAction({
            access_token: response.data.token,
            refresh_token: response.data.refreshToken,
            user: {
              ...userDataObj,
              firstName: userData.firstName,
              lastName: userData.lastName,
            },
            token: response.data.token,
          })
        )
        return { payload: response.data }
      } else {
        throw new Error(response.error?.message || "Registration failed")
      }
    } catch (error) {
      // Error is already handled by apiClient, but we can add additional handling here
      errorHandler.handleErrorWithToast(error, "Registration")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    dispatch(logoutAction())
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

