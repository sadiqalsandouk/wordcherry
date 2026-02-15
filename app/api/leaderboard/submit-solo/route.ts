import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 })
    }

    const { runId } = await req.json().catch(() => ({ runId: null as string | null }))
    if (!runId) {
      return NextResponse.json({ error: "Missing runId" }, { status: 400 })
    }

    const admin = createClient(supabaseUrl, serviceKey)
    const { data: userRes, error: userErr } = await admin.auth.getUser(token)
    if (userErr || !userRes?.user) {
      return NextResponse.json({ error: "Invalid auth token" }, { status: 401 })
    }
    const user = userRes.user

    const { data: run, error: runErr } = await admin
      .from("solo_runs")
      .select("*")
      .eq("id", runId)
      .eq("user_id", user.id)
      .single()

    if (runErr || !run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 })
    }

    if (run.status !== "finished") {
      return NextResponse.json({ error: "Run must be finished before leaderboard submission" }, { status: 400 })
    }

    if (run.submitted_to_leaderboard) {
      return NextResponse.json({ error: "You've already submitted your score!" }, { status: 409 })
    }

    const { error: insertErr } = await admin.from("leaderboard_entries").insert({
      game_id: run.id,
      user_id: user.id,
      player_name: (run.player_name || `Guest-${user.id.slice(0, 6)}`).slice(0, 32),
      score: Math.max(0, Math.floor(run.score || 0)),
      best_word: (run.best_word || "").toUpperCase(),
      best_word_score: Math.max(0, Math.floor(run.best_word_score || 0)),
      game_mode: "solo",
      duration_seconds: 30,
      is_anonymous:
        (user as any)?.is_anonymous ||
        user.app_metadata?.provider === "anon" ||
        (Array.isArray(user.identities) &&
          user.identities.length > 0 &&
          user.identities.every((i: any) => i?.provider === "anonymous")),
    })

    if (insertErr) {
      const msg = String(insertErr.message || "").toLowerCase()
      const dup =
        msg.includes("duplicate key") ||
        msg.includes("unique constraint") ||
        msg.includes("already exists")
      return NextResponse.json(
        { error: dup ? "You've already submitted your score!" : insertErr.message },
        { status: dup ? 409 : 500 }
      )
    }

    const { error: markErr } = await admin
      .from("solo_runs")
      .update({ submitted_to_leaderboard: true })
      .eq("id", run.id)

    if (markErr) {
      return NextResponse.json({ error: markErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("submit-solo error:", err)
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}
