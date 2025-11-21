# Layout Groups Structure

## Directory Organization

\`\`\`
app/
├── layout.tsx                    # Root layout with Redux provider
├── (public)/                     # Public routes layout group
│   ├── layout.tsx               # Public layout with Header/Footer
│   ├── page.tsx                 # Homepage
│   ├── hotels/
│   │   └── page.tsx             # Hotels listing
│   ├── hotel/
│   │   └── [id]/page.tsx        # Hotel details
│   ├── destinations/
│   │   └── page.tsx
│   ├── blog/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
│
├── (protected)/                  # Protected routes (auth required)
│   ├── layout.tsx               # Protected layout wrapper
│   ├── dashboard/
│   │   └── page.tsx             # User dashboard
│   ├── bookings/
│   │   └── page.tsx             # User bookings
│   ├── profile/
│   │   └── page.tsx             # User profile settings
│   ├── wishlist/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
├── (auth)/                       # Auth routes layout group
│   ├── layout.tsx               # Centered auth layout
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── register/
│   │   └── page.tsx             # Register page
│   └── forgot-password/
│       └── page.tsx
│
├── api/                          # API routes
│   ├── auth/
│   ├── hotels/
│   └── bookings/
│
└── globals.css                   # Global styles

modules/                          # Feature modules
components/                       # Shared components
lib/                             # Utilities and config
types/                           # Type definitions
utils/                           # Constants and helpers
hooks/                           # Shared hooks
\`\`\`

## Layout Group Benefits

1. **Automatic Layout Wrapping** - Pages in a group share the same layout
2. **Different UIs** - Public, Protected, and Auth pages have different layouts
3. **Clean Separation** - URL structure doesn't show layout grouping
4. **Middleware Integration** - Route guards at middleware level
5. **Type Safety** - Each group can have its own route requirements

## Route Protection Flow

### Public Routes (/(public)/)
- No authentication required
- Header with login/signup links
- Footer with company info

### Protected Routes (/(protected)/)
- Authentication required (middleware check)
- Protected component wrapper
- Redirect to login if not authenticated
- Header with user menu
- Accessible to logged-in users

### Auth Routes (/(auth)/)
- Accessible to non-authenticated users only
- Centered layout (no header/footer)
- Redirect to dashboard if already logged in

## Next Steps (Phase 6)

- Create remaining page components
- Integrate modules with pages
- Add error pages (404, 500)
- Implement loading states
- Add type safety to pages
\`\`\`
