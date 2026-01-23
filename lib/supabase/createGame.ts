import { supabase } from "./supabase"
import { CreateGameResult, LobbySettings } from "@/app/types/types"

const DEFAULT_SETTINGS: LobbySettings = {
  durationSeconds: 60,
  maxPlayers: 8,
}

/**
 * Create a new multiplayer game
 * The current user becomes the host and is added as the first player
 * 
 * @param hostName - Display name for the host player
 * @param settings - Optional game settings (duration, max players)
 * @returns Result with gameId and joinCode on success
 */
export async function createGame(
  hostName: string,
  settings: Partial<LobbySettings> = {}
): Promise<CreateGameResult> {
  try {
    // Ensure we have a session (anonymous or authenticated)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Try to sign in anonymously
      const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously()
      if (anonError || !anonData.user) {
        return { ok: false, error: "Failed to authenticate. Please try again." }
      }
    }
    
    // Get fresh user after potential sign in
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return { ok: false, error: "Authentication required" }
    }
    
    // Merge settings with defaults
    const finalSettings = { ...DEFAULT_SETTINGS, ...settings }
    
    // Call the create_game function
    const { data, error } = await supabase.rpc("create_game", {
      p_host_user_id: currentUser.id,
      p_host_name: hostName.trim().slice(0, 32) || `Guest-${currentUser.id.slice(0, 6)}`,
      p_duration_seconds: finalSettings.durationSeconds,
      p_max_players: finalSettings.maxPlayers,
    })
    
    if (error) {
      console.error("Create game error:", error)
      return { ok: false, error: error.message || "Failed to create game" }
    }
    
    if (!data || data.length === 0) {
      return { ok: false, error: "Failed to create game - no data returned" }
    }
    
    const result = data[0]
    return {
      ok: true,
      gameId: result.game_id,
      joinCode: result.join_code,
    }
  } catch (err) {
    console.error("Create game exception:", err)
    return { ok: false, error: "An unexpected error occurred" }
  }
}

/**
 * Get a game by its join code
 * Used to display game info before joining
 */
export async function getGameByCode(joinCode: string) {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("join_code", joinCode.toUpperCase())
    .single()
    
  if (error) {
    return { ok: false as const, error: error.message }
  }
  
  return { ok: true as const, data }
}

/**
 * Get all players in a game
 */
export async function getGamePlayers(gameId: string) {
  const { data, error } = await supabase
    .from("game_players")
    .select("*")
    .eq("game_id", gameId)
    .order("joined_at", { ascending: true })
    
  if (error) {
    return { ok: false as const, error: error.message }
  }
  
  return { ok: true as const, data }
}

/**
 * Get full game state (game + players)
 */
export async function getFullGameState(joinCode: string) {
  // Get game
  const gameResult = await getGameByCode(joinCode)
  if (!gameResult.ok) {
    return { ok: false as const, error: gameResult.error }
  }
  
  // Get players
  const playersResult = await getGamePlayers(gameResult.data.id)
  if (!playersResult.ok) {
    return { ok: false as const, error: playersResult.error }
  }
  
  return {
    ok: true as const,
    data: {
      game: gameResult.data,
      players: playersResult.data,
    }
  }
}
