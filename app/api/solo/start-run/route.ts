import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

function makeSeed() {
  return crypto.randomUUID().replace(/-/g, "")
}

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

    const admin = createClient(supabaseUrl, serviceKey)
    const { data: userRes, error: userErr } = await admin.auth.getUser(token)
    if (userErr || !userRes?.user) {
      return NextResponse.json({ error: "Invalid auth token" }, { status: 401 })
    }

    const { playerName } = await req.json().catch(() => ({ playerName: null as string | null }))
    const user = userRes.user
    const safeName = (playerName || `Guest-${user.id.slice(0, 6)}`).trim().slice(0, 32)

    const { data, error } = await admin
      .from("solo_runs")
      .insert({
        user_id: user.id,
        player_name: safeName,
        seed: makeSeed(),
        duration_seconds: 30,
        remaining_ms: 30_000,
        score: 0,
        best_word: null,
        best_word_score: 0,
        round_index: 0,
        status: "active",
      })
      .select("id, seed, duration_seconds, remaining_ms, round_index, score, best_word, best_word_score")
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Failed to create run" }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      run: {
        id: data.id,
        seed: data.seed,
        durationSeconds: data.duration_seconds,
        remainingMs: data.remaining_ms,
        roundIndex: data.round_index,
        score: data.score,
        bestWord: data.best_word ?? "",
        bestWordScore: data.best_word_score ?? 0,
      },
    })
  } catch (err: any) {
    console.error("start-run error:", err)
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}
