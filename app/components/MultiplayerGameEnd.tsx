"use client"

import { Game, GamePlayer } from "@/app/types/types"
import { Trophy, Home, RotateCcw, Crown } from "lucide-react"
import Link from "next/link"
import Confetti from "react-confetti"
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase/supabase"

type MultiplayerGameEndProps = {
  game: Game
  players: GamePlayer[]
  currentUserId: string
  bestWord: { word: string; score: number }
  onBackToLobby: () => void
  onPlayAgain: () => void
  isLoading?: boolean
  isHost?: boolean
}

function RankBadge({ index }: { index: number }) {
  if (index === 0)
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 shadow-sm">
        <Crown className="w-4 h-4 text-white" />
      </span>
    )
  if (index === 1)
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-300 text-gray-700 text-xs font-bold shadow-sm">
        2
      </span>
    )
  if (index === 2)
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600 text-white text-xs font-bold shadow-sm">
        3
      </span>
    )
  return (
    <span className="flex items-center justify-center w-7 h-7 text-sm font-bold text-gray-400">
      {index + 1}
    </span>
  )
}

export default function MultiplayerGameEnd({
  game,
  players,
  currentUserId,
  bestWord,
  onBackToLobby,
  isLoading = false,
  isHost = false,
}: MultiplayerGameEndProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const didSubmitScore = useRef(false)

  const teamAPlayers = players.filter((p) => p.team === "A")
  const teamBPlayers = players.filter((p) => p.team === "B")
  const teamAScore = teamAPlayers.reduce((sum, p) => sum + p.score, 0)
  const teamBScore = teamBPlayers.reduce((sum, p) => sum + p.score, 0)

  const winningTeam = teamAScore > teamBScore ? "A" : teamBScore > teamAScore ? "B" : null
  const isDraw = teamAScore === teamBScore

  const currentPlayer = players.find((p) => p.user_id === currentUserId)
  const isWinner = currentPlayer && currentPlayer.team === winningTeam && !isDraw

  const rankedPlayers = [...players].sort((a, b) => b.score - a.score)
  const topScore = rankedPlayers[0]?.score || 1

  useEffect(() => {
    if (currentPlayer && !didSubmitScore.current && currentPlayer.score > 0) {
      const submitLockKey = `wordcherry:mp-submitted:${game.id}:${currentUserId}`
      if (typeof window !== "undefined" && window.sessionStorage.getItem(submitLockKey) === "1") {
        didSubmitScore.current = true
        return
      }

      didSubmitScore.current = true
      const submit = async () => {
        const { data } = await supabase.auth.getSession()
        const token = data.session?.access_token
        if (!token) return

        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(submitLockKey, "1")
        }

        const res = await fetch("/api/leaderboard/submit-multiplayer", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gameId: game.id }),
        })

        if (!res.ok && res.status !== 409) {
          const body = await res.json().catch(() => ({ error: "Unknown error" }))
          console.error("Failed to submit multiplayer leaderboard score:", body.error)
          if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(submitLockKey)
          }
          didSubmitScore.current = false
        }
      }

      void submit()
    }
  }, [currentPlayer, game.id, currentUserId])

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    if (isWinner) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [isWinner])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          initialVelocityY={20}
          colors={
            winningTeam === "A"
              ? ["#3b82f6", "#60a5fa", "#93c5fd", "#fbbf24", "#ffffff"]
              : ["#ef4444", "#f87171", "#fca5a5", "#fbbf24", "#ffffff"]
          }
        />
      )}

      <div className="bg-[#fff7d6] rounded-2xl shadow-xl overflow-hidden w-full max-w-lg">
        {/* Header */}
        <div
          className={`py-6 px-4 text-center ${
            isDraw ? "bg-gray-500" : winningTeam === "A" ? "bg-blue-500" : "bg-red-500"
          }`}
        >
          <Trophy className="w-12 h-12 text-white mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-white">
            {isDraw ? "It's a Draw!" : `${winningTeam === "A" ? "Blue" : "Red"} Team Wins!`}
          </h1>
        </div>

        {/* Team Score Comparison */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center gap-3">
            <div
              className={`text-center flex-1 p-4 rounded-xl ${
                winningTeam === "A" ? "bg-blue-100 ring-2 ring-blue-500" : "bg-blue-50"
              }`}
            >
              <p className="font-bold text-blue-700 mb-1 text-lg">Blue Team</p>
              <p className="text-3xl font-bold text-blue-600">{teamAScore}</p>
              <p className="text-sm text-blue-500">{teamAPlayers.length} players</p>
            </div>
            <div className="text-2xl font-bold text-gray-300">VS</div>
            <div
              className={`text-center flex-1 p-4 rounded-xl ${
                winningTeam === "B" ? "bg-red-100 ring-2 ring-red-500" : "bg-red-50"
              }`}
            >
              <p className="font-bold text-red-700 mb-1 text-lg">Red Team</p>
              <p className="text-3xl font-bold text-red-600">{teamBScore}</p>
              <p className="text-sm text-red-500">{teamBPlayers.length} players</p>
            </div>
          </div>
        </div>

        {/* Your Stats */}
        {currentPlayer && (
          <div className="p-6 border-b bg-wordcherryYellow/10">
            <h2 className="text-lg font-bold text-gray-700 mb-3 text-center">Your Stats</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-wordcherryBlue">{currentPlayer.score}</p>
                <p className="text-xs text-gray-500">Points</p>
              </div>
              <div>
                <p className="text-lg font-bold text-wordcherryBlue uppercase">
                  {bestWord.word || "-"}
                </p>
                <p className="text-xs text-gray-500">Best Word</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-wordcherryBlue">{bestWord.score || 0}</p>
                <p className="text-xs text-gray-500">Best Score</p>
              </div>
            </div>
          </div>
        )}

        {/* Unified Leaderboard */}
        <div className="p-5 border-b">
          <h2 className="text-lg font-bold text-gray-700 mb-4 text-center tracking-wide uppercase text-sm">
            Leaderboard
          </h2>
          <div className="space-y-2">
            {rankedPlayers.map((player, index) => {
              const isCurrentUser = player.user_id === currentUserId
              const isFirst = index === 0
              const barWidth = topScore > 0 ? Math.max(4, Math.round((player.score / topScore) * 100)) : 0
              const teamColour = player.team === "A" ? "blue" : "red"

              return (
                <div
                  key={player.id}
                  className={[
                    "rounded-xl transition-all",
                    isFirst
                      ? "bg-gradient-to-r from-yellow-50 to-amber-50 ring-2 ring-yellow-300 shadow-md px-4 py-3"
                      : isCurrentUser
                      ? "bg-wordcherryYellow/40 ring-1 ring-wordcherryYellow px-3 py-2.5"
                      : "bg-white/70 px-3 py-2.5",
                  ].join(" ")}
                >
                  {/* Main row */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank */}
                    <div className="shrink-0">
                      <RankBadge index={index} />
                    </div>

                    {/* Name + "You" badge */}
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span
                        className={[
                          "font-bold truncate",
                          isFirst ? "text-base" : "text-sm",
                          teamColour === "blue" ? "text-blue-700" : "text-red-700",
                        ].join(" ")}
                      >
                        {isCurrentUser ? "You" : player.player_name}
                      </span>
                      {isCurrentUser && (
                        <span className="shrink-0 text-[10px] font-bold bg-wordcherryYellow text-wordcherryBlue px-1.5 py-0.5 rounded-full leading-none">
                          YOU
                        </span>
                      )}
                    </div>

                    {/* Team pill + score */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={[
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                          teamColour === "blue"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700",
                        ].join(" ")}
                      >
                        {teamColour === "blue" ? "BLUE" : "RED"}
                      </span>
                      <span
                        className={[
                          "font-bold tabular-nums",
                          isFirst ? "text-lg text-gray-800" : "text-sm text-gray-700",
                        ].join(" ")}
                      >
                        {player.score}
                      </span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-500",
                        isFirst
                          ? "bg-yellow-400"
                          : teamColour === "blue"
                          ? "bg-blue-400"
                          : "bg-red-400",
                      ].join(" ")}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  {/* Best word + word count row */}
                  <div className="mt-1.5 flex items-center justify-between gap-2 min-w-0">
                    {player.best_word ? (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium shrink-0">
                          Best
                        </span>
                        <span className="text-xs font-bold text-gray-700 uppercase truncate">
                          {player.best_word}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400 shrink-0">
                          +{player.best_word_score}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-300">No words scored</span>
                    )}
                    <span className="text-[10px] text-gray-400 shrink-0 tabular-nums">
                      {player.word_count} {player.word_count === 1 ? "word" : "words"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          {isHost ? (
            <>
              <button
                onClick={onBackToLobby}
                disabled={isLoading}
                className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-wordcherryBlue to-cyan-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-5 h-5" />
                {isLoading ? "Loading..." : "Play Again"}
              </button>
              <Link
                href="/"
                className="cursor-pointer w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
            </>
          ) : (
            <>
              <div className="text-center py-3 px-4 bg-gray-100 rounded-xl">
                <p className="text-gray-600 text-sm">Waiting for the host...</p>
              </div>
              <Link
                href="/"
                className="cursor-pointer w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
              >
                <Home className="w-5 h-5" />
                Leave
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
