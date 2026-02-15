import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateWord } from "@/app/utils/wordValidation"
import { getSeededLetters } from "@/app/utils/getSeededLetters"
import { calculateFinalScore } from "@/app/utils/wordScoringSystem"
import { calculateTimeBonus } from "@/app/utils/timeBonusSystem"

export const runtime = "nodejs"

function canBuildFromLetters(word: string, letters: string[]): boolean {
  const counts = new Map<string, number>()
  for (const letter of letters) {
    counts.set(letter, (counts.get(letter) || 0) + 1)
  }
  for (const ch of word) {
    const remaining = counts.get(ch) || 0
    if (remaining <= 0) return false
    counts.set(ch, remaining - 1)
  }
  return true
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

    const { runId, word } = await req.json().catch(() => ({ runId: null as string | null, word: "" }))
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

    if (run.status !== "active") {
      return NextResponse.json({
        ok: true,
        valid: false,
        status: run.status,
        score: run.score,
        bestWord: run.best_word || "",
        bestWordScore: run.best_word_score || 0,
        roundIndex: run.round_index,
        remainingMs: run.remaining_ms,
        wordScore: 0,
        bonusSeconds: 0,
      })
    }

    const now = Date.now()
    const lastEventMs = new Date(run.last_event_at).getTime()
    const elapsedMs = Math.max(0, now - lastEventMs)
    const remainingBeforeMs = Math.max(0, run.remaining_ms - elapsedMs)

    if (remainingBeforeMs <= 0) {
      const { data: endedRun } = await admin
        .from("solo_runs")
        .update({ status: "finished", remaining_ms: 0, ended_at: new Date(now).toISOString(), last_event_at: new Date(now).toISOString() })
        .eq("id", run.id)
        .select("score, best_word, best_word_score, round_index, remaining_ms, status")
        .single()

      return NextResponse.json({
        ok: true,
        valid: false,
        status: "finished",
        score: endedRun?.score ?? run.score,
        bestWord: endedRun?.best_word ?? run.best_word ?? "",
        bestWordScore: endedRun?.best_word_score ?? run.best_word_score ?? 0,
        roundIndex: endedRun?.round_index ?? run.round_index,
        remainingMs: 0,
        wordScore: 0,
        bonusSeconds: 0,
      })
    }

    const normalizedWord = String(word || "").toUpperCase().trim()
    const letters = getSeededLetters(run.seed, run.round_index)
    const isValidWord =
      validateWord(normalizedWord) &&
      normalizedWord.length >= 3 &&
      normalizedWord.length <= letters.length &&
      canBuildFromLetters(normalizedWord, letters)

    let nextScore = run.score
    let nextBestWord = run.best_word
    let nextBestWordScore = run.best_word_score
    let nextRoundIndex = run.round_index
    let wordScore = 0
    let bonusSeconds = 0

    if (isValidWord) {
      wordScore = calculateFinalScore(normalizedWord)
      bonusSeconds = calculateTimeBonus(normalizedWord)
      nextScore += wordScore
      nextRoundIndex += 1
      if (wordScore > (nextBestWordScore || 0)) {
        nextBestWord = normalizedWord
        nextBestWordScore = wordScore
      }
    }

    const nextRemainingMs = Math.min(120_000, remainingBeforeMs + bonusSeconds * 1000)
    const status = nextRemainingMs <= 0 ? "finished" : "active"
    const endedAt = status === "finished" ? new Date(now).toISOString() : null

    const { data: updatedRun, error: updateErr } = await admin
      .from("solo_runs")
      .update({
        score: nextScore,
        best_word: nextBestWord,
        best_word_score: nextBestWordScore,
        round_index: nextRoundIndex,
        remaining_ms: Math.max(0, Math.floor(nextRemainingMs)),
        last_event_at: new Date(now).toISOString(),
        status,
        ended_at: endedAt,
      })
      .eq("id", run.id)
      .select("score, best_word, best_word_score, round_index, remaining_ms, status")
      .single()

    if (updateErr || !updatedRun) {
      return NextResponse.json({ error: updateErr?.message || "Failed to update run" }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      valid: isValidWord,
      status: updatedRun.status,
      score: updatedRun.score,
      bestWord: updatedRun.best_word || "",
      bestWordScore: updatedRun.best_word_score || 0,
      roundIndex: updatedRun.round_index,
      remainingMs: updatedRun.remaining_ms,
      wordScore,
      bonusSeconds,
    })
  } catch (err: any) {
    console.error("submit-word error:", err)
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}
