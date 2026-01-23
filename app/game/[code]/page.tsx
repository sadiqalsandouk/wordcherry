"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import { Game, GamePlayer } from "@/app/types/types"
import { supabase } from "@/lib/supabase/supabase"
import { getFullGameState } from "@/lib/supabase/createGame"
import { joinGame } from "@/lib/supabase/joinGame"
import { usePlayerName } from "@/app/components/AuthProvider"
import Lobby from "@/app/components/Lobby"
import MultiplayerGame from "@/app/components/MultiplayerGame"
import { Loader2 } from "lucide-react"
import Link from "next/link"

type PageState =
  | { status: "loading" }
  | { status: "joining" }
  | { status: "error"; message: string }
  | { status: "not_found" }
  | { status: "game_started" }
  | { status: "lobby"; game: Game; players: GamePlayer[]; userId: string }
  | { status: "in_progress"; game: Game; players: GamePlayer[]; userId: string; startedAt: string }
  | { status: "finished"; game: Game; players: GamePlayer[]; userId: string }

export default function GamePage() {
  const params = useParams()
  const code = (params.code as string).toUpperCase()
  const { playerName, isLoading: playerNameLoading } = usePlayerName()
  
  const [state, setState] = useState<PageState>({ status: "loading" })
  const hasAttemptedJoin = useRef(false)

  const loadGame = useCallback(async (attemptAutoJoin: boolean = false) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Try anonymous sign in
        const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously()
        if (anonError || !anonData.user) {
          setState({ status: "error", message: "Failed to authenticate" })
          return
        }
      }

      // Get fresh user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        setState({ status: "error", message: "Authentication required" })
        return
      }

      // Get game state
      const result = await getFullGameState(code)
      
      if (!result.ok) {
        if (result.error.includes("No rows")) {
          setState({ status: "not_found" })
        } else {
          setState({ status: "error", message: result.error })
        }
        return
      }

      const { game, players } = result.data

      // Check if user is in the game
      const isInGame = players.some((p) => p.user_id === currentUser.id)

      if (!isInGame) {
        // Auto-join if game is in lobby and we haven't tried yet
        if (attemptAutoJoin && game.status === "lobby" && !hasAttemptedJoin.current) {
          hasAttemptedJoin.current = true
          setState({ status: "joining" })
          
          const joinResult = await joinGame(code, playerName)
          
          if (joinResult.ok) {
            // Reload game state after joining
            await loadGame(false)
          } else {
            setState({ status: "error", message: joinResult.error || "Failed to join game" })
          }
          return
        }
        
        // Game already started, can't join
        if (game.status !== "lobby") {
          setState({ status: "game_started" })
          return
        }
        
        // Shouldn't reach here normally, but fallback to error
        setState({ status: "error", message: "Unable to join game" })
        return
      }

      // Route based on game status
      switch (game.status) {
        case "lobby":
          setState({ status: "lobby", game, players, userId: currentUser.id })
          break
        case "in_progress":
          setState({
            status: "in_progress",
            game,
            players,
            userId: currentUser.id,
            startedAt: game.started_at!,
          })
          break
        case "finished":
          setState({ status: "finished", game, players, userId: currentUser.id })
          break
      }
    } catch (err) {
      console.error("Load game error:", err)
      setState({ status: "error", message: "Failed to load game" })
    }
  }, [code, playerName])

  // Wait for player name to load before attempting to join
  useEffect(() => {
    if (!playerNameLoading) {
      loadGame(true) // Attempt auto-join on first load
    }
  }, [loadGame, playerNameLoading])

  const handleGameStart = useCallback((updatedGame: Game) => {
    setState((prev) => {
      if (prev.status === "lobby") {
        return {
          status: "in_progress",
          game: updatedGame,
          players: prev.players,
          userId: prev.userId,
          startedAt: updatedGame.started_at!,
        }
      }
      return prev
    })
  }, [])

  const handleGameEnd = useCallback(() => {
    setState((prev) => {
      if (prev.status === "in_progress") {
        return {
          status: "finished",
          game: { ...prev.game, status: "finished" },
          players: prev.players,
          userId: prev.userId,
        }
      }
      return prev
    })
  }, [])

  const handlePlayersUpdate = useCallback((newPlayers: GamePlayer[]) => {
    setState((prev) => {
      if (prev.status === "in_progress" || prev.status === "finished") {
        return { ...prev, players: newPlayers }
      }
      return prev
    })
  }, [])

  // Render based on state
  if (state.status === "loading" || state.status === "joining") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-wordcherryYellow animate-spin mb-4" />
        <p className="text-white text-lg">
          {state.status === "joining" ? "Joining game..." : "Loading game..."}
        </p>
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{state.message}</p>
          <Link
            href="/"
            className="inline-block bg-wordcherryBlue text-white px-6 py-3 rounded-xl font-bold hover:bg-wordcherryBlue/90 transition-colors cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (state.status === "not_found") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-wordcherryBlue mb-4">Game Not Found</h1>
          <p className="text-gray-600 mb-2">
            No game found with code <span className="font-mono font-bold">{code}</span>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            The game may have ended or the code may be incorrect.
          </p>
          <Link
            href="/"
            className="inline-block bg-wordcherryBlue text-white px-6 py-3 rounded-xl font-bold hover:bg-wordcherryBlue/90 transition-colors cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (state.status === "game_started") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-wordcherryBlue mb-4">Game Already Started</h1>
          <p className="text-gray-600 mb-2">
            Game <span className="font-mono font-bold">{code}</span> is already in progress.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            You can only join games that are still in the lobby.
          </p>
          <Link
            href="/"
            className="inline-block bg-wordcherryBlue text-white px-6 py-3 rounded-xl font-bold hover:bg-wordcherryBlue/90 transition-colors cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (state.status === "lobby") {
    return (
      <Lobby
        game={state.game}
        players={state.players}
        currentUserId={state.userId}
        onGameStart={handleGameStart}
      />
    )
  }

  if (state.status === "in_progress") {
    return (
      <MultiplayerGame
        game={state.game}
        players={state.players}
        currentUserId={state.userId}
        startedAt={state.startedAt}
        onGameEnd={handleGameEnd}
        onPlayersUpdate={handlePlayersUpdate}
      />
    )
  }

  if (state.status === "finished") {
    // Will be handled by MultiplayerGameEnd component
    return (
      <MultiplayerGame
        game={state.game}
        players={state.players}
        currentUserId={state.userId}
        startedAt={state.game.started_at!}
        onGameEnd={handleGameEnd}
        onPlayersUpdate={handlePlayersUpdate}
      />
    )
  }

  return null
}
