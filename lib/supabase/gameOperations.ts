import { supabase } from "./supabase"
import {
  Game,
  GamePlayer,
  StartGameResult,
  SubmitWordResult,
  Team,
} from "@/app/types/types"

/**
 * Start a game (host only)
 * Sets the game status to 'in_progress' with server timestamp
 */
export async function startGame(gameId: string): Promise<StartGameResult> {
  try {
    const { data, error } = await supabase.rpc("start_game", {
      p_game_id: gameId,
    })

    if (error) {
      console.error("Start game error:", error)
      return { ok: false, error: error.message || "Failed to start game" }
    }

    if (!data || data.length === 0) {
      return { ok: false, error: "Failed to start game - no response" }
    }

    const result = data[0]

    if (!result.success) {
      return { ok: false, error: result.error_message || "Failed to start game" }
    }

    return {
      ok: true,
      startedAt: result.started_at,
    }
  } catch (err) {
    console.error("Start game exception:", err)
    return { ok: false, error: "An unexpected error occurred" }
  }
}

/**
 * End a game (called when timer expires)
 */
export async function endGame(gameId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc("end_game", {
      p_game_id: gameId,
    })

    if (error) {
      return { ok: false, error: error.message }
    }

    return { ok: data === true }
  } catch (err) {
    return { ok: false, error: "An unexpected error occurred" }
  }
}

/**
 * Submit a word during gameplay
 */
export async function submitWord(
  gameId: string,
  word: string,
  score: number,
  roundIndex: number
): Promise<SubmitWordResult> {
  try {
    const { data, error } = await supabase.rpc("submit_word", {
      p_game_id: gameId,
      p_word: word.toUpperCase(),
      p_score: Math.floor(score),
      p_round_index: roundIndex,
    })

    if (error) {
      console.error("Submit word error:", error)
      return { ok: false, error: error.message || "Failed to submit word" }
    }

    if (!data || data.length === 0) {
      return { ok: false, error: "Failed to submit word - no response" }
    }

    const result = data[0]

    if (!result.success) {
      return { ok: false, error: result.error_message || "Failed to submit word" }
    }

    return {
      ok: true,
      submissionId: result.submission_id,
      newTotalScore: result.new_total_score,
    }
  } catch (err) {
    console.error("Submit word exception:", err)
    return { ok: false, error: "An unexpected error occurred" }
  }
}

/**
 * Update a player's team
 */
export async function updatePlayerTeam(
  playerId: string,
  team: Team
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("game_players")
    .update({ team })
    .eq("id", playerId)

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

/**
 * Update game settings (host only, lobby only)
 */
export async function updateGameSettings(
  gameId: string,
  settings: { duration_seconds?: number; max_players?: number }
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("games")
    .update(settings)
    .eq("id", gameId)

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

/**
 * Subscribe to game changes
 */
export function subscribeToGame(
  gameId: string,
  onGameChange: (game: Game) => void
) {
  return supabase
    .channel(`game:${gameId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "games",
        filter: `id=eq.${gameId}`,
      },
      (payload) => {
        if (payload.new) {
          onGameChange(payload.new as Game)
        }
      }
    )
    .subscribe()
}

/**
 * Subscribe to player changes in a game
 */
export function subscribeToPlayers(
  gameId: string,
  onPlayerChange: (
    eventType: "INSERT" | "UPDATE" | "DELETE",
    player: GamePlayer | null,
    oldPlayer: GamePlayer | null
  ) => void
) {
  return supabase
    .channel(`game_players:${gameId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "game_players",
        filter: `game_id=eq.${gameId}`,
      },
      (payload) => {
        onPlayerChange(
          payload.eventType as "INSERT" | "UPDATE" | "DELETE",
          payload.new as GamePlayer | null,
          payload.old as GamePlayer | null
        )
      }
    )
    .subscribe()
}

/**
 * Subscribe to both game and player changes
 * Returns a cleanup function
 */
export function subscribeToGameRoom(
  gameId: string,
  callbacks: {
    onGameChange: (game: Game) => void
    onPlayerJoin: (player: GamePlayer) => void
    onPlayerUpdate: (player: GamePlayer) => void
    onPlayerLeave: (playerId: string) => void
  }
) {
  const channel = supabase.channel(`room:${gameId}`)

  channel
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "games",
        filter: `id=eq.${gameId}`,
      },
      (payload) => {
        if (payload.new) {
          callbacks.onGameChange(payload.new as Game)
        }
      }
    )
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "game_players",
        filter: `game_id=eq.${gameId}`,
      },
      (payload) => {
        callbacks.onPlayerJoin(payload.new as GamePlayer)
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "game_players",
        filter: `game_id=eq.${gameId}`,
      },
      (payload) => {
        callbacks.onPlayerUpdate(payload.new as GamePlayer)
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "game_players",
        filter: `game_id=eq.${gameId}`,
      },
      (payload) => {
        if (payload.old) {
          callbacks.onPlayerLeave((payload.old as GamePlayer).id)
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Get team scores from players
 */
export function calculateTeamScores(players: GamePlayer[]): {
  teamA: number
  teamB: number
} {
  return players.reduce(
    (acc, player) => {
      if (player.team === "A") {
        acc.teamA += player.score
      } else {
        acc.teamB += player.score
      }
      return acc
    },
    { teamA: 0, teamB: 0 }
  )
}

/**
 * Get current server time (for timer sync)
 */
export async function getServerTime(): Promise<Date> {
  const { data, error } = await supabase.rpc("now")
  
  if (error || !data) {
    // Fallback to client time
    return new Date()
  }
  
  return new Date(data)
}
