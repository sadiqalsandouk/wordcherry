"use client"

import { useEffect, useState } from "react"
import { getLeaderboard } from "@/lib/supabase/getLeaderboard"
import { LeaderboardEntry, LeaderboardMode } from "@/app/types/types"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [mode, setMode] = useState<LeaderboardMode>("solo")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      setError(null)

      const result = await getLeaderboard(10, mode)

      if (result.ok) {
        setLeaderboard(result.data)
      } else {
        setError(result.error)
      }

      setLoading(false)
    }

    void fetchLeaderboard()
  }, [mode])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0:
        return "🥇"
      case 1:
        return "🥈"
      case 2:
        return "🥉"
      default:
        return `${index + 1}.`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin text-5xl ">🍒</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-black text-lg mb-4">🍒 Error 404! {error} 🍒</p>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer w-full bg-wordcherryYellow text-black font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryYellow/90 hover:scale-103 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-wordcherryBlue active:scale-95 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex rounded-xl bg-white/15 p-1 shadow-inner">
            <button
              onClick={() => setMode("solo")}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                mode === "solo"
                  ? "bg-wordcherryYellow text-wordcherryBlue"
                  : "text-white hover:bg-white/15"
              }`}
            >
              Solo
            </button>
            <button
              onClick={() => setMode("multiplayer")}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                mode === "multiplayer"
                  ? "bg-wordcherryYellow text-wordcherryBlue"
                  : "text-white hover:bg-white/15"
              }`}
            >
              Multiplayer
            </button>
          </div>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <p className="text-wordcherryYellow/80 text-lg mb-4">
              No {mode === "solo" ? "solo" : "multiplayer"} scores yet. Be the first.
            </p>
          </div>
        )}

        {leaderboard.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-wordcherryYellow text-wordcherryBlue px-6 py-4">
              <h3 className="font-bold text-center text-xl">
                Top 10 {mode === "solo" ? "Solo" : "Multiplayer"} Scores
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`px-6 py-5 transition-all ${
                    index < 3
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-50/60 hover:to-orange-50/60"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold">{getRankEmoji(index)}</span>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">
                          {entry.player_name}
                        </div>
                        {entry.is_anonymous && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            Guest
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-wordcherryBlue">
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">points</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {entry.best_word && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Best Word</div>
                          <div className="font-mono text-lg font-bold text-gray-800 uppercase tracking-wider">
                            {entry.best_word}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {entry.best_word_score > 0 && (
                        <div className="text-lg font-semibold text-green-600">
                          +{entry.best_word_score.toLocaleString()}
                        </div>
                      )}
                      {entry.game_mode === "multiplayer" && (
                        <div className="text-xs font-semibold text-wordcherryBlue">
                          {entry.duration_seconds}s match
                        </div>
                      )}
                      <div className="text-sm text-gray-600">{formatDate(entry.created_at)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => (window.location.href = "/")}
            className="cursor-pointer w-full bg-wordcherryYellow text-wordcherryBlue font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryYellow/90 hover:scale-103 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-wordcherryYellow active:scale-95 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
