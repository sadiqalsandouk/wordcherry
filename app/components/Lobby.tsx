"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Game, GamePlayer, Team } from "@/app/types/types"
import { supabase } from "@/lib/supabase/supabase"
import {
  startGame,
  updatePlayerTeam,
  updateGameSettings,
  updatePlayerReady,
} from "@/lib/supabase/gameOperations"
import { leaveGame } from "@/lib/supabase/joinGame"
import PlayerList from "./PlayerList"
import { Copy, Check, Play, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

const DURATION_OPTIONS = [
  { value: 30, label: "30s" },
  { value: 60, label: "1m" },
  { value: 90, label: "1.5m" },
  { value: 120, label: "2m" },
]

type LobbyProps = {
  game: Game
  players: GamePlayer[]
  currentUserId: string
  onGameStart: (game: Game) => void
}

export default function Lobby({
  game: initialGame,
  players: initialPlayers,
  currentUserId,
  onGameStart,
}: LobbyProps) {
  const router = useRouter()
  const [game, setGame] = useState<Game>(initialGame)
  const [players, setPlayers] = useState<GamePlayer[]>(initialPlayers)
  const [copied, setCopied] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const isHost = currentUserId === game.host_user_id
  const teamACount = players.filter((p) => p.team === "A").length
  const teamBCount = players.filter((p) => p.team === "B").length
  const readyCount = players.filter((p) => p.is_ready).length
  const allReady = players.length > 0 && readyCount === players.length
  const canStart = players.length >= 2 && teamACount >= 1 && teamBCount >= 1 && allReady
  const currentPlayer = players.find((p) => p.user_id === currentUserId)
  const isReady = currentPlayer?.is_ready ?? false

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase.channel(`lobby:${game.id}`)

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "games",
          filter: `id=eq.${game.id}`,
        },
        (payload) => {
          if (payload.new) {
            const updatedGame = payload.new as Game
            setGame(updatedGame)
            
            if (updatedGame.status === "in_progress" && updatedGame.started_at) {
              onGameStart(updatedGame)
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "game_players",
          filter: `game_id=eq.${game.id}`,
        },
        (payload) => {
          const newPlayer = payload.new as GamePlayer
          setPlayers((prev) => {
            if (prev.some((p) => p.id === newPlayer.id)) return prev
            return [...prev, newPlayer]
          })
          toast.success(`${newPlayer.player_name} joined!`)
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_players",
          filter: `game_id=eq.${game.id}`,
        },
        (payload) => {
          const updatedPlayer = payload.new as GamePlayer
          setPlayers((prev) =>
            prev.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
          )
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "game_players",
          filter: `game_id=eq.${game.id}`,
        },
        (payload) => {
          const oldPlayer = payload.old as GamePlayer
          setPlayers((prev) => prev.filter((p) => p.id !== oldPlayer.id))
          toast.info(`${oldPlayer.player_name} left`)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [game.id, onGameStart])

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(game.join_code)
      setCopied(true)
      toast.success("Code copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }, [game.join_code])

  const handleTeamChange = useCallback(async (playerId: string, newTeam: Team) => {
    const result = await updatePlayerTeam(playerId, newTeam)
    if (!result.ok) {
      toast.error(result.error || "Failed to change team")
    }
  }, [])

  const handleReadyToggle = useCallback(async () => {
    if (!currentPlayer) return

    const nextReady = !(currentPlayer.is_ready ?? false)
    const result = await updatePlayerReady(currentPlayer.id, nextReady)
    if (!result.ok) {
      toast.error(result.error || "Failed to update ready status")
    }
  }, [currentPlayer])

  const handleStartGame = useCallback(async () => {
    if (!canStart || isStarting) return

    setIsStarting(true)
    const result = await startGame(game.id)

    if (result.ok) {
      // The realtime subscription will handle the state update
    } else {
      toast.error(result.error || "Failed to start game")
      setIsStarting(false)
    }
  }, [game.id, canStart, isStarting])

  const handleLeaveGame = useCallback(async () => {
    const result = await leaveGame(game.id)
    if (result.ok) {
      router.push("/")
    } else {
      toast.error(result.error || "Failed to leave game")
    }
  }, [game.id, router])

  const handleDurationChange = useCallback(async (newDuration: number) => {
    setGame((prev) => ({ ...prev, duration_seconds: newDuration }))
    
    const result = await updateGameSettings(game.id, {
      duration_seconds: newDuration,
    })
    if (!result.ok) {
      setGame((prev) => ({ ...prev, duration_seconds: game.duration_seconds }))
      toast.error(result.error || "Failed to update duration")
    }
  }, [game.id, game.duration_seconds])

  return (
    <div className="py-8 w-full px-4 sm:px-0">
      {/* Back button */}
      <button
        onClick={handleLeaveGame}
        className="cursor-pointer flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Leave lobby</span>
      </button>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Join code section */}
        <div className="p-6 md:p-8 pb-4 md:pb-6 text-center border-b border-gray-100">
          <p className="text-xs md:text-sm uppercase tracking-wider text-gray-400 mb-3 md:mb-4">Invite Code</p>
          <button
            onClick={handleCopyCode}
            className="cursor-pointer group relative"
          >
            <div className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.2em] text-gray-800 group-hover:text-wordcherryBlue transition-colors">
              {game.join_code}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2 md:mt-3 text-xs md:text-sm text-gray-400 group-hover:text-wordcherryBlue transition-colors">
              {copied ? (
                <>
                  <Check className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Click to copy</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Duration selector */}
        <div className="px-6 md:px-8 py-4 md:py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base text-gray-500">Duration</span>
            <div className="flex gap-1 md:gap-2">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => isHost && handleDurationChange(option.value)}
                  disabled={!isHost}
                  className={`cursor-pointer px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-semibold transition-all ${
                    game.duration_seconds === option.value
                      ? "bg-wordcherryBlue text-white"
                      : isHost 
                        ? "text-gray-500 hover:bg-gray-100"
                        : "text-gray-400"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Players section */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <span className="text-sm md:text-base font-semibold text-gray-700">Teams</span>
            <span className="text-xs md:text-sm text-gray-400">{players.length} players</span>
          </div>
          
          <PlayerList
            players={players}
            currentUserId={currentUserId}
            hostUserId={game.host_user_id}
            onTeamChange={handleTeamChange}
            isHost={isHost}
            gameStatus={game.status}
          />
        </div>

        {/* Start button */}
        <div className="p-4 md:p-6 pt-0">
          <div className="mb-4 md:mb-5 flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm md:text-base text-gray-600">
            <span className="font-semibold">
              Ready up: {readyCount}/{players.length}
            </span>
            <button
              onClick={handleReadyToggle}
              disabled={!currentPlayer}
              className={`cursor-pointer rounded-lg px-4 py-1.5 text-sm md:text-base font-semibold transition-colors ${
                isReady
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              } ${!currentPlayer ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {isReady ? "Ready" : "Not ready"}
            </button>
          </div>
          {isHost ? (
            <button
              onClick={handleStartGame}
              disabled={!canStart || isStarting}
              className={`cursor-pointer w-full py-4 md:py-5 rounded-xl text-lg md:text-xl font-bold flex items-center justify-center gap-2 transition-all ${
                canStart && !isStarting
                  ? "bg-gradient-to-r from-wordcherryBlue to-cyan-500 text-white shadow-lg shadow-wordcherryBlue/30 hover:shadow-xl hover:shadow-wordcherryBlue/40 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Play className="w-5 h-5 md:w-6 md:h-6" />
              {isStarting 
                ? "Starting..." 
                : canStart 
                  ? "Start Game" 
                  : teamACount === 0 || teamBCount === 0
                    ? "Both teams need players"
                    : !allReady
                      ? "Waiting for ready"
                      : "Need 2+ players"}
            </button>
          ) : (
            <div className="w-full py-4 md:py-5 rounded-xl font-medium text-center text-base md:text-lg bg-gray-100 text-gray-500">
              Waiting for host to start...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
