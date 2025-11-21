import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CommonState {
  toast: {
    message: string
    type: "success" | "error" | "info" | "warning"
    visible: boolean
  } | null
  isLoading: boolean
  currentError: string | null
}

const initialState: CommonState = {
  toast: null,
  isLoading: false,
  currentError: null,
}

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; type: "success" | "error" | "info" | "warning" }>) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type,
        visible: true,
      }
    },
    hideToast: (state) => {
      state.toast = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.currentError = action.payload
    },
  },
})

export const { showToast, hideToast, setLoading, setError } = commonSlice.actions
export default commonSlice.reducer
