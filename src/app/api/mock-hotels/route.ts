import { NextResponse } from "next/server"
import { dummyHotels } from "@/utils/dummy-data"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: dummyHotels,
  })
}
