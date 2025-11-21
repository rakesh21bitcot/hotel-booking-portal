# Testing Guide

## Setup

The project includes a testing infrastructure with Jest and React Testing Library setup.

### Test Structure

\`\`\`
__tests__/
├── setup.ts                    # Jest configuration
├── unit/
│   ├── utils/
│   │   ├── formatters.test.ts
│   │   └── validators.test.ts
│   └── lib/
│       └── error-handler.test.ts
├── integration/
│   ├── auth.test.ts
│   ├── hotel.test.ts
│   └── booking.test.ts
└── e2e/
    ├── login-flow.test.ts
    └── booking-flow.test.ts
\`\`\`

## Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- formatters.test.ts

# Run with coverage
npm test -- --coverage
\`\`\`

## Unit Tests

Test individual utilities and functions:

\`\`\`typescript
// __tests__/unit/utils/formatters.test.ts
import { formatCurrency, formatDate } from "@/utils/formatters"

describe("formatCurrency", () => {
  it("should format number as currency", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00")
  })
})
\`\`\`

## Integration Tests

Test Redux slices and API integration:

\`\`\`typescript
// __tests__/integration/auth.test.ts
import { store } from "@/lib/store"
import { loginThunk } from "@/modules/auth/store/authThunks"

describe("Auth Integration", () => {
  it("should handle login flow", async () => {
    const result = await store.dispatch(
      loginThunk({ email: "test@example.com", password: "password" })
    )
    expect(result.payload).toBeDefined()
  })
})
\`\`\`

## E2E Tests

Test complete user flows using Playwright or Cypress:

\`\`\`typescript
// __tests__/e2e/login-flow.test.ts
import { test, expect } from "@playwright/test"

test("user can login and access dashboard", async ({ page }) => {
  await page.goto("http://localhost:3000/login")
  await page.fill('input[type="email"]', "test@example.com")
  await page.fill('input[type="password"]', "password")
  await page.click("button:text('Login')")
  await expect(page).toHaveURL("/dashboard")
})
\`\`\`

## Testing Best Practices

1. **Mock External Services** - Use mock APIs for development
2. **Test User Flows** - Focus on what users do, not implementation
3. **Use Data Attributes** - Add data-testid for reliable element selection
4. **Clean Up** - Reset state between tests
5. **Async Handling** - Use waitFor for async operations

## Mocking Strategies

### Mock API Calls
\`\`\`typescript
import { hotelService } from "@/modules/hotel/services/hotelService"

jest.mock("@/modules/hotel/services/hotelService", () => ({
  hotelService: {
    getHotels: jest.fn(() => Promise.resolve(dummyHotels)),
  },
}))
\`\`\`

### Mock Redux Store
\`\`\`typescript
import { configureStore } from "@reduxjs/toolkit"

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
})
\`\`\`

### Mock useRouter
\`\`\`typescript
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))
\`\`\`

## Debugging Tests

\`\`\`bash
# Run tests with verbose output
npm test -- --verbose

# Debug specific test
node --inspect-brk node_modules/.bin/jest test.js

# View DOM output
import { screen } from "@testing-library/react"
screen.debug()
\`\`\`

## Coverage Goals

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

Generate coverage report:
\`\`\`bash
npm test -- --coverage
\`\`\`
\`\`\`
