"use client"

import { Game, GamePlayer } from "@/app/types/types"
import { Trophy, Medal, Home, Users2, Crown } from "lucide-react"
import Link from "next/link"
import Confetti from "react-confetti"
import { useState, useEffect } from "react"

type MultiplayerGameEndProps = {
  game: Game
  players: GamePlayer[]
  currentUserId: string
  bestWord: { word: string; score: number }
}

export default function MultiplayerGameEnd({
  game,
  players,
  currentUserId,
  bestWord,
}: MultiplayerGameEndProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [showConfetti, setShowConfetti] = useState(false)

  // Calculate team scores
  const teamAPlayers = players.filter((p) => p.team === "A")
  const teamBPlayers = players.filter((p) => p.team === "B")
  const teamAScore = teamAPlayers.reduce((sum, p) => sum + p.score, 0)
  const teamBScore = teamBPlayers.reduce((sum, p) => sum + p.score, 0)

  // Determine winner
  const winningTeam = teamAScore > teamBScore ? "A" : teamBScore > teamAScore ? "B" : null
  const isDraw = teamAScore === teamBScore

  // Get current player
  const currentPlayer = players.find((p) => p.user_id === currentUserId)
  const isWinner = currentPlayer && currentPlayer.team === winningTeam && !isDraw

  // Sort players by score for rankings
  const rankedPlayers = [...players].sort((a, b) => b.score - a.score)

  // Get MVP (highest scorer)
  const mvp = rankedPlayers[0]

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    
    // Only show confetti if player is on the winning team (not on draw)
    if (isWinner) {
      setShowConfetti(true)
      // Keep confetti longer (10 seconds)
      const timer = setTimeout(() => setShowConfetti(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [isWinner])


  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={400}
          gravity={0.15}
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
            isDraw
              ? "bg-gray-500"
              : winningTeam === "A"
              ? "bg-blue-500"
              : "bg-red-500"
          }`}
        >
          <Trophy className="w-12 h-12 text-white mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-white">
            {isDraw ? "It's a Draw!" : `${winningTeam === "A" ? "Blue" : "Red"} Team Wins!`}
          </h1>
        </div>

        {/* Team Score Comparison */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div
              className={`text-center flex-1 p-4 rounded-xl ${
                winningTeam === "A" ? "bg-blue-100 ring-2 ring-blue-500" : "bg-blue-50"
              }`}
            >
              <p className="font-bold text-blue-700 mb-1 text-lg">Blue Team</p>
              <p className="text-3xl font-bold text-blue-600">{teamAScore}</p>
              <p className="text-sm text-blue-500">{teamAPlayers.length} players</p>
            </div>

            <div className="px-4 text-2xl font-bold text-gray-300">VS</div>

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
            {isWinner && (
              <p className="text-center text-green-600 font-bold mt-3">
                You were on the winning team!
              </p>
            )}
          </div>
        )}

        {/* MVP */}
        {mvp && (
          <div className="p-4 border-b bg-gradient-to-r from-yellow-50 to-amber-50">
            <div className="flex items-center justify-center gap-3">
              <Crown className="w-6 h-6 text-yellow-500" />
              <div>
                <span className="text-sm text-gray-500">MVP:</span>
                <span className="font-bold text-gray-700 ml-2">{mvp.player_name}</span>
                <span className="text-yellow-600 ml-2">({mvp.score} pts)</span>
              </div>
            </div>
          </div>
        )}

        {/* Player Rankings */}
        <div className="p-6 border-b max-h-60 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-700 mb-3 text-center">Rankings</h2>
          <div className="space-y-2">
            {rankedPlayers.map((player, index) => {
              const isCurrentUser = player.user_id === currentUserId
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    isCurrentUser ? "bg-wordcherryYellow/50" : "bg-[#fff7d6]/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center">
                      {index === 0 ? (
                        <Medal className="w-5 h-5 text-yellow-500" />
                      ) : index === 1 ? (
                        <Medal className="w-5 h-5 text-gray-400" />
                      ) : index === 2 ? (
                        <Medal className="w-5 h-5 text-amber-600" />
                      ) : (
                        <span className="text-sm text-gray-400">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`font-medium ${
                        player.team === "A" ? "text-blue-600" : "text-red-600"
                      }`}
                    >
                      {isCurrentUser ? "You" : player.player_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${player.team === "A" ? "text-blue-500" : "text-red-500"}`}>
                      {player.team === "A" ? "BLUE" : "RED"}
                    </span>
                    <span className="font-bold text-gray-700">{player.score}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex gap-3">
          <Link
            href="/"
            className="cursor-pointer flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            href="/"
            className="cursor-pointer flex-1 py-3 px-4 bg-wordcherryBlue text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-wordcherryBlue/90 transition-colors"
          >
            <Users2 className="w-5 h-5" />
            New Game
          </Link>
        </div>
      </div>
    </div>
  )
}
