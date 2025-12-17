

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://hotel-booking-node.vercel.app",
  timeout: 30000,
  defaultHeaders: {
    "Content-Type": "application/json",
  },
}

