"use client"

import { GamePlayer, Team } from "@/app/types/types"
import { Crown, ArrowLeftRight } from "lucide-react"

type PlayerListProps = {
  players: GamePlayer[]
  currentUserId: string | null
  hostUserId: string
  onTeamChange?: (playerId: string, team: Team) => void
  isHost: boolean
  gameStatus: "lobby" | "in_progress" | "finished"
}

export default function PlayerList({
  players,
  currentUserId,
  hostUserId,
  onTeamChange,
  gameStatus,
}: PlayerListProps) {
  const teamAPlayers = players.filter((p) => p.team === "A")
  const teamBPlayers = players.filter((p) => p.team === "B")
  
  const canChangeTeam = gameStatus === "lobby"
  const currentPlayer = players.find((p) => p.user_id === currentUserId)

  const renderPlayer = (player: GamePlayer) => {
    const isCurrentUser = player.user_id === currentUserId
    const isHostPlayer = player.user_id === hostUserId

    return (
      <div
        key={player.id}
        className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm md:text-base ${
          isCurrentUser
            ? "bg-wordcherryBlue/20 font-semibold border border-wordcherryBlue/30"
            : "bg-gray-200/80 border border-gray-300"
        }`}
      >
        {isHostPlayer && (
          <Crown className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 flex-shrink-0" />
        )}
        <span className={`truncate ${isCurrentUser ? "text-wordcherryBlue" : "text-gray-700"}`}>
          {isCurrentUser ? "You" : player.player_name}
        </span>
        {gameStatus !== "lobby" && (
          <span className="ml-auto font-bold text-gray-800">{player.score}</span>
        )}
      </div>
    )
  }

  const teamAScore = teamAPlayers.reduce((sum, p) => sum + p.score, 0)
  const teamBScore = teamBPlayers.reduce((sum, p) => sum + p.score, 0)

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Teams container */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {/* Blue Team */}
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-500" />
              <span className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">Blue</span>
            </div>
            {gameStatus !== "lobby" && (
              <span className="text-sm md:text-base font-bold text-blue-600">{teamAScore}</span>
            )}
          </div>
          <div className="space-y-1.5 md:space-y-2 h-[120px] md:h-[150px] overflow-y-auto">
            {teamAPlayers.length === 0 ? (
              <p className="text-xs md:text-sm text-gray-400 italic py-2">No players</p>
            ) : (
              teamAPlayers.map((p) => renderPlayer(p))
            )}
          </div>
        </div>

        {/* Red Team */}
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" />
              <span className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">Red</span>
            </div>
            {gameStatus !== "lobby" && (
              <span className="text-sm md:text-base font-bold text-red-600">{teamBScore}</span>
            )}
          </div>
          <div className="space-y-1.5 md:space-y-2 h-[120px] md:h-[150px] overflow-y-auto">
            {teamBPlayers.length === 0 ? (
              <p className="text-xs md:text-sm text-gray-400 italic py-2">No players</p>
            ) : (
              teamBPlayers.map((p) => renderPlayer(p))
            )}
          </div>
        </div>
      </div>

      {/* Switch teams button */}
      {canChangeTeam && currentPlayer && onTeamChange && (
        <button
          onClick={() => onTeamChange(currentPlayer.id, currentPlayer.team === "A" ? "B" : "A")}
          className="cursor-pointer w-full py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold text-wordcherryBlue bg-wordcherryBlue/10 border border-wordcherryBlue/30 hover:bg-wordcherryBlue/20 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5" />
          Switch Team
        </button>
      )}
    </div>
  )
}
