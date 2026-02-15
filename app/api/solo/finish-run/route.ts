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
    const userId = userRes.user.id

    const { data: run, error: runErr } = await admin
      .from("solo_runs")
      .select("*")
      .eq("id", runId)
      .eq("user_id", userId)
      .single()

    if (runErr || !run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 })
    }

    const now = Date.now()
    const lastEventMs = new Date(run.last_event_at).getTime()
    const elapsedMs = Math.max(0, now - lastEventMs)
    const remainingMs = Math.max(0, run.remaining_ms - elapsedMs)
    const status = "finished"

    const { data: updatedRun, error: updateErr } = await admin
      .from("solo_runs")
      .update({
        remaining_ms: remainingMs,
        status,
        ended_at: new Date(now).toISOString(),
        last_event_at: new Date(now).toISOString(),
      })
      .eq("id", run.id)
      .select("score, best_word, best_word_score, round_index, remaining_ms, status")
      .single()

    if (updateErr || !updatedRun) {
      return NextResponse.json({ error: updateErr?.message || "Failed to finalize run" }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      status: updatedRun.status,
      score: updatedRun.score,
      bestWord: updatedRun.best_word || "",
      bestWordScore: updatedRun.best_word_score || 0,
      roundIndex: updatedRun.round_index,
      remainingMs: updatedRun.remaining_ms,
    })
  } catch (err: any) {
    console.error("finish-run error:", err)
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}
