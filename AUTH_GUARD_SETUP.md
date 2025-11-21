# Authentication & Route Guards Setup

## Files Created

### 1. Middleware (middleware.ts)
- Route-level authentication checks
- Protects routes at the middleware layer
- Redirects unauthenticated users to login
- Prevents logged-in users from accessing auth routes
- Checks for `auth_token` cookie

### 2. Protected Route Component (components/ProtectedRoute.tsx)
- Client-side route protection wrapper
- Checks authentication state
- Supports role-based access control (RBAC)
- Shows loading spinner while checking auth
- Redirects to login if not authenticated

### 3. Auth Utils (lib/auth-utils.ts)
- Token management (save, get, clear)
- JWT parsing utilities
- Token expiration checking
- Cookie management
- Authentication status check

### 4. Custom Hooks

#### useAuthRedirect (hooks/useAuthRedirect.ts)
- Redirects based on authentication state
- Options to redirect if logged in or not logged in
- Useful for login/register pages

#### useAuth (modules/auth/hooks/useAuth.ts)
- Access to user state
- Login, register, logout functions
- Loading and error states

### 5. Protected Route Wrapper (modules/auth/components/ProtectedRouteWrapper.tsx)
- Specialized wrapper for protected routes
- Handles loading state properly
- Prevents hydration mismatches

## Usage Patterns

### Pattern 1: Middleware Protection
\`\`\`typescript
// Routes under /protected/** are automatically protected by middleware
// Users without token are redirected to /auth/login
\`\`\`

### Pattern 2: Component-Level Protection
\`\`\`tsx
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  )
}
\`\`\`

### Pattern 3: Admin Routes
\`\`\`tsx
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function AdminPanel() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>Admin content only</div>
    </ProtectedRoute>
  )
}
\`\`\`

### Pattern 4: Auth Page Redirect
\`\`\`tsx
"use client"

import { useAuthRedirect } from "@/hooks/useAuthRedirect"

export default function LoginPage() {
  useAuthRedirect({ redirectIfLoggedIn: true })
  
  return <LoginForm />
}
\`\`\`

### Pattern 5: Token Management
\`\`\`typescript
import { authUtils } from "@/lib/auth-utils"

// Save tokens after login
authUtils.saveAuthTokens(token, refreshToken)

// Check if authenticated
if (authUtils.isAuthenticated()) {
  // User is logged in
}

// Clear auth on logout
authUtils.clearAuth()

// Check token expiration
if (authUtils.isTokenExpired(token)) {
  // Refresh token
}
\`\`\`

## Security Flow

1. User logs in via LoginForm
2. Auth service sends credentials to API
3. API returns token and refresh token
4. Tokens saved in localStorage and cookies
5. Middleware checks for token on protected routes
6. Protected components verify auth state
7. On logout, tokens cleared from storage and cookies

## Next Steps (Phase 5)

- Create layout groups: (public), (protected), (auth)
- Move pages to appropriate layout groups
- Create page-level auth wrappers
- Setup middleware integration with pages
\`\`\`
