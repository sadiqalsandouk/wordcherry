"use client"

import { useEffect, useState } from "react"
import { getLeaderboard } from "@/lib/supabase/getLeaderboard"
import { LeaderboardEntry } from "@/app/types/types"
import Title from "../components/Title"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      setError(null)

      const result = await getLeaderboard(10)

      if (result.ok) {
        setLeaderboard(result.data)
      } else {
        setError(result.error)
      }

      setLoading(false)
    }

    fetchLeaderboard()
  }, [])

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
      <div className="min-h-screen flex items-center justify-center">
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
        <div className="pt-2 md:pt-8 pb-2 md:pb-6 mb-2 md:mb-4">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl md:text-6xl mr-2 md:mr-3">🍒</span>
            <h1
              className={`text-wordcherryYellow text-center text-3xl md:text-6xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] leading-tight`}
            >
              WORDCHERRY.COM
            </h1>
          </div>
          <p className="text-white text-center opacity-80 text-sm md:text-lg mt-2">
            WordCherry Hall of Fame
          </p>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <p className="text-wordcherryYellow/80 text-lg mb-4">
              No scores yet! Be the first to make it to the leaderboard.
            </p>
          </div>
        )}

        {leaderboard.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-wordcherryYellow text-wordcherryBlue">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Rank</th>
                    <th className="px-6 py-4 text-left font-bold">Player</th>
                    <th className="px-6 py-4 text-right font-bold">Score</th>
                    <th className="px-6 py-4 text-center font-bold">Best Word</th>
                    <th className="px-6 py-4 text-right font-bold">Top Score</th>
                    <th className="px-6 py-4 text-center font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index < 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-lg font-bold">{getRankEmoji(index)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-900">{entry.player_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-2xl font-bold text-wordcherryBlue">
                          {entry.score.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {entry.best_word && (
                          <span className="font-mono text-lg font-bold text-gray-800 uppercase tracking-wider">
                            {entry.best_word}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {entry.best_word_score > 0 && (
                          <span className="text-lg font-semibold text-green-600">
                            +{entry.best_word_score.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {formatDate(entry.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
