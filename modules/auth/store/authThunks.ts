import { createAsyncThunk } from "@reduxjs/toolkit"
import { authService } from "../services/authService"
import { storage } from "@/lib/storage"
import { errorHandler } from "@/lib/error-handler"
import type { LoginRequest, RegisterRequest } from "../types"

export const loginThunk = createAsyncThunk("auth/login", async (credentials: LoginRequest, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials)
    storage.setToken(response.token)
    storage.setRefreshToken(response.refreshToken)
    storage.setUser(response.user)
    return response
  } catch (error) {
    const errorResponse = errorHandler.handleError(error)
    return rejectWithValue(errorResponse.message)
  }
})

export const registerThunk = createAsyncThunk("auth/register", async (data: RegisterRequest, { rejectWithValue }) => {
  try {
    const response = await authService.register(data)
    storage.setToken(response.token)
    storage.setRefreshToken(response.refreshToken)
    storage.setUser(response.user)
    return response
  } catch (error) {
    const errorResponse = errorHandler.handleError(error)
    return rejectWithValue(errorResponse.message)
  }
})

export const logoutThunk = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout()
    storage.clearAll()
  } catch (error) {
    const errorResponse = errorHandler.handleError(error)
    console.error("[v0] Logout error:", errorResponse)
    storage.clearAll() // Clear local data even if API call fails
    return rejectWithValue(errorResponse.message)
  }
})
