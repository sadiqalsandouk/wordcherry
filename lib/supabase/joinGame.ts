import { supabase } from "./supabase"
import { JoinGameResult, Game, GamePlayer } from "@/app/types/types"

/**
 * Join an existing game by its join code
 * Creates an anonymous session if needed
 * 
 * @param joinCode - The 6-character join code
 * @param playerName - Display name for the player
 * @returns Result with gameId on success
 */
export async function joinGame(
  joinCode: string,
  playerName: string
): Promise<JoinGameResult> {
  try {
    // Normalize join code
    const normalizedCode = joinCode.toUpperCase().trim()
    
    if (normalizedCode.length !== 6) {
      return { ok: false, error: "Invalid game code" }
    }
    
    // Ensure we have a session
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
    
    // Call the join_game function
    const { data, error } = await supabase.rpc("join_game", {
      p_join_code: normalizedCode,
      p_user_id: currentUser.id,
      p_player_name: playerName.trim().slice(0, 32) || `Guest-${currentUser.id.slice(0, 6)}`,
    })
    
    if (error) {
      console.error("Join game error:", error)
      return { ok: false, error: error.message || "Failed to join game" }
    }
    
    if (!data || data.length === 0) {
      return { ok: false, error: "Failed to join game - no response" }
    }
    
    const result = data[0]
    
    if (!result.success) {
      return { ok: false, error: result.error_message || "Failed to join game" }
    }
    
    return {
      ok: true,
      gameId: result.game_id,
    }
  } catch (err) {
    console.error("Join game exception:", err)
    return { ok: false, error: "An unexpected error occurred" }
  }
}

/**
 * Check if a game exists and is joinable
 * Used to validate a code before showing join UI
 */
export async function checkGameJoinable(joinCode: string): Promise<{
  ok: boolean
  game?: Game
  players?: GamePlayer[]
  error?: string
}> {
  const normalizedCode = joinCode.toUpperCase().trim()
  
  if (normalizedCode.length !== 6) {
    return { ok: false, error: "Invalid game code" }
  }
  
  // Get game info
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("*")
    .eq("join_code", normalizedCode)
    .single()
    
  if (gameError || !game) {
    return { ok: false, error: "Game not found" }
  }
  
  if (game.status !== "lobby") {
    return { ok: false, error: "Game has already started" }
  }
  
  // Get current players
  const { data: players, error: playersError } = await supabase
    .from("game_players")
    .select("*")
    .eq("game_id", game.id)
    .order("joined_at", { ascending: true })
    
  if (playersError) {
    return { ok: false, error: "Failed to get player list" }
  }
  
  if (players && players.length >= game.max_players) {
    return { ok: false, error: "Game is full" }
  }
  
  return { ok: true, game, players: players || [] }
}

/**
 * Leave a game (remove self from game_players)
 * Only works while game is in lobby status
 */
export async function leaveGame(gameId: string): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { ok: false, error: "Not authenticated" }
  }
  
  const { error } = await supabase
    .from("game_players")
    .delete()
    .eq("game_id", gameId)
    .eq("user_id", user.id)
    
  if (error) {
    return { ok: false, error: error.message }
  }
  
  return { ok: true }
}

/**
 * Get the current user's player record in a game
 */
export async function getMyPlayer(gameId: string): Promise<GamePlayer | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }
  
  const { data } = await supabase
    .from("game_players")
    .select("*")
    .eq("game_id", gameId)
    .eq("user_id", user.id)
    .single()
    
  return data
}
