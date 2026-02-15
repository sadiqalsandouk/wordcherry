import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Server misconfigured: missing Supabase env vars" },
        { status: 500 }
      )
    }

    const body = await req.json().catch(() => ({} as { gameId?: string; token?: string }))
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
    const token = headerToken || body.token || null
    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 })
    }

    const { gameId } = body
    if (!gameId) {
      return NextResponse.json({ error: "Missing gameId" }, { status: 400 })
    }

    const admin = createClient(supabaseUrl, serviceKey)
    const { data: userRes, error: userErr } = await admin.auth.getUser(token)
    if (userErr || !userRes?.user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const userId = userRes.user.id

    const { error: deleteErr } = await admin
      .from("game_players")
      .delete()
      .eq("game_id", gameId)
      .eq("user_id", userId)

    if (deleteErr) {
      return NextResponse.json({ error: deleteErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error("leave-lobby error:", e)
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
