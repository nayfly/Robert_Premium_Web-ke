import { NextResponse } from "next/server"
import { testConnection } from "@/lib/supabase"

export async function GET() {
  try {
    const result = await testConnection()

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Database test failed: ${error}`,
      },
      { status: 500 },
    )
  }
}
