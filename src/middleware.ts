import { type NextRequest, NextResponse } from "next/server"
import { ROUTES } from "@/utils/constants"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get("auth_token")?.value

  const publicRoutes = [
    ROUTES.PUBLIC.HOME,
    ROUTES.PUBLIC.LOGIN,
    ROUTES.PUBLIC.REGISTER,
    ROUTES.PUBLIC.HOTELS,
    ROUTES.PUBLIC.CONTACT,
    ROUTES.PUBLIC.BLOG,
    ROUTES.PUBLIC.DESTINATIONS,
  ]

  const protectedRoutes = [
    ROUTES.PROTECTED.DASHBOARD,
    ROUTES.PROTECTED.BOOKING,
    ROUTES.PROTECTED.BOOKINGS,
    ROUTES.PROTECTED.PROFILE,
    ROUTES.PROTECTED.WISHLIST,
    ROUTES.PROTECTED.SETTINGS,
  ]

  const adminRoutes = [ROUTES.ADMIN.DASHBOARD, ROUTES.ADMIN.HOTELS, ROUTES.ADMIN.BOOKINGS]

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // If no token and trying to access protected route, redirect to login
  if ((isProtectedRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL(ROUTES.PUBLIC.LOGIN, request.url))
  }

  // If token exists and trying to access auth routes, redirect to dashboard
  if (token && (pathname === ROUTES.PUBLIC.LOGIN || pathname === ROUTES.PUBLIC.REGISTER)) {
    return NextResponse.redirect(new URL(ROUTES.PROTECTED.DASHBOARD, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.*|apple-icon.*).*)"],
}
