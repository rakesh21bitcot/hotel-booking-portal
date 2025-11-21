# EliteStay App - Architectural Restructuring Plan

## Overview
Transform the current flat component structure into a modular, scalable architecture with proper separation of concerns, state management, and authentication.

---

## 1. NEW FOLDER STRUCTURE

\`\`\`
elitestay/
├── app/
│   ├── (public)/                    # Public routes layout
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Home
│   │   ├── hotels/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── destinations/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   └── error/
│   │       ├── 404.tsx
│   │       └── 500.tsx
│   │
│   ├── (protected)/                 # Protected routes layout
│   │   ├── layout.tsx               # Route guard applied here
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── bookings/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── checkout/
│   │   │       └── page.tsx
│   │   ├── wishlist/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── hotels/
│   │       │   └── page.tsx
│   │       ├── bookings/
│   │       │   └── page.tsx
│   │       └── users/
│   │           └── page.tsx
│   │
│   ├── api/                         # API routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── refresh/route.ts
│   │   ├── hotels/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── bookings/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── users/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── error/
│   │       └── route.ts
│   │
│   ├── globals.css
│   └── layout.tsx                   # Root layout
│
├── components/
│   ├── ui/                          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Badge.tsx
│   │   ├── Pagination.tsx
│   │   ├── Tabs.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Spinner.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   └── Accordion.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   │
│   └── common/                      # Common components shared across modules
│       ├── SearchBar.tsx
│       ├── DatePicker.tsx
│       ├── RatingDisplay.tsx
│       └── PriceDisplay.tsx
│
├── modules/                         # Feature modules
│   │
│   ├── hotel/
│   │   ├── components/
│   │   │   ├── HotelCard.tsx
│   │   │   ├── HotelGrid.tsx
│   │   │   ├── HotelFilter.tsx
│   │   │   ├── HotelImageGallery.tsx
│   │   │   ├── HotelDetailSection.tsx
│   │   │   └── AmenitiesGrid.tsx
│   │   ├── hooks/
│   │   │   ├── useHotels.ts
│   │   │   ├── useHotelDetail.ts
│   │   │   └── useHotelFilters.ts
│   │   ├── services/
│   │   │   └── hotelService.ts      # API calls
│   │   ├── store/
│   │   │   ├── hotelSlice.ts        # Redux slice
│   │   │   └── hotelActions.ts      # Async thunks
│   │   ├── types/
│   │   │   ├── hotel.types.ts
│   │   │   └── hotelFilter.types.ts
│   │   └── utils/
│   │       └── hotelFilters.ts
│   │
│   ├── room/
│   │   ├── components/
│   │   │   ├── RoomCard.tsx
│   │   │   ├── RoomGrid.tsx
│   │   │   ├── RoomDetails.tsx
│   │   │   └── RoomAmenities.tsx
│   │   ├── hooks/
│   │   │   └── useRooms.ts
│   │   ├── services/
│   │   │   └── roomService.ts
│   │   ├── store/
│   │   │   ├── roomSlice.ts
│   │   │   └── roomActions.ts
│   │   ├── types/
│   │   │   └── room.types.ts
│   │   └── utils/
│   │
│   ├── booking/
│   │   ├── components/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── BookingStep.tsx
│   │   │   ├── BookingReview.tsx
│   │   │   ├── BookingConfirmation.tsx
│   │   │   └── PriceBreakdown.tsx
│   │   ├── hooks/
│   │   │   ├── useBooking.ts
│   │   │   └── useBookingForm.ts
│   │   ├── services/
│   │   │   └── bookingService.ts
│   │   ├── store/
│   │   │   ├── bookingSlice.ts
│   │   │   └── bookingActions.ts
│   │   ├── types/
│   │   │   └── booking.types.ts
│   │   └── utils/
│   │       └── bookingCalculations.ts
│   │
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useLogin.ts
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── store/
│   │   │   ├── authSlice.ts
│   │   │   └── authActions.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── utils/
│   │       ├── tokenManager.ts
│   │       └── jwtDecoder.ts
│   │
│   ├── blog/
│   │   ├── components/
│   │   │   ├── BlogCard.tsx
│   │   │   ├── BlogGrid.tsx
│   │   │   ├── BlogPost.tsx
│   │   │   └── BlogCategory.tsx
│   │   ├── hooks/
│   │   │   └── useBlog.ts
│   │   ├── services/
│   │   │   └── blogService.ts
│   │   ├── store/
│   │   │   └── blogSlice.ts
│   │   ├── types/
│   │   │   └── blog.types.ts
│   │   └── utils/
│   │
│   ├── destination/
│   │   ├── components/
│   │   │   ├── DestinationCard.tsx
│   │   │   ├── DestinationGrid.tsx
│   │   │   ├── DestinationDetail.tsx
│   │   │   └── DestinationMap.tsx
│   │   ├── hooks/
│   │   │   └── useDestinations.ts
│   │   ├── services/
│   │   │   └── destinationService.ts
│   │   ├── store/
│   │   │   └── destinationSlice.ts
│   │   ├── types/
│   │   │   └── destination.types.ts
│   │   └── utils/
│   │
│   └── profile/
│       ├── components/
│       │   ├── ProfileForm.tsx
│       │   ├── ProfilePicture.tsx
│       │   ├── PreferenceSettings.tsx
│       │   └── BookingHistory.tsx
│       ├── hooks/
│       │   └── useProfile.ts
│       ├── services/
│       │   └── profileService.ts
│       ├── store/
│       │   └── profileSlice.ts
│       ├── types/
│       │   └── profile.types.ts
│       └── utils/
│
├── store/                           # Global Redux store
│   ├── store.ts                     # Redux store configuration
│   ├── rootReducer.ts               # Combined reducers
│   ├── middleware/
│   │   └── errorMiddleware.ts
│   └── hooks/
│       ├── useAppDispatch.ts
│       └── useAppSelector.ts
│
├── types/                           # Global shared types
│   ├── api.types.ts                 # API response/request types
│   ├── auth.types.ts                # Auth related types
│   ├── error.types.ts               # Error types
│   ├── pagination.types.ts
│   └── common.types.ts
│
├── lib/                             # Utility functions & helpers
│   ├── utils.ts
│   ├── classNameUtils.ts
│   ├── dateUtils.ts
│   ├── currencyUtils.ts
│   ├── validationUtils.ts
│   ├── storageUtils.ts
│   └── constants.ts
│
├── utilities/                       # Dummy data & mock services
│   ├── dummyData/
│   │   ├── hotels.ts
│   │   ├── rooms.ts
│   │   ├── bookings.ts
│   │   ├── blogs.ts
│   │   ├── destinations.ts
│   │   ├── users.ts
│   │   ├── reviews.ts
│   │   └── testimonials.ts
│   │
│   ├── mockServices/
│   │   ├── hotelMocks.ts
│   │   ├── bookingMocks.ts
│   │   ├── authMocks.ts
│   │   └── profileMocks.ts
│   │
│   └── seedData.ts                  # Initialize dummy data
│
├── services/                        # API services (HTTP layer)
│   ├── apiClient.ts                 # Axios/Fetch client setup
│   ├── errorHandler.ts              # Centralized error handling
│   ├── interceptors.ts              # Request/response interceptors
│   └── baseService.ts               # Base service class
│
├── hooks/                           # Global custom hooks
│   ├── useToast.ts
│   ├── useModal.ts
│   ├── useResponsive.ts
│   ├── useFetch.ts
│   └── useLocalStorage.ts
│
├── middleware/
│   ├── routeGuard.ts                # Auth route protection
│   ├── authMiddleware.ts            # Token validation
│   └── errorMiddleware.ts           # Error handling
│
├── contexts/                        # React contexts (if needed)
│   ├── ToastContext.tsx
│   └── ModalContext.tsx
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── tests/
    ├── unit/
    ├── integration/
    └── __mocks__/
\`\`\`

---

## 2. IMPLEMENTATION PHASES

### Phase 1: Core Architecture (Week 1)
- [ ] Set up Redux Toolkit and store structure
- [ ] Create base API service and error handler
- [ ] Establish folder structure
- [ ] Create type definitions system
- [ ] Set up authentication middleware and route guards

### Phase 2: UI Component Library (Week 1)
- [ ] Create reusable UI components
- [ ] Set up common components
- [ ] Create layout components

### Phase 3: Module Development (Week 2-3)
- [ ] Hotel module (components, hooks, services, types)
- [ ] Room module
- [ ] Booking module
- [ ] Auth module with login/register
- [ ] Profile module
- [ ] Blog module
- [ ] Destination module

### Phase 4: Layout & Pages (Week 2-3)
- [ ] Public layout
- [ ] Protected layout with route guards
- [ ] Admin layout
- [ ] All page implementations

### Phase 5: Testing & Optimization (Week 4)
- [ ] API integration
- [ ] Error handling testing
- [ ] Performance optimization
- [ ] Deployment preparation

---

## 3. KEY TECHNOLOGIES & PATTERNS

### State Management
- **Redux Toolkit** with:
  - Async thunks for API calls
  - Slice-based reducers
  - Middleware for error handling
  - Custom hooks (useAppDispatch, useAppSelector)

### Authentication
- JWT-based auth with token storage
- Protected route wrapper component
- Token refresh mechanism
- Login/register/logout flows

### Error Handling
- Centralized error handler
- Custom error types
- Toast notifications for errors
- Error middleware in Redux

### API Services
- Axios-based HTTP client
- Request/response interceptors
- Automatic token attachment
- Error code mapping

### Type Safety
- Global type definitions in `/types`
- Module-level types in each module's `/types` folder
- Full TypeScript support

---

## 4. FILE NAMING CONVENTIONS

- Components: PascalCase (e.g., `HotelCard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useHotels.ts`)
- Services: camelCase (e.g., `hotelService.ts`)
- Slices: camelCase with `Slice` suffix (e.g., `hotelSlice.ts`)
- Types: camelCase with `.types.ts` suffix (e.g., `hotel.types.ts`)
- Utils: camelCase (e.g., `hotelFilters.ts`)
- Constants: UPPER_SNAKE_CASE (in `constants.ts`)

---

## 5. IMPLEMENTATION DETAILS

### Redux Store Structure
\`\`\`
store/
├── hotel/
│   ├── state (hotels[], loading, error, filters)
│   ├── reducers (setHotels, setLoading, setError)
│   └── extraReducers (API async thunks)
├── auth/
│   ├── state (user, token, isAuthenticated, loading)
│   ├── reducers (setUser, setToken, logout)
│   └── extraReducers (login, register API calls)
└── booking/
    ├── state (currentBooking, bookingHistory, loading)
    ├── reducers (setBooking, updateBooking)
    └── extraReducers (createBooking API calls)
\`\`\`

### Error Handling Flow
\`\`\`
API Call → Interceptor → Error Occurs → Error Handler 
→ Redux Error Action → Toast Notification
\`\`\`

### Route Protection
\`\`\`
User navigates to protected route 
→ Check auth in layout
→ If not authenticated: redirect to login
→ If authenticated: render protected page
→ Token expired: refresh or logout
\`\`\`

---

## 6. MIGRATION STEPS

1. Create new folder structure alongside existing
2. Build Redux store and global state
3. Migrate components to modules gradually
4. Create API services and error handlers
5. Implement authentication flows
6. Update pages to use new structure
7. Test all workflows
8. Remove old structure
9. Deploy

---

## 7. BENEFITS OF THIS ARCHITECTURE

✅ **Scalability**: Easy to add new modules and features
✅ **Maintainability**: Clear separation of concerns
✅ **Reusability**: Shared UI and common components
✅ **Type Safety**: Comprehensive TypeScript definitions
✅ **Error Handling**: Centralized error management
✅ **Authentication**: Secure protected routes
✅ **State Management**: Redux Toolkit for predictable state
✅ **Testing**: Easier to test isolated modules
✅ **Performance**: Optimized bundle with lazy loading
✅ **Team Collaboration**: Clear structure for multi-developer teams
