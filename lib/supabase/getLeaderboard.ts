import type { LeaderboardResult } from "@/app/types/types"
import { supabase } from "./supabase"

export async function getLeaderboard(limit: number = 10): Promise<LeaderboardResult> {
  try {
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("id, player_name, score, best_word, best_word_score, created_at, is_anonymous")
      .order("score", { ascending: false })
      .limit(limit)

    if (error) {
      return { ok: false, error: error.message }
    }

    return { ok: true, data: data || [] }
  } catch (_) {
    return { ok: false, error: "Failed to fetch leaderboard data" }
  }
}

export async function getTopScores(limit: number = 3): Promise<LeaderboardResult> {
  return getLeaderboard(limit)
}
