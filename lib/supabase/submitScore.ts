import type { SubmitScoreInput, SubmitScoreResult } from "@/app/types/types"
import { supabase } from "./supabase"
import { getOrCreateDeviceToken } from "@/lib/deviceToken"

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function submitScore(input: SubmitScoreInput): Promise<SubmitScoreResult> {
  if (!input.gameId) return { ok: false, error: "Missing game id" }
  if (!Number.isFinite(input.score) || input.score < 0) {
    return { ok: false, error: "Score must be a non-negative number." }
  }
  if (!Number.isFinite(input.bestWordScore) || input.bestWordScore < 0) {
    return { ok: false, error: "Best word score must be a non-negative number." }
  }
  if (input.bestWordScore > input.score) {
    return { ok: false, error: "Best word score cannot exceed total score." }
  }
  if (input.gameMode !== "solo" && input.gameMode !== "multiplayer") {
    return { ok: false, error: "Invalid game mode." }
  }
  if (!Number.isFinite(input.durationSeconds) || input.durationSeconds <= 0) {
    return { ok: false, error: "Duration must be a positive number." }
  }

  const { data: userRes, error: authErr1 } = await supabase.auth.getUser()
  if (authErr1 || !userRes?.user) {
    const { data: anonData, error: anonErr } = await supabase.auth.signInAnonymously()
    if (anonErr || !anonData?.user) {
      return { ok: false, error: "Could not create anonymous session." }
    }
  }
  const { data: userRes2 } = await supabase.auth.getUser()
  const user = userRes2!.user!
  const uid = user.id

  const player_name = (input.playerName ?? `Guest-${uid.slice(0, 6)}`).trim().slice(0, 32)
  const score = Math.floor(input.score)
  const best_word = (input.bestWord ?? "").toUpperCase()
  const best_word_score = Math.floor(input.bestWordScore)
  const duration_seconds = Math.floor(input.durationSeconds)

  const is_anonymous =
    (user as any)?.is_anonymous ||
    user.app_metadata?.provider === "anon" ||
    (Array.isArray(user.identities) &&
      user.identities.length > 0 &&
      user.identities.every((i: any) => i?.provider === "anonymous"))

  let device_token_hash: string | null = null
  try {
    const token = getOrCreateDeviceToken()
    device_token_hash = await sha256Hex(token)
  } catch {
    device_token_hash = null
  }

  const { error } = await supabase.from("leaderboard_entries").insert({
    game_id: input.gameId,
    user_id: uid,
    player_name,
    score,
    best_word,
    best_word_score,
    game_mode: input.gameMode,
    duration_seconds,
    is_anonymous,
    device_token_hash,
  })

  if (error) {
    const msg = String(error.message || "").toLowerCase()
    const dup =
      msg.includes("duplicate key") ||
      msg.includes("unique constraint") ||
      msg.includes("already exists")

    return { ok: false, error: dup ? "You've already submitted your score!" : error.message }
  }

  return { ok: true }
}
