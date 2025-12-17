import { apiClient } from "@/lib/api-client"
import { errorHandler } from "@/lib/error-handler"
import { User } from "@/types/auth"
import { AppDispatch } from "@/store"
import { updateUser } from "../reducers/authReducer"

// ============================================
// PROFILE TYPES
// ============================================

export interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: string
  dateOfBirth: string
  nationality: string
  state: string
  city: string
}

export interface UpdateProfileRequest extends Partial<ProfileData> {
  id: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface SettingsData {
  enableNotifications: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  bookingReminders: boolean
  newsletter: boolean
  specialOffers: boolean
  marketingEmails: boolean
}

export interface UpdateSettingsRequest extends Partial<SettingsData> {
  userId: string
}

// ============================================
// PROFILE ACTIONS
// ============================================

/**
 * Get user profile by ID
 */
export const getProfile = async (userId: string): Promise<User> => {
  const response: any = await errorHandler.handleApiCall(
    () => apiClient.get<User>(`/profile/${userId}`),
    "Fetch Profile"
  )
  if (!response || !response.success || !response.data) {
    throw new Error("Failed to fetch profile")
  }
  return response.data.profile
}

/**
 * Update user profile
 */
export const updateProfile = async (profileData: UpdateProfileRequest): Promise<User> => {
  const response: any = await errorHandler.handleApiCall(
    () => apiClient.put<User>(`/update-profile/${profileData.id}`, profileData),
    "Update Profile"
  )
  if (!response || !response.success || !response.data) {
    throw new Error("Failed to update profile")
  }
  return response.data.profile
}

/**
 * Update profile and dispatch to Redux store
 */
export const updateProfileWithRedux =
  (profileData: UpdateProfileRequest) =>
  async (dispatch: AppDispatch): Promise<User> => {
    const updatedProfile = await updateProfile(profileData)
    dispatch(updateUser({ user: updatedProfile }))
    return updatedProfile
  }

// ============================================
// SETTINGS ACTIONS
// ============================================

/**
 * Get user settings by user ID
 */
export const getSettings = async (userId: string): Promise<SettingsData | any> => {
  const response: any = await errorHandler.handleApiCall(
    () => apiClient.get<SettingsData>(`/settings/${userId}`),
    "Fetch Settings"
  )
  if (!response || !response.success || !response.data) {
    throw new Error("Failed to fetch settings")
  }
  
  return response.data.settings
}

/**
 * Update user settings
 */
export const updateSettings = async (settingsData: UpdateSettingsRequest): Promise<SettingsData> => {
  const { userId, ...payload } = settingsData
  const response = await errorHandler.handleApiCall(
    () => apiClient.put<SettingsData>(`/update-settings/${userId}`, payload),
    "Update Settings"
  )
  if (!response || !response.success || !response.data) {
    throw new Error("Failed to update settings")
  }
  return response.data
}

// ============================================
// PASSWORD ACTIONS
// ============================================

/**
 * Change user password
 */
export const changePassword = async (passwordData: ChangePasswordRequest): Promise<{ message: string }> => {
  // Validate passwords match
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    throw new Error("New password and confirm password do not match")
  }

  // Validate password strength
  if (passwordData.newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long")
  }

  if (!/(?=.*[a-z])/.test(passwordData.newPassword)) {
    throw new Error("Password must contain at least one lowercase letter")
  }

  if (!/(?=.*[A-Z])/.test(passwordData.newPassword)) {
    throw new Error("Password must contain at least one uppercase letter")
  }

  if (!/(?=.*\d)/.test(passwordData.newPassword)) {
    throw new Error("Password must contain at least one number")
  }

  const response = await errorHandler.handleApiCall(
    () => apiClient.post<{ message: string }>("/change-password", {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    }),
    "Change Password"
  )
  if (!response || !response.success || !response.data) {
    throw new Error("Failed to change password")
  }
  return response.data
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate profile data
 */
export const validateProfileData = (data: Partial<ProfileData>): string[] => {
  const errors: string[] = []

  if (!data.firstName?.trim()) {
    errors.push("First name is required")
  }

  if (!data.lastName?.trim()) {
    errors.push("Last name is required")
  }

  if (!data.email?.trim()) {
    errors.push("Email is required")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (!data.phone?.trim()) {
    errors.push("Phone number is required")
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.push("Please enter a valid phone number")
  }

  if (!data.dateOfBirth) {
    errors.push("Date of birth is required")
  } else {
    const birthDate = new Date(data.dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 18) {
      errors.push("You must be at least 18 years old")
    }
  }

  if (!data.nationality?.trim()) {
    errors.push("Nationality is required")
  }

  if (!data.state?.trim()) {
    errors.push("State/Province is required")
  }

  return errors
}

/**
 * Validate password data
 */
export const validatePasswordData = (data: ChangePasswordRequest): string[] => {
  const errors: string[] = []

  if (!data.currentPassword?.trim()) {
    errors.push("Current password is required")
  }

  if (!data.newPassword?.trim()) {
    errors.push("New password is required")
  } else {
    if (data.newPassword.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }
    if (!/(?=.*[a-z])/.test(data.newPassword)) {
      errors.push("Password must contain at least one lowercase letter")
    }
    if (!/(?=.*[A-Z])/.test(data.newPassword)) {
      errors.push("Password must contain at least one uppercase letter")
    }
    if (!/(?=.*\d)/.test(data.newPassword)) {
      errors.push("Password must contain at least one number")
    }
  }

  if (!data.confirmPassword?.trim()) {
    errors.push("Confirm password is required")
  }

  if (data.newPassword !== data.confirmPassword) {
    errors.push("New password and confirm password do not match")
  }

  if (data.currentPassword === data.newPassword) {
    errors.push("New password must be different from current password")
  }

  return errors
}

/**
 * Validate settings data
 */
export const validateSettingsData = (data: Partial<SettingsData>): string[] => {
  const errors: string[] = []

  // All fields are boolean, so no specific validation needed
  // Add any specific validation rules for settings if needed in the future

  return errors
}
