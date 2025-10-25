import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs" // ensure Node runtime

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // must be set on server

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Server misconfigured: missing Supabase env vars" },
        { status: 500 }
      )
    }

    // read bearer token from client
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (!token) {
      return NextResponse.json({ error: "Missing Authorization" }, { status: 401 })
    }

    // admin client (service role)
    const admin = createClient(supabaseUrl, serviceKey)

    // verify token -> get the user
    const { data: userRes, error: userErr } = await admin.auth.getUser(token)
    if (userErr || !userRes?.user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    const userId = userRes.user.id

    // Optional: clean up public data first (if you don't have ON DELETE CASCADE)
    // Delete leaderboard entries for this user
    const { error: delScoresErr } = await admin
      .from("leaderboard_entries")
      .delete()
      .eq("user_id", userId)
    if (delScoresErr) {
      // not fatal but useful to know
      console.warn("Failed to delete leaderboard entries:", delScoresErr)
    }

    // If your profiles table references auth.users(id) ON DELETE CASCADE,
    // deleting the auth user will cascade. If not, delete it here similarly:
    // await admin.from("profiles").delete().eq("id", userId)

    // Delete the auth user (requires service role)
    const { error: delUserErr } = await admin.auth.admin.deleteUser(userId)
    if (delUserErr) {
      return NextResponse.json(
        { error: delUserErr.message || "Could not delete user" },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error("delete-account error:", e)
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
