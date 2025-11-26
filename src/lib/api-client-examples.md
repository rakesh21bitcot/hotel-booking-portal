# API Client Usage Examples

## POST Method Examples

### Basic POST Request

```typescript
import { apiClient } from "@/lib/api-client"
import { errorHandler } from "@/lib/error-handler"

// Simple POST request
const createUser = async (userData: { name: string; email: string }) => {
    try {
        const response = await apiClient.post<User>("/api/users", userData)
        
        if (response.success && response.data) {
            return response.data
        }
    } catch (error) {
        errorHandler.handleErrorWithToast(error, "Create User")
        throw error
    }
}
```

### POST with Error Handler Wrapper

```typescript
// Using the error handler wrapper (automatically shows toast and logs error)
const user = await errorHandler.handleApiCall(
    () => apiClient.post<User>("/api/users", userData),
    "Create User"
)
```

### POST with Custom Headers

```typescript
const response = await apiClient.post<User>(
    "/api/users",
    userData,
    {
        headers: {
            "X-Custom-Header": "custom-value",
            "Authorization": "Bearer custom-token"
        }
    }
)
```

### POST with Custom Timeout

```typescript
const response = await apiClient.post<User>(
    "/api/users",
    userData,
    {
        timeout: 10000 // 10 seconds (default is 30 seconds)
    }
)
```

### POST with FormData (File Upload)

```typescript
const formData = new FormData()
formData.append("file", file)
formData.append("name", "filename")

const response = await apiClient.post<{ fileUrl: string }>(
    "/api/upload",
    formData,
    {
        // Don't set Content-Type header for FormData
        // Browser will automatically set it with boundary
    }
)
```

### POST Request Structure

```typescript
apiClient.post<ResponseType>(
    endpoint: string,        // API endpoint (e.g., "/api/users")
    data?: unknown,          // Request body data (optional)
    config?: RequestConfig   // Optional configuration
): Promise<ApiResponse<ResponseType>>
```

### Response Structure

```typescript
interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: {
        code: string
        message: string
    }
    message?: string
}
```

### Error Handling Options

**Option 1: Try-Catch with Error Handler**
```typescript
try {
    const response = await apiClient.post<User>("/api/users", userData)
    if (response.success && response.data) {
        // Handle success
    }
} catch (error) {
    errorHandler.handleErrorWithToast(error, "Create User")
    throw error
}
```

**Option 2: Using Error Handler Wrapper**
```typescript
const user = await errorHandler.handleApiCall(
    () => apiClient.post<User>("/api/users", userData),
    "Create User"
)
// Returns null if error occurred, or the data if successful
```

**Option 3: Manual Error Handling**
```typescript
try {
    const response = await apiClient.post<User>("/api/users", userData)
    // Handle response
} catch (error) {
    if (errorHandler.isNetworkError(error)) {
        // Handle network error
    } else if (errorHandler.isAuthError(error)) {
        // Handle auth error
    } else if (errorHandler.isValidationError(error)) {
        // Handle validation error
    }
    const message = errorHandler.getUserFriendlyMessage(error)
    // Show custom error message
}
```

### Real-World Example: Booking Creation

```typescript
interface BookingData {
    hotelId: string
    checkIn: string
    checkOut: string
    guests: number
    rooms: number
}

export const createBooking = async (bookingData: BookingData) => {
    try {
        const response = await apiClient.post<{
            bookingId: string
            status: string
            totalAmount: number
        }>("/api/bookings", bookingData)
        
        if (response.success && response.data) {
            // Success - booking created
            return response.data
        } else {
            throw new Error(response.error?.message || "Failed to create booking")
        }
    } catch (error) {
        errorHandler.handleErrorWithToast(error, "Create Booking")
        throw error
    }
}
```

