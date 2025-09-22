"use client"
import { useState, useEffect, useRef } from "react"
import { Timer } from "../types/types"

interface TimerProps {
  handleEndGame: () => void
  timerState?: Timer
  secondsLeft?: number
  onTimeUpdate?: (seconds: number) => void
  timeBonus?: number
  onTimeBonusAnimationComplete?: () => void
}

export default function GameTimer({
  handleEndGame,
  timerState: externalTimerState,
  secondsLeft: externalSecondsLeft,
  onTimeUpdate,
  timeBonus,
  onTimeBonusAnimationComplete,
}: TimerProps) {
  const [timerState, setTimerState] = useState<Timer>(Timer.RUNNING)
  const [internalSecondsLeft, setInternalSecondsLeft] = useState(60)
  const [isTimeBonusAnimating, setIsTimeBonusAnimating] = useState(false)
  const secondsRef = useRef(60)
  const currentTimerState = externalTimerState || timerState
  const secondsLeft = externalSecondsLeft !== undefined ? externalSecondsLeft : internalSecondsLeft

  secondsRef.current = secondsLeft

  useEffect(() => {
    if (currentTimerState !== Timer.RUNNING) return

    const interval = setInterval(() => {
      if (onTimeUpdate) {
        onTimeUpdate(secondsRef.current - 1)
      } else {
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
  }, [currentTimerState, onTimeUpdate])

  useEffect(() => {
    if (currentTimerState === Timer.STOPPED && secondsLeft === 0) {
      handleEndGame()
    }
  }, [currentTimerState, secondsLeft, handleEndGame])

  useEffect(() => {
    if (timeBonus && timeBonus > 0) {
      setIsTimeBonusAnimating(true)

      const timer = setTimeout(() => {
        setIsTimeBonusAnimating(false)
        if (onTimeBonusAnimationComplete) {
          onTimeBonusAnimationComplete()
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [timeBonus, onTimeBonusAnimationComplete])

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
      <div className="relative">
        <div
          className={`
            text-white font-bold text-2xl
            ${isCritical ? "text-red-300 animate-pulse" : ""}
            ${isUrgent ? "text-orange-300" : ""}
          `}
        >
          {timeDisplay}
        </div>

        {isTimeBonusAnimating && timeBonus && (
          <div className="absolute -top-6 -right-2 text-green-400 font-bold text-lg animate-fade-out">
            +{timeBonus}s
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2">
        <div className="relative w-full h-full bg-gray-200/20 overflow-hidden rounded-full">
          <div
            className="absolute top-0 left-0 h-full transition-all duration-1000 ease-linear bg-gradient-to-r from-red-500 to-yellow-400 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </>
  )
}
