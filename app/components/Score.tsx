"use client"

interface ScoreProps {
  currentScore: number
  className?: string
}

export default function Score({ currentScore, className = "" }: ScoreProps) {
  return (
    <div className={`bg-gray-100 p-4 rounded-lg text-center ${className}`}>
      <div className="text-sm font-medium text-gray-700 mb-1">Score</div>
      <div className="text-2xl font-bold">{currentScore}</div>
    </div>
  )
}
