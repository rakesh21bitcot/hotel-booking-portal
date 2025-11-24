"use client"

import { useAppDispatch, useAppSelector } from "@/lib/store"
import { loginThunk, registerThunk, logoutThunk } from "@/Store/auth"
import type { LoginRequest, RegisterRequest, AuthUser } from "../types"

export function useAuth() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  return {
    user: auth.user as AuthUser | null,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    token: auth.token,

    login: async (credentials: LoginRequest) => {
      return dispatch(loginThunk(credentials))
    },

    register: async (data: RegisterRequest) => {
      return dispatch(registerThunk(data))
    },

    logout: async () => {
      return dispatch(logoutThunk())
    },
  }
}
