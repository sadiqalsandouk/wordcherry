import { useEffect, useState } from "react"
import Confetti from "react-confetti"

type GameOverProps = {
  handleStartGame: () => void
  score: number
  bestWord: { word: string; score: number }
}

const gameOverTitles = [
  "Nice Try!",
  "That's a Wrap!",
  "Great Effort!",
  "Time's Up!",
  "Applegrams Complete!",
  "Well Played!",
  "So Close!",
  "Good Run!",
  "Sweet Try!",
  "Game Over!",
]

const motivationalTexts = [
  "Can you beat your high score?",
  "One more round?",
  "Your brain is just warming up!",
  "Words are waiting… grab them!",
  "Sharpen your skills for the next round!",
  "You're on the right track!",
  "Keep building those words!",
  "Next time, even higher!",
  "Practice makes perfect!",
  "Ready for a rematch?",
]

function getRandomMessage(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function GameOver({ handleStartGame, score, bestWord }: GameOverProps) {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setTitle(getRandomMessage(gameOverTitles))
    setSubtitle(getRandomMessage(motivationalTexts))

    if (score >= 50) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [score])

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          gravity={0.2}
        />
      )}

      <div className="text-center space-y-6">
        <div className="bg-gray-100 p-8 rounded-lg">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">{score >= 50 ? "🎉" : "🍎"}</h1>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {score >= 50 ? "Amazing Score!" : title}
            </h2>

            <div className="space-y-3 text-gray-700 text-lg leading-relaxed">
              <p>
                You scored: <span className="font-semibold text-applegramBlue">{score}</span>
                {score >= 50 && <span className="text-yellow-600 ml-2">⭐ Excellent!</span>}
              </p>

              {bestWord.word && (
                <div className="bg-white p-4 rounded-lg border-2 border-applegramBlue/20">
                  <p className="text-sm text-gray-600 mb-2">Best word:</p>
                  <p className="text-2xl font-bold text-applegramBlue uppercase tracking-wider">
                    {bestWord.word}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">(+{bestWord.score} points)</p>
                </div>
              )}

              <p>{score >= 50 ? "You're a word master!" : subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleStartGame}
            className="cursor-pointer w-full bg-applegramYellow text-applegramBlue font-bold text-lg py-4 rounded-xl transition-all hover:scale-101 shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-applegramYellow"
          >
            TRY AGAIN
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-3 cursor-pointer w-full bg-applegramBlue text-applegramYellow font-bold text-lg py-4 rounded-xl transition-all hover:scale-101 shadow-[2px_2px_0_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-applegramYellow"
          >
            HOME
          </button>
        </div>
      </div>
    </>
  )
}
