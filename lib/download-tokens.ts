import { supabaseAdmin } from "./supabase"
import { randomBytes } from "crypto"

export async function generateDownloadToken(orderId: string, productId: string): Promise<string> {
  try {
    // Generar token único
    const token = randomBytes(32).toString("hex")

    // Insertar en la base de datos
    const { data, error } = await supabaseAdmin
      .from("downloads")
      .insert({
        order_id: orderId,
        product_id: productId,
        download_token: token,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
        max_downloads: 5,
        download_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating download token:", error)
      throw new Error("Failed to create download token")
    }

    return token
  } catch (error) {
    console.error("Error in generateDownloadToken:", error)
    throw error
  }
}

export async function validateDownloadToken(token: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("downloads")
      .select(`
        *,
        orders (
          id,
          product_id,
          product_name,
          customer_email,
          status
        )
      `)
      .eq("download_token", token)
      .single()

    if (error || !data) {
      return { valid: false, error: "Token not found" }
    }

    // Verificar si el token ha expirado
    if (new Date(data.expires_at) < new Date()) {
      return { valid: false, error: "Token expired" }
    }

    // Verificar límite de descargas
    if (data.download_count >= data.max_downloads) {
      return { valid: false, error: "Download limit reached" }
    }

    return { valid: true, data }
  } catch (error) {
    console.error("Error validating download token:", error)
    return { valid: false, error: "Validation error" }
  }
}

export async function incrementDownloadCount(tokenId: string) {
  try {
    const { error } = await supabaseAdmin
      .from("downloads")
      .update({
        download_count: supabaseAdmin.raw("download_count + 1"),
        last_downloaded_at: new Date().toISOString(),
      })
      .eq("id", tokenId)

    if (error) {
      console.error("Error incrementing download count:", error)
      throw new Error("Failed to update download count")
    }
  } catch (error) {
    console.error("Error in incrementDownloadCount:", error)
    throw error
  }
}
