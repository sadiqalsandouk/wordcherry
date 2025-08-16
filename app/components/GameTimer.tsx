"use client"
import { useState, useEffect } from "react"
import { Timer } from "../types/types"

interface TimerProps {
  handleEndGame: () => void
}

export default function GameTimer({ handleEndGame }: TimerProps) {
  const [timerState, setTimerState] = useState<Timer>(Timer.RUNNING)
  const [secondsLeft, setSecondsLeft] = useState(60)

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

  return (
    <div>
      <h2>{secondsLeft}s</h2>
    </div>
  )
}
