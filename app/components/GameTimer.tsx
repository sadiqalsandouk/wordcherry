"use client"
import { useState, useEffect } from "react"
import { Timer } from "../types/types"

interface TimerProps {
  handleEndGame: () => void
  timerState?: Timer
  secondsLeft?: number
  onTimeUpdate?: (seconds: number) => void
}

export default function GameTimer({
  handleEndGame,
  timerState: externalTimerState,
  secondsLeft: externalSecondsLeft,
  onTimeUpdate,
}: TimerProps) {
  const [timerState, setTimerState] = useState<Timer>(Timer.RUNNING)
  const [internalSecondsLeft, setInternalSecondsLeft] = useState(60)

  // Use external timer state and seconds if provided, otherwise use internal state
  const currentTimerState = externalTimerState || timerState
  const secondsLeft = externalSecondsLeft !== undefined ? externalSecondsLeft : internalSecondsLeft

  useEffect(() => {
    if (currentTimerState !== Timer.RUNNING) return

    const interval = setInterval(() => {
      if (onTimeUpdate) {
        // If external time management, update parent
        onTimeUpdate(secondsLeft - 1)
      } else {
        // If internal time management
        setInternalSecondsLeft((prev) => {
          if (prev <= 1) {
            setTimerState(Timer.STOPPED)
            return 0
          }
          return prev - 1
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentTimerState, onTimeUpdate, secondsLeft])

  useEffect(() => {
    if (currentTimerState === Timer.STOPPED && secondsLeft === 0) {
      handleEndGame()
    }
  }, [currentTimerState, secondsLeft, handleEndGame])

  const isUrgent = secondsLeft <= 10
  const isCritical = secondsLeft <= 5
  const isOver = secondsLeft === 0

  if (isOver) {
    return null
  }

  const progressPercentage = (secondsLeft / 60) * 100
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeDisplay = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`

  return (
    <>
      <div
        className={`
          text-white font-bold text-2xl
          ${isCritical ? "text-red-300 animate-pulse" : ""}
          ${isUrgent ? "text-orange-300" : ""}
        `}
      >
        {timeDisplay}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2">
        <div className="relative w-full h-full bg-gray-200/20 overflow-hidden">
          <div
            className={`
                absolute top-0 left-0 h-full transition-all duration-1000 ease-linear
                ${
                  isCritical
                    ? "bg-gradient-to-r from-red-400 to-red-600"
                    : isUrgent
                    ? "bg-gradient-to-r from-orange-400 to-yellow-500"
                    : "bg-gradient-to-r from-applegramYellow to-orange-400"
                }
              `}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </>
  )
}
