import { type NextRequest, NextResponse } from "next/server"
import { signJWT } from "@/lib/jwt"

const DEMO_USERS = [
  {
    id: "1",
    email: "admin@robertsoftware.com",
    password: "Admin123!",
    role: "admin",
    name: "Administrador Principal",
    company: "Robert Software",
    position: "CEO & Fundador",
  },
  {
    id: "2",
    email: "empleado@demo.com",
    password: "Empleado123!",
    role: "empleado",
    name: "Empleado Demo",
    company: "Robert Software",
    position: "Desarrollador Senior",
  },
  {
    id: "3",
    email: "cliente@demo.com",
    password: "Cliente123!",
    role: "cliente",
    name: "Cliente Demo",
    company: "Empresa Demo S.L.",
    position: "Director de IT",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("Demo login attempt for:", email)
    console.log(
      "Available demo users:",
      DEMO_USERS.map((u) => ({ email: u.email, role: u.role })),
    )

    // Buscar usuario demo
    const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (!user) {
      console.log("Demo user not found or password incorrect")
      return NextResponse.json(
        {
          success: false,
          error: "Credenciales inválidas",
        },
        { status: 401 },
      )
    }

    // Generar token JWT
    const token = signJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    console.log("Demo login successful for:", email, "Role:", user.role)

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        company: user.company,
        position: user.position,
      },
    })

    // Configurar cookie con el token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Demo login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
