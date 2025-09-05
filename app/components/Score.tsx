"use client"

import { useEffect, useState } from "react"
import GameTimer from "./GameTimer"

interface ScoreProps {
  currentScore: number
  className?: string
  handleEndGame: () => void
}

export default function Score({ currentScore, className = "", handleEndGame }: ScoreProps) {
  const [previousScore, setPreviousScore] = useState(currentScore)
  const [isAnimating, setIsAnimating] = useState(false)
  const [scoreIncrease, setScoreIncrease] = useState(0)

  useEffect(() => {
    if (currentScore > previousScore) {
      const increase = currentScore - previousScore
      setScoreIncrease(increase)
      setIsAnimating(true)

      // Reset animation and update previous score after it completes
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setScoreIncrease(0)
        setPreviousScore(currentScore)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (currentScore === 0) {
      // Reset when game restarts
      setPreviousScore(0)
    }
  }, [currentScore, previousScore])

  return (
    <div className={`relative bg-applegramBlue p-4 rounded-lg ${className}`}>
      {/* Timer and Score in one integrated component */}
      <div className="flex justify-between items-center">
        <GameTimer handleEndGame={handleEndGame} />
        <div className="relative">
          <div className="text-white font-bold text-2xl">{currentScore}</div>

          {/* Simple green +X indicator that fades */}
          {isAnimating && (
            <div className="absolute -top-6 -right-2 text-green-400 font-bold text-lg animate-fade-out">
              +{scoreIncrease}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
