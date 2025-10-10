import type { SubmitScoreInput, SubmitScoreResult } from "@/app/types/types"
import { supabase } from "./supabase"

// Basic validation
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

  // Ensure we have a user
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) {
    // Try to create an anonymous user on the fly
    const { data: signInData, error: signInErr } = await supabase.auth.signInAnonymously()
    if (signInErr || !signInData?.user) {
      return { ok: false, error: "Could not create anonymous session." }
    }
  }
  const uid = (await supabase.auth.getUser()).data.user!.id

  // Normalise fields
  const player_name = (input.playerName ?? "").trim().slice(0, 32) || `Guest-${uid.slice(0, 6)}`
  const score = Math.floor(input.score)
  const best_word = (input.bestWord ?? "").toUpperCase()
  const best_word_score = Math.floor(input.bestWordScore)

  // Optional: Supabase user objects usually expose is_anonymous in user metadata
  const { data: userData } = await supabase.auth.getUser()
  const is_anonymous = (userData?.user as any)?.is_anonymous ?? true

  const { error } = await supabase.from("leaderboard_entries").insert({
    game_id: input.gameId,
    user_id: uid,
    player_name,
    score,
    best_word,
    best_word_score,
    is_anonymous,
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
