import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT } from "@/lib/jwt"
import { logAuditEvent } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (token) {
      const payload = await verifyJWT(token)
      if (payload) {
        // Log del evento de logout
        await logAuditEvent({
          user_id: payload.userId,
          action: "USER_LOGOUT",
          table_name: "users",
          record_id: payload.userId,
          ip_address: request.ip || "unknown",
          user_agent: request.headers.get("user-agent") || "unknown",
          severity: "info",
          success: true,
          new_values: {
            email: payload.email,
            role: payload.role,
          },
        })
      }
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" })

    // Eliminar cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Error during logout" }, { status: 500 })
  }
}
