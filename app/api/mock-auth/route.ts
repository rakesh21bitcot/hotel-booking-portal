import { NextResponse } from "next/server"
import { dummyUser } from "@/utils/dummy-data"

export async function POST(request: Request) {
  const body = await request.json()

  // Mock login
  if (body.email && body.password) {
    return NextResponse.json({
      success: true,
      data: {
        user: dummyUser,
        token: "mock_token_" + Date.now(),
        refreshToken: "mock_refresh_" + Date.now(),
      },
    })
  }

  return NextResponse.json({ success: false, error: { message: "Invalid credentials" } }, { status: 400 })
}
