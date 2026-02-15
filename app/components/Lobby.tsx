"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Game, GamePlayer, Team } from "@/app/types/types"
import { supabase } from "@/lib/supabase/supabase"
import {
  startGame,
  updatePlayerTeam,
  updateGameSettings,
  updatePlayerReady,
  updatePlayerHeartbeat,
  cleanupStalePlayers,
} from "@/lib/supabase/gameOperations"
import { leaveGame } from "@/lib/supabase/joinGame"
import PlayerList from "./PlayerList"
import { Copy, Check, Play, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { sfx } from "@/app/utils/sfx"

const DURATION_OPTIONS = [
  { value: 30, label: "30s" },
  { value: 60, label: "1m" },
  { value: 90, label: "1.5m" },
  { value: 120, label: "2m" },
]

const COUNTDOWN_SECONDS = 5

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
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const [copied, setCopied] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null)
  const previousStatusRef = useRef(game.status)
  const leaveSentRef = useRef(false)
  const authTokenRef = useRef<string | null>(null)

  const isHost = currentUserId === game.host_user_id
  const currentPlayer = players.find((p) => p.user_id === currentUserId)
  const isReady = currentPlayer?.is_ready ?? false
  const staleCutoffMs = 60_000
  const [nowMs, setNowMs] = useState(Date.now())
  const activePlayers = players.filter((p) => {
    const lastSeen = p.last_seen_at ?? p.joined_at
    const lastSeenMs = Date.parse(lastSeen)
    if (Number.isNaN(lastSeenMs)) return true
    return nowMs - lastSeenMs <= staleCutoffMs
  })
  const teamACount = activePlayers.filter((p) => p.team === "A").length
  const teamBCount = activePlayers.filter((p) => p.team === "B").length
  const readyCount = activePlayers.filter((p) => p.is_ready).length
  const allReady = activePlayers.length > 0 && readyCount === activePlayers.length
  const canStart =
    activePlayers.length >= 2 && teamACount >= 1 && teamBCount >= 1 && allReady

  const beginCountdown = useCallback((startAtMs: number) => {
    const tick = () => {
      const remainingMs = startAtMs - Date.now()
      const remaining = Math.max(0, Math.ceil(remainingMs / 1000))
      setCountdownSeconds(remaining)
      if (remaining <= 0) {
        setCountdownSeconds(null)
      }
    }

    tick()
    const interval = setInterval(tick, 250)
    return () => clearInterval(interval)
  }, [])

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase.channel(`lobby:${game.id}`)
    channelRef.current = channel

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
        "broadcast",
        { event: "countdown" },
        ({ payload }) => {
          const startAtMs = Number(payload?.startAtMs)
          if (Number.isFinite(startAtMs)) {
            beginCountdown(startAtMs)
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
          sfx.join()
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
          sfx.leave()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [game.id, onGameStart, beginCountdown])

  useEffect(() => {
    if (previousStatusRef.current !== "in_progress" && game.status === "in_progress") {
      sfx.start()
    }
    previousStatusRef.current = game.status
  }, [game.status])

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

  useEffect(() => {
    if (!currentPlayer) return

    let mounted = true

    const sendHeartbeat = async () => {
      if (!mounted) return
      await updatePlayerHeartbeat(currentPlayer.id)
    }

    sendHeartbeat()
    const interval = setInterval(sendHeartbeat, 10_000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [currentPlayer])

  useEffect(() => {
    let mounted = true

    const primeToken = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      authTokenRef.current = data.session?.access_token ?? null
    }

    void primeToken()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      authTokenRef.current = session?.access_token ?? null
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const runCleanup = async () => {
      if (!mounted) return
      await cleanupStalePlayers(game.id, 60)
    }

    runCleanup()
    const interval = setInterval(runCleanup, 15_000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [game.id])

  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(Date.now())
    }, 5_000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleStartGame = useCallback(async () => {
    if (!canStart || isStarting) return

    setIsStarting(true)
    const startAtMs = Date.now() + COUNTDOWN_SECONDS * 1000
    beginCountdown(startAtMs)
    if (channelRef.current) {
      void channelRef.current.send({
        type: "broadcast",
        event: "countdown",
        payload: { startAtMs },
      })
    }

    await new Promise((resolve) => setTimeout(resolve, COUNTDOWN_SECONDS * 1000))
    const result = await startGame(game.id)

    if (result.ok) {
      // The realtime subscription will handle the state update
    } else {
      toast.error(result.error || "Failed to start game")
      setIsStarting(false)
    }
  }, [game.id, canStart, isStarting, beginCountdown])

  const handleLeaveGame = useCallback(async () => {
    const result = await leaveGame(game.id)
    if (result.ok) {
      router.push("/")
    } else {
      toast.error(result.error || "Failed to leave game")
    }
  }, [game.id, router])

  useEffect(() => {
    const sendInstantLeave = () => {
      if (leaveSentRef.current) return
      leaveSentRef.current = true

      const token = authTokenRef.current
      if (!token) {
        void leaveGame(game.id)
        return
      }

      const payload = JSON.stringify({ gameId: game.id, token })
      const beacon = typeof navigator.sendBeacon === "function"
        ? navigator.sendBeacon("/api/leave-lobby", new Blob([payload], { type: "application/json" }))
        : false

      if (!beacon) {
        void fetch("/api/leave-lobby", {
          method: "POST",
          keepalive: true,
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        })
      }
    }

    const handlePageHide = () => {
      sendInstantLeave()
    }

    const handleBeforeUnload = () => {
      sendInstantLeave()
    }

    window.addEventListener("pagehide", handlePageHide)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("pagehide", handlePageHide)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [game.id])

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
            players={activePlayers}
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
              Ready up: {readyCount}/{activePlayers.length}
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
      {countdownSeconds !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
          <div className="rounded-2xl bg-white px-8 py-6 shadow-xl text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">Starting</div>
            <div className="text-5xl font-black text-wordcherryBlue">
              {countdownSeconds}
            </div>
            <div className="text-xs text-gray-500 mt-2">Get ready</div>
          </div>
        </div>
      )}
    </div>
  )
}
