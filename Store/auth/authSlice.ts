import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthState, AuthUser } from "@/modules/auth/types"
import { loginThunk, registerThunk, logoutThunk } from "./authThunks"

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    resetAuth: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
    })
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
    })
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Logout
    builder.addCase(logoutThunk.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isLoading = false
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
    })
    builder.addCase(logoutThunk.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const { setUser, setToken, clearError, resetAuth } = authSlice.actions
export default authSlice.reducer

