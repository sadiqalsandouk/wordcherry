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

    const { gameId } = await req.json().catch(() => ({ gameId: null as string | null }))
    if (!gameId) {
      return NextResponse.json({ error: "Missing gameId" }, { status: 400 })
    }

    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 })
    }

    const admin = createClient(supabaseUrl, serviceKey)
    const { data: userRes, error: userErr } = await admin.auth.getUser(token)
    if (userErr || !userRes?.user) {
      return NextResponse.json({ error: "Invalid auth token" }, { status: 401 })
    }
    const user = userRes.user

    const { data: game, error: gameErr } = await admin
      .from("games")
      .select("id, duration_seconds, status")
      .eq("id", gameId)
      .single()

    if (gameErr || !game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    if (game.status !== "finished") {
      return NextResponse.json({ error: "Game must be finished before leaderboard submission" }, { status: 400 })
    }

    const { data: player, error: playerErr } = await admin
      .from("game_players")
      .select("score, best_word, best_word_score, player_name")
      .eq("game_id", gameId)
      .eq("user_id", user.id)
      .single()

    if (playerErr || !player) {
      return NextResponse.json({ error: "Player not found in game" }, { status: 404 })
    }

    const { data: existingEntry, error: existingErr } = await admin
      .from("leaderboard_entries")
      .select("id")
      .eq("game_id", gameId)
      .eq("user_id", user.id)
      .eq("game_mode", "multiplayer")
      .maybeSingle()

    if (existingErr) {
      return NextResponse.json({ error: existingErr.message }, { status: 500 })
    }

    if (existingEntry) {
      return NextResponse.json({ ok: true, duplicate: true })
    }

    const { error: insertErr } = await admin.from("leaderboard_entries").insert({
      game_id: gameId,
      user_id: user.id,
      player_name: (player.player_name || `Guest-${user.id.slice(0, 6)}`).slice(0, 32),
      score: Math.max(0, Math.floor(player.score || 0)),
      best_word: (player.best_word || "").toUpperCase(),
      best_word_score: Math.max(0, Math.floor(player.best_word_score || 0)),
      game_mode: "multiplayer",
      duration_seconds: Math.max(1, Math.floor(game.duration_seconds || 30)),
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
      if (dup) {
        return NextResponse.json({ ok: true, duplicate: true })
      }
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("submit-multiplayer error:", err)
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}
