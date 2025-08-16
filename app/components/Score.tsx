"use client"

import GameTimer from "./GameTimer"

interface ScoreProps {
  currentScore: number
  className?: string
  handleEndGame: () => void
}

export default function Score({ currentScore, className = "", handleEndGame }: ScoreProps) {
  return (
    <>
      <GameTimer handleEndGame={handleEndGame} />
      <div className={`bg-gray-100 p-4 rounded-lg text-center ${className}`}>
        <div className="text-sm font-medium text-gray-700 mb-1">Score</div>
        <div className="text-2xl font-bold">{currentScore}</div>
      </div>
    </>
  )
}
