"use client"

import { useEffect, useRef, useState } from "react"
import Confetti from "react-confetti"
import { GameOverProps } from "@/app/types/types"
import { getPerformanceLevel } from "@/app/utils/performanceLevel"
import { supabase } from "@/lib/supabase/supabase"

export default function GameOver({ handleStartGame, score, bestWord, soloRunId }: GameOverProps) {
  const [submitting, setSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const performance = getPerformanceLevel(score)
  const didAutoSubmit = useRef(false)

  useEffect(() => {
    if (performance.showConfetti) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [performance.showConfetti])

  // Auto-submit score to leaderboard
  useEffect(() => {
    const threshold = 50
    if (
      score >= threshold && 
      !didAutoSubmit.current && 
      !submitting && 
      soloRunId
    ) {
      didAutoSubmit.current = true
      setSubmitting(true)

      const submit = async () => {
        try {
          const { data } = await supabase.auth.getSession()
          const token = data.session?.access_token
          if (!token) return

          const res = await fetch("/api/leaderboard/submit-solo", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ runId: soloRunId }),
          })

          if (!res.ok && res.status !== 409) {
            const body = await res.json().catch(() => ({ error: "Unknown error" }))
            console.error("Failed to submit score to leaderboard:", body.error)
          }
        } finally {
          setSubmitting(false)
        }
      }

      void submit()
    }
  }, [score, submitting, soloRunId])

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={300}
            gravity={0.5}
          />
        </div>
      )}

      <div className="text-center space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
          <div className={`${performance.bgColor} p-8 rounded-lg flex-1 max-w-lg`}>
            <div className="mb-4">
              <performance.icon
                className="mx-auto h-12 w-12 text-wordcherryBlue"
                aria-hidden="true"
              />
            </div>{" "}
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold ${performance.textColor} mb-4`}>
                {performance.title}
              </h2>

              <div className={`space-y-3 ${performance.textColor} text-lg leading-relaxed`}>
                <p>
                  You scored:{" "}
                  <span className="font-semibold text-wordcherryBlue text-2xl">
                    {Math.floor(score)}
                  </span>
                </p>

                {bestWord.word && (
                  <div className="bg-white p-4 rounded-lg border-2 border-wordcherryBlue/20">
                    <p className="text-sm text-gray-600 mb-2">Best word:</p>
                    <p className="text-2xl font-bold text-wordcherryBlue uppercase tracking-wider">
                      {bestWord.word}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      (+{Math.floor(bestWord.score)} points)
                    </p>
                  </div>
                )}

                <p className="text-lg font-medium">{performance.subtitle}</p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleStartGame}
                className={`cursor-pointer w-full ${performance.buttonColor} ${performance.buttonTextColor} font-bold text-xl py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryYellow/90 hover:scale-103 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-wordcherryYellow active:scale-95 transition-all duration-200`}
              >
                <span className="flex items-center justify-center gap-2">Play Again</span>
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="cursor-pointer w-full bg-wordcherryBlue text-wordcherryYellow font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-wordcherryBlue/90 hover:scale-103 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-wordcherryBlue active:scale-95 transition-all duration-200"
              >
                Back to Home
              </button>
            </div>
            <div className="w-full lg:w-80"></div>
            <button
              onClick={() => (window.location.href = "/leaderboard")}
              className="mt-1 cursor-pointer w-full text-center text-gray-700 hover:text-wordcherryBlue underline decoration-transparent hover:decoration-current font-medium text-sm py-2 transition-all duration-300"
            >
              View leaderboard
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
