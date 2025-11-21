# EliteStay Project Structure

## Directory Organization

\`\`\`
elitestay/
├── app/
│   ├── layout.tsx              # Root layout with Redux provider
│   ├── globals.css             # Global styles and design tokens
│   ├── page.tsx                # Homepage
│   ├── (public)/               # Public routes layout group
│   │   ├── layout.tsx
│   │   ├── hotels/
│   │   ├── hotel/[id]/
│   │   ├── destinations/
│   │   ├── blog/
│   │   └── contact/
│   ├── (protected)/            # Protected routes layout group (auth required)
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── bookings/
│   │   ├── profile/
│   │   ├── wishlist/
│   │   └── settings/
│   ├── (auth)/                 # Auth routes layout group
│   │   ├── layout.tsx
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   └── api/                    # API routes
│       ├── hotels/
│       ├── bookings/
│       ├── auth/
│       └── users/
│
├── modules/                    # Feature modules
│   ├── auth/
│   │   ├── components/        # Auth-specific components
│   │   ├── services/          # Auth API services
│   │   ├── store/             # Redux slice & thunks
│   │   ├── hooks/             # Custom hooks (useAuth, useLogin)
│   │   └── types/             # Auth types
│   │
│   ├── hotel/
│   │   ├── components/        # Hotel-specific components
│   │   ├── services/          # Hotel API services
│   │   ├── store/             # Redux slice & thunks
│   │   ├── hooks/             # Custom hooks (useHotels, useHotelDetail)
│   │   └── types/             # Hotel types
│   │
│   ├── room/
│   ├── booking/
│   ├── blog/
│   ├── destination/
│   ├── profile/
│   └── admin/
│
├── components/
│   ├── ui/                     # Reusable UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ... (existing shadcn components)
│   │
│   ├── common/                 # Shared components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── Loader.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── Toast.tsx
│   │
│   └── layouts/               # Layout components
│       ├── PublicLayout.tsx
│       ├── ProtectedLayout.tsx
│       └── AuthLayout.tsx
│
├── lib/
│   ├── store.ts              # Redux store config
│   ├── providers.tsx         # Redux provider
│   ├── api-client.ts         # API client with error handling
│   ├── error-handler.ts      # Centralized error handler
│   ├── storage.ts            # Local storage utilities
│   └── utils.ts              # General utilities
│
├── types/
│   ├── index.ts              # Barrel export
│   ├── api.ts                # API types
│   ├── auth.ts               # Auth types
│   ├── common.ts             # Common types
│   ├── hotel.ts              # Hotel types (in modules/hotel/types)
│   ├── booking.ts            # Booking types (in modules/booking/types)
│   └── ... (module types)
│
├── utils/
│   ├── constants.ts          # App constants
│   ├── dummy-data.ts         # Mock data for development
│   ├── validators.ts         # Zod schemas for validation
│   ├── formatters.ts         # String/date/number formatting
│   └── hooks.ts              # Shared custom hooks
│
├── hooks/
│   ├── use-auth.ts           # Authentication hook
│   ├── use-api.ts            # API call hook with error handling
│   └── ... (more shared hooks)
│
├── middleware.ts             # Next.js middleware for route guards
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
\`\`\`

## File Naming Conventions

- Components: PascalCase (e.g., `HotelCard.tsx`)
- Utilities: camelCase (e.g., `formatters.ts`)
- Types: camelCase with `.ts` (e.g., `hotelTypes.ts`)
- API files: camelCase (e.g., `hotelService.ts`)
- Redux slices: camelCase + "Slice" (e.g., `hotelSlice.ts`)

## Module Structure Pattern

Each feature module follows this structure:

\`\`\`
modules/feature/
├── components/
│   ├── index.ts
│   ├── FeatureCard.tsx
│   ├── FeatureList.tsx
│   └── FeatureDetail.tsx
├── services/
│   ├── index.ts
│   └── featureService.ts        # API calls
├── store/
│   ├── index.ts
│   ├── featureSlice.ts          # Redux slice
│   └── featureThunks.ts         # Async thunks
├── hooks/
│   ├── index.ts
│   ├── useFeatures.ts
│   └── useFeatureDetail.ts
├── types/
│   ├── index.ts
│   └── feature.ts
└── index.ts                      # Barrel export
\`\`\`

## Import Paths

Using path aliases in `tsconfig.json`:

\`\`\`typescript
import { HotelCard } from "@/modules/hotel/components"
import { useHotels } from "@/modules/hotel/hooks"
import type { Hotel } from "@/modules/hotel/types"
import { getHotels } from "@/modules/hotel/services"
import { hotel } from "@/lib/store"
import { formatCurrency } from "@/utils/formatters"
import { dummyHotels } from "@/utils/dummy-data"
