export const APP_CONSTANTS = {
  API_TIMEOUT: 30000,
  CACHE_DURATION: 300000, // 5 minutes
  TOAST_DURATION: 4000,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
}

export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    HOTELS: "/hotels",
    HOTEL_DETAIL: "/hotel",
    CONTACT: "/contact",
    BLOG: "/blog",
    DESTINATIONS: "/destinations",
  },
  PROTECTED: {
    DASHBOARD: "/dashboard",
    MYBOOKING: "/my-booking",
    BOOKINGS: "/bookings",
    PROFILE: "/profile",
    WISHLIST: "/wishlist",
    SETTINGS: "/settings",
    CART: "/cart"
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    HOTELS: "/admin/hotels",
    BOOKINGS: "/admin/bookings",
    USERS: "/admin/users",
  },
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}
