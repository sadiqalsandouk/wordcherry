import { useEffect, useMemo, useState } from "react"
import Confetti from "react-confetti"
import { GameOverProps } from "@/app/types/types"
import { usePlayerName } from "@/app/components/AuthProvider"
import { submitScore } from "@/lib/supabase/submitScore"
import { getPerformanceLevel } from "@/app/utils/performanceLevel"

export default function GameOver({ handleStartGame, score, bestWord }: GameOverProps) {
  const gameId = useMemo(() => crypto.randomUUID(), [])
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const performance = getPerformanceLevel(score)
  const { playerName } = usePlayerName()

  useEffect(() => {
    if (performance.showConfetti) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [performance.showConfetti])

  const onSubmit = async () => {
    setSubmitting(true)
    setSubmitMsg(null)
    const res = await submitScore({
      gameId,
      score,
      bestWord: bestWord.word || "",
      bestWordScore: bestWord.score || 0,
      playerName,
    })
    if (res.ok) setSubmitMsg("Submitted to leaderboard!") //TODO make this a toast
    else setSubmitMsg(`Error: ${res.error}`) //TODO make this a toast
    setSubmitting(false)
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          gravity={0.5}
        />
      )}

      <div className="text-center space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          <div className={`${performance.bgColor} p-8 rounded-lg flex-1 max-w-lg`}>
            <h1 className="text-6xl font-bold mb-4">{performance.emoji}</h1>
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
              <div className="mt-6 space-y-3">
                <p className="text-gray-600 text-sm mt-4">
                  Logged in as <span className="font-semibold">{playerName}</span>
                </p>
                <button
                  onClick={onSubmit}
                  disabled={submitting}
                  className="cursor-pointer w-full bg-green-600 text-white font-bold text-lg py-4 rounded-xl shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-green-600/90 hover:scale-103 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-wordcherryBlue active:scale-95 transition-all duration-200"
                >
                  {submitting ? "Submitting…" : "Submit to Leaderboard"}
                </button>
                {submitMsg && <p className="text-sm text-gray-700">{submitMsg}</p>}
              </div>
            </div>
            <div className="w-full lg:w-80"></div>
            <button
              onClick={() => (window.location.href = "/leaderboard")}
              className="cursor-pointer w-full text-center text-grey-700 hover:text-wordcherryBlue underline decoration-transparent hover:decoration-current font-medium text-sm py-2 transition-all duration-300"
            >
              View leaderboard →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
