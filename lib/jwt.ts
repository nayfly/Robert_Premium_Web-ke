import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required")
}

const secret = new TextEncoder().encode(JWT_SECRET)

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export async function signJWT(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret)

    return token
  } catch (error) {
    console.error("Error signing JWT:", error)
    throw new Error("Failed to sign JWT")
  }
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as JWTPayload
  } catch (error) {
    console.error("Error verifying JWT:", error)
    return null
  }
}

export async function refreshJWT(token: string): Promise<string | null> {
  try {
    const payload = await verifyJWT(token)
    if (!payload) {
      return null
    }

    // Crear nuevo token sin iat y exp
    const newPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    }

    return await signJWT(newPayload)
  } catch (error) {
    console.error("Error refreshing JWT:", error)
    return null
  }
}
