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
      return { ok: false, error: "Invalid word" }
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
 * Update a player's ready status
 */
export async function updatePlayerReady(
  playerId: string,
  isReady: boolean
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("game_players")
    .update({ is_ready: isReady })
    .eq("id", playerId)

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

/**
 * Update a player's heartbeat timestamp
 */
export async function updatePlayerHeartbeat(
  playerId: string
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("game_players")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", playerId)

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

/**
 * Remove stale players from a lobby (server-side cleanup)
 */
export async function cleanupStalePlayers(
  gameId: string,
  cutoffSeconds = 60
): Promise<{ ok: boolean; removed?: number; error?: string }> {
  try {
    const { data, error } = await supabase.rpc("cleanup_stale_players", {
      p_game_id: gameId,
      p_cutoff_seconds: cutoffSeconds,
    })

    if (error) {
      return { ok: false, error: error.message }
    }

    return { ok: true, removed: typeof data === "number" ? data : undefined }
  } catch (err) {
    return { ok: false, error: "An unexpected error occurred" }
  }
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

/**
 * Reset game to lobby state (keeps players and teams, resets scores)
 * Only the host can call this
 */
export async function resetGameToLobby(gameId: string): Promise<{ ok: boolean; game?: Game; newSeed?: string; error?: string }> {
  try {
    // Call the RPC function (SECURITY DEFINER, checks host permission)
    const { data, error } = await supabase.rpc("reset_game_to_lobby", {
      p_game_id: gameId,
    })

    if (error) {
      console.error("Reset game RPC error:", error)
      return { ok: false, error: error.message }
    }

    if (!data || data.length === 0) {
      return { ok: false, error: "No response from server" }
    }

    const result = data[0]
    
    if (!result.success) {
      return { ok: false, error: result.error_message || "Failed to reset game" }
    }

    // Refresh every player's last_seen_at to NOW so the new lobby doesn't
    // immediately prune them. During a game no heartbeats are sent (heartbeats
    // only run inside Lobby.tsx), so by the time the game ends all players have
    // a stale last_seen_at. Without this refresh, cleanupStalePlayers runs the
    // moment the Lobby mounts and deletes everyone before heartbeats can fire.
    await supabase
      .from("game_players")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("game_id", gameId)
    // (error intentionally ignored — best-effort; cleanup will re-sync anyway)

    // Fetch the updated game
    const { data: gameData, error: fetchError } = await supabase
      .from("games")
      .select()
      .eq("id", gameId)
      .single()

    if (fetchError) {
      return { ok: false, error: fetchError.message }
    }

    return { ok: true, game: gameData as Game, newSeed: result.new_seed }
  } catch (err) {
    console.error("Reset game exception:", err)
    return { ok: false, error: "An unexpected error occurred" }
  }
}

/**
 * Play again with same settings (resets scores and starts immediately)
 */
export async function playAgain(gameId: string): Promise<{ ok: boolean; game?: Game; startedAt?: string; error?: string }> {
  try {
    // First reset the game
    const resetResult = await resetGameToLobby(gameId)
    if (!resetResult.ok) {
      return resetResult
    }

    // Then start it immediately
    const startResult = await startGame(gameId)
    if (!startResult.ok) {
      return { ok: false, error: startResult.error }
    }

    // Fetch the updated game
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select()
      .eq("id", gameId)
      .single()

    if (gameError) {
      return { ok: false, error: gameError.message }
    }

    return { ok: true, game: gameData as Game, startedAt: startResult.startedAt }
  } catch (err) {
    console.error("Play again exception:", err)
    return { ok: false, error: "An unexpected error occurred" }
  }
}
