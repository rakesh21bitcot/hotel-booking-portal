# Quick Start Guide

## Installation

1. **Clone and Install**
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

2. **Environment Setup**
\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Update with your values
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
\`\`\`

3. **Access the App**
\`\`\`
http://localhost:3000
\`\`\`

## Project Structure Quick Reference

- **app/** - Next.js pages and layouts
- **modules/** - Feature modules (auth, hotel, booking)
- **components/** - Reusable components
- **lib/** - Redux store, API client, utilities
- **types/** - TypeScript type definitions
- **utils/** - Constants, validators, formatters

## Common Tasks

### Add a New Module

1. Create module folder: `modules/feature/`
2. Add subfolders: types, services, store, hooks, components
3. Create types: `types/feature.ts`
4. Create service: `services/featureService.ts`
5. Create Redux slice: `store/featureSlice.ts`
6. Create thunks: `store/featureThunks.ts`
7. Create hook: `hooks/useFeature.ts`
8. Update store: `lib/store.ts`

### Create a New Page

1. Create folder in appropriate layout group
2. Create `page.tsx` file
3. Import necessary modules/hooks
4. Add page content
5. Test in browser

### Add API Integration

1. Create service file: `services/entityService.ts`
2. Implement API calls using `api.get()`, `api.post()`, etc.
3. Create Redux slice: `store/entitySlice.ts`
4. Create thunks: `store/entityThunks.ts`
5. Create hook: `hooks/useEntity.ts`
6. Use in components: `const { data } = useEntity()`

### Protect a Route

Option 1: Middleware (automatic)
- Place page in `app/(protected)/` folder

Option 2: Component wrapper
\`\`\`tsx
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function Page() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  )
}
\`\`\`

### Handle Errors

\`\`\`tsx
import { errorHandler } from "@/lib/error-handler"

try {
  // Do something
} catch (error) {
  errorHandler.handleErrorWithToast(error, "Operation Name")
}
\`\`\`

## Useful Commands

\`\`\`bash
# Development
npm run dev                 # Start dev server
npm run build              # Build production bundle
npm start                  # Start production server
npm run lint               # Run ESLint

# Testing
npm test                   # Run tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # Coverage report
\`\`\`

## Debugging

1. **Browser DevTools**
   - React DevTools extension for component inspection
   - Redux DevTools for state management

2. **Console Logging**
   - Use `console.log("[v0] message")` for debugging

3. **VS Code Debugging**
   - Set breakpoints in VS Code
   - Run with debugger

## Common Issues & Solutions

### "useRouter is not available"
- Make sure you're using `"use client"` directive
- Import from `"next/navigation"` not `"next/router"`

### "Redux state is undefined"
- Check Redux provider is in layout.tsx
- Verify reducer is added to store

### "API calls returning mock data"
- Update NEXT_PUBLIC_API_URL in .env
- Switch from mock services to real API

### "Route guards not working"
- Ensure middleware.ts exists at root level
- Check route patterns in middleware matcher

## Next Steps

1. Connect to real backend API
2. Implement database
3. Add payment processing
4. Setup email notifications
5. Deploy to production
6. Monitor and optimize
\`\`\`
