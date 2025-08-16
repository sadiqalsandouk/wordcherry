"use client"
import { useState, useEffect } from "react"
import { Timer } from "../types/types"

interface TimerProps {
  handleEndGame: () => void
}

export default function GameTimer({ handleEndGame }: TimerProps) {
  const [timerState, setTimerState] = useState<Timer>(Timer.RUNNING)
  const [secondsLeft, setSecondsLeft] = useState(15)

  useEffect(() => {
    if (timerState !== Timer.RUNNING) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerState(Timer.STOPPED)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerState])

  useEffect(() => {
    if (timerState === Timer.STOPPED && secondsLeft === 0) {
      handleEndGame()
    }
  }, [timerState, secondsLeft, handleEndGame])

  const isUrgent = secondsLeft <= 10
  const isCritical = secondsLeft <= 5
  const isOver = secondsLeft === 0

  if (isOver) {
    return null
  }

  return (
    <div className="hover:scale-101 transition-all flex flex-col items-center hover">
      <div
        className={`
        relative w-20 h-20 rounded-full flex items-center justify-center
        ${isUrgent ? "animate-pulse" : ""}
        ${isCritical ? "animate-bounce" : ""}
        transition-all duration-300 ease-in-out
      `}
      >
        <div
          className={`
          absolute inset-0 rounded-full
          ${
            isCritical
              ? "bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/50"
              : isUrgent
              ? "bg-gradient-to-r from-orange-500 to-yellow-500 shadow-lg shadow-orange-500/30"
              : "bg-applegramYellow shadow-xl shadow-applegramYellow/30"
          }
          transition-all duration-500
        `}
        />

        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 35}`}
            strokeDashoffset={`${2 * Math.PI * 35 * (1 - secondsLeft / 60)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        <div
          className={`
          relative z-10 text-white font-bold text-lg
          ${isCritical ? "text-xl animate-pulse" : ""}
          ${isUrgent ? "text-lg" : "text-base"}
          transition-all duration-300
          drop-shadow-lg
        `}
        >
          {secondsLeft}
        </div>
      </div>
    </div>
  )
}
