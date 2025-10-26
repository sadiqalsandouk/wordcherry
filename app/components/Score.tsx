"use client"

import { useEffect, useState } from "react"
import GameTimer from "./GameTimer"
import { Star } from "lucide-react"

interface ScoreProps {
  currentScore: number
  className?: string
  handleEndGame: () => void
  timerState?: import("../types/types").Timer
  secondsLeft?: number
  onTimeUpdate?: (seconds: number) => void
  timeBonus?: number
  onTimeBonusAnimationComplete?: () => void
}

export default function Score({
  currentScore,
  className = "",
  handleEndGame,
  timerState,
  secondsLeft,
  onTimeUpdate,
  timeBonus,
  onTimeBonusAnimationComplete,
}: ScoreProps) {
  const [previousScore, setPreviousScore] = useState(currentScore)
  const [isAnimating, setIsAnimating] = useState(false)
  const [scoreIncrease, setScoreIncrease] = useState(0)

  useEffect(() => {
    if (currentScore > previousScore) {
      const increase = currentScore - previousScore
      setScoreIncrease(increase)
      setIsAnimating(true)

      const timer = setTimeout(() => {
        setIsAnimating(false)
        setScoreIncrease(0)
        setPreviousScore(currentScore)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (currentScore === 0) {
      setPreviousScore(0)
    }
  }, [currentScore, previousScore])

  return (
    <div className={`relative bg-wordcherryBlue p-4 rounded-lg ${className}`}>
      <div className="flex justify-between items-center">
        <GameTimer
          handleEndGame={handleEndGame}
          timerState={timerState}
          secondsLeft={secondsLeft}
          onTimeUpdate={onTimeUpdate}
          timeBonus={timeBonus}
          onTimeBonusAnimationComplete={onTimeBonusAnimationComplete}
        />
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="text-white font-bold text-2xl flex items-center gap-1">
              <span>
                <Star />
              </span>
              <span>{Math.floor(currentScore)}</span>
            </div>
          </div>

          {isAnimating && (
            <div className="absolute -top-6 -right-2 text-green-400 font-bold text-lg animate-fade-out">
              +{Math.floor(scoreIncrease)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
