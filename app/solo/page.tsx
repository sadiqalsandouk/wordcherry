"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getSeededLetters } from "../utils/getSeededLetters"
import { validateWord } from "../utils/wordValidation"
import { calculateFinalScore } from "../utils/wordScoringSystem"
import { calculateTimeBonus } from "../utils/timeBonusSystem"
import { GameState, Timer } from "../types/types"
import TileRack from "../components/TileRack"
import CurrentWord from "../components/CurrentWord"
import SubmitButton from "../components/SubmitButton"
import Score from "../components/Score"
import PreStartScreen from "../components/PreStartScreen"
import GameOver from "../components/GameOver"
import PauseMenu from "../components/PauseMenu"
import { supabase } from "@/lib/supabase/supabase"
import { usePlayerName } from "@/app/components/AuthProvider"
import { sfx } from "@/app/utils/sfx"

interface TileState {
  letter: string
  isUsed: boolean
  usedInWordIndex?: number
}

interface PendingWordSubmission {
  runId: string
  word: string
}

export default function SoloGame() {
  const { playerName } = usePlayerName()
  const [tiles, setTiles] = useState<TileState[]>([])
  const [currentWord, setCurrentWord] = useState<{ letter: string; tileIndex: number }[]>([])
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE)
  const [timerState, setTimerState] = useState<Timer>(Timer.RUNNING)
  const [secondsLeft, setSecondsLeft] = useState(30)
  const [gameKey, setGameKey] = useState(0)
  const [feedback, setFeedback] = useState<{
    id: number
    message: string
    isPositive: boolean
  } | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [bestWord, setBestWord] = useState<{ word: string; score: number }>({ word: "", score: 0 })
  const [timeBonus, setTimeBonus] = useState<number>(0)
  const [soloRunId, setSoloRunId] = useState<string | null>(null)
  const [soloSeed, setSoloSeed] = useState<string>("")
  const [roundIndex, setRoundIndex] = useState(0)
  const feedbackIdRef = useRef(0)
  const pendingSubmissionsRef = useRef<PendingWordSubmission[]>([])
  const isFlushingQueueRef = useRef(false)
  const lastTickRef = useRef<number | null>(null)
  const hasPlayedEndRef = useRef(false)

  const handleTileClick = useCallback(
    (letter: string, index: number) => {
      if (tiles[index].isUsed) return

      setCurrentWord((prev) => [...prev, { letter, tileIndex: index }])
      setTiles((prev) =>
        prev.map((tile, i) =>
          i === index ? { ...tile, isUsed: true, usedInWordIndex: currentWord.length } : tile
        )
      )
    },
    [tiles, currentWord]
  )

  const handleCurrentWordClick = (letter: string, index: number) => {
    const wordTile = currentWord[index]
    const tileIndex = wordTile.tileIndex

    setTiles((prev) =>
      prev.map((tile, i) =>
        i === tileIndex ? { ...tile, isUsed: false, usedInWordIndex: undefined } : tile
      )
    )

    setCurrentWord((prev) => prev.filter((_, currentPosition) => currentPosition !== index))
  }

  const handleBackspace = useCallback(() => {
    if (currentWord.length === 0) return

    const lastWordTile = currentWord[currentWord.length - 1]
    const tileIndex = lastWordTile.tileIndex

    setTiles((prev) =>
      prev.map((tile, i) =>
        i === tileIndex ? { ...tile, isUsed: false, usedInWordIndex: undefined } : tile
      )
    )

    setCurrentWord((prev) => prev.slice(0, -1))
  }, [currentWord])

  const handleLetterType = useCallback(
    (letter: string) => {
      const availableTileIndex = tiles.findIndex(
        (tile) => tile.letter.toLowerCase() === letter.toLowerCase() && !tile.isUsed
      )

      if (availableTileIndex !== -1) {
        handleTileClick(tiles[availableTileIndex].letter, availableTileIndex)
      }
    },
    [tiles, handleTileClick]
  )

  const handleTimeBonusAnimationComplete = useCallback(() => {
    setTimeBonus(0)
  }, [])

  const getAuthToken = useCallback(async () => {
    const { data: userRes } = await supabase.auth.getUser()
    if (!userRes.user) {
      await supabase.auth.signInAnonymously()
    }
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  }, [])

  const flushPendingSubmissions = useCallback(async () => {
    if (isFlushingQueueRef.current) return
    if (pendingSubmissionsRef.current.length === 0) return

    isFlushingQueueRef.current = true
    try {
      while (pendingSubmissionsRef.current.length > 0) {
        const submission = pendingSubmissionsRef.current[0]
        const token = await getAuthToken()
        if (!token) break

        const res = await fetch("/api/solo/submit-word", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            runId: submission.runId,
            word: submission.word,
          }),
        })

        const body = await res.json().catch(() => null)
        pendingSubmissionsRef.current.shift()

        if (!res.ok || !body) {
          console.error("Solo word submit failed:", body?.error || "Unknown error")
          continue
        }

        if (body.status === "finished") {
          const nextSeconds = Math.max(0, Math.ceil((body.remainingMs || 0) / 1000))
          setSecondsLeft(nextSeconds)
          setScore(body.score || 0)
          setBestWord({
            word: body.bestWord || "",
            score: body.bestWordScore || 0,
          })
          setRoundIndex(body.roundIndex || 0)
          setCurrentWord([])

          const nextLetters = getSeededLetters(soloSeed, body.roundIndex || 0)
          setTiles(nextLetters.map((letter) => ({ letter, isUsed: false })))

          setTimerState(Timer.STOPPED)
          setGameState(GameState.ENDED)
          pendingSubmissionsRef.current = []
          break
        }

        if (!body.valid) {
          const nextSeconds = Math.max(0, Math.ceil((body.remainingMs || 0) / 1000))
          setSecondsLeft(nextSeconds)
          setScore(body.score || 0)
          setBestWord({
            word: body.bestWord || "",
            score: body.bestWordScore || 0,
          })
          setRoundIndex(body.roundIndex || 0)
          setCurrentWord([])

          const nextLetters = getSeededLetters(soloSeed, body.roundIndex || 0)
          setTiles(nextLetters.map((letter) => ({ letter, isUsed: false })))
        }
      }
    } finally {
      isFlushingQueueRef.current = false
      if (pendingSubmissionsRef.current.length > 0) {
        void flushPendingSubmissions()
      }
    }
  }, [getAuthToken, soloSeed])

  const handleSubmitButton = useCallback(async () => {
    if (!soloRunId || !soloSeed) return

    const currentWordString = currentWord.map((tile) => tile.letter).join("").toUpperCase()
    const isValidWord =
      validateWord(currentWordString) &&
      currentWordString.length >= 3 &&
      currentWordString.length <= tiles.length

    if (!isValidWord) {
      feedbackIdRef.current += 1
      setFeedback({
        id: feedbackIdRef.current,
        message: "Invalid word!",
        isPositive: false,
      })
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    const wordScore = calculateFinalScore(currentWordString)
    const bonusSeconds = calculateTimeBonus(currentWordString)
    const nextRoundIndex = roundIndex + 1

    feedbackIdRef.current += 1
    setFeedback({
      id: feedbackIdRef.current,
      message: "Valid word!",
      isPositive: true,
    })
    setTimeBonus(bonusSeconds)

    setScore((prev) => prev + wordScore)
    setBestWord((prev) =>
      wordScore > prev.score ? { word: currentWordString, score: wordScore } : prev
    )
    setRoundIndex(nextRoundIndex)
    setSecondsLeft((prev) => Math.min(120, Math.max(0, prev + bonusSeconds)))
    setCurrentWord([])

    const nextLetters = getSeededLetters(soloSeed, nextRoundIndex)
    setTiles(nextLetters.map((letter) => ({ letter, isUsed: false })))

    pendingSubmissionsRef.current.push({
      runId: soloRunId,
      word: currentWordString,
    })
    void flushPendingSubmissions()
  }, [currentWord, flushPendingSubmissions, roundIndex, soloRunId, soloSeed, tiles.length])

  const handleStartGame = useCallback(async () => {
    const token = await getAuthToken()
    if (!token) return

    const res = await fetch("/api/solo/start-run", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerName }),
    })

    const body = await res.json().catch(() => null)
    if (!res.ok || !body?.run) {
      console.error("Failed to start solo run:", body?.error || "Unknown error")
      return
    }

    const run = body.run
    pendingSubmissionsRef.current = []
    isFlushingQueueRef.current = false
    setSoloRunId(run.id)
    setSoloSeed(run.seed)
    setRoundIndex(run.roundIndex || 0)
    setGameState(GameState.PLAYING)
    setTimerState(Timer.RUNNING)
    setSecondsLeft(Math.max(0, Math.ceil((run.remainingMs || 0) / 1000)))
    setScore(run.score || 0)
    setCurrentWord([])
    setFeedback(null)
    setIsShaking(false)
    setBestWord({
      word: run.bestWord || "",
      score: run.bestWordScore || 0,
    })
    setTimeBonus(0)
    const newLetters = getSeededLetters(run.seed, run.roundIndex || 0)
    setTiles(newLetters.map((letter) => ({ letter, isUsed: false })))
    setGameKey((prev) => prev + 1)
  }, [getAuthToken, playerName])

  const handleEndGame = useCallback(() => {
    const finalize = async () => {
      if (!soloRunId) return
      const token = await getAuthToken()
      if (!token) return

      const res = await fetch("/api/solo/finish-run", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ runId: soloRunId }),
      })

      const body = await res.json().catch(() => null)
      if (!res.ok || !body) {
        console.error("Failed to finalize solo run:", body?.error || "Unknown error")
        return
      }

      setScore(body.score || 0)
      setBestWord({
        word: body.bestWord || "",
        score: body.bestWordScore || 0,
      })
      setRoundIndex(body.roundIndex || 0)
      setSecondsLeft(Math.max(0, Math.ceil((body.remainingMs || 0) / 1000)))
    }

    pendingSubmissionsRef.current = []
    isFlushingQueueRef.current = false
    setGameState(GameState.ENDED)
    setTimerState(Timer.STOPPED)
    void finalize()
  }, [getAuthToken, soloRunId])

  const handleTimeUpdate = useCallback(
    (newSecondsLeft: number) => {
      setSecondsLeft(newSecondsLeft)
      if (newSecondsLeft <= 0) {
        handleEndGame()
      }
    },
    [handleEndGame]
  )

  const handlePauseGame = useCallback(() => {
    setGameState(GameState.PAUSED)
    setTimerState(Timer.PAUSED)
  }, [])

  const handleResumeGame = useCallback(() => {
    setGameState(GameState.PLAYING)
    setTimerState(Timer.RUNNING)
  }, [])

  const handleQuitToHome = () => {
    window.location.href = "/"
  }

  useEffect(() => {
    if (gameState !== GameState.PLAYING) {
      lastTickRef.current = null
      return
    }
    if (secondsLeft <= 0 || secondsLeft > 5) return
    if (lastTickRef.current === secondsLeft) return
    lastTickRef.current = secondsLeft
    sfx.tick()
  }, [secondsLeft, gameState])

  useEffect(() => {
    if (gameState !== GameState.ENDED) {
      hasPlayedEndRef.current = false
      return
    }
    if (hasPlayedEndRef.current) return
    hasPlayedEndRef.current = true
    sfx.end()
  }, [gameState])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState === GameState.PAUSED) {
        if (event.key === "Escape") {
          event.preventDefault()
          handleResumeGame()
        }
        return
      }

      if (gameState !== GameState.PLAYING) return

      if (event.key === "Escape") {
        event.preventDefault()
        handlePauseGame()
      } else if (event.key === "Backspace") {
        event.preventDefault()
        handleBackspace()
      } else if (event.key === "Enter") {
        event.preventDefault()
        if (currentWord.length > 0) {
          handleSubmitButton()
        }
      } else if (event.key.length === 1 && /^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault()
        handleLetterType(event.key)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    gameState,
    handleBackspace,
    handleLetterType,
    handleSubmitButton,
    currentWord,
    handlePauseGame,
    handleResumeGame,
  ])

  return (
    <div className="pt-8 md:pt-0">
      {gameState === GameState.IDLE && <PreStartScreen handleStartGame={handleStartGame} />}
      {gameState === GameState.PLAYING && (
        <div className="relative">
          <div className="space-y-8 md:space-y-10">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
              <Score
                key={gameKey}
                handleEndGame={handleEndGame}
                currentScore={score}
                timerState={timerState}
                secondsLeft={secondsLeft}
                onTimeUpdate={handleTimeUpdate}
                timeBonus={timeBonus}
                onTimeBonusAnimationComplete={handleTimeBonusAnimationComplete}
              />
            </div>
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
              <div
                className={`bg-gray-100 p-6 md:p-8 rounded-lg min-h-[180px] md:min-h-[200px] lg:min-h-[220px] flex flex-col relative ${
                  isShaking ? "animate-shake" : ""
                }`}
              >
                {currentWord.length > 0 && (
                  <button
                    onClick={() => {
                      setCurrentWord([])
                      setTiles((prev) =>
                        prev.map((tile) => ({ ...tile, isUsed: false, usedInWordIndex: undefined }))
                      )
                    }}
                    className="cursor-pointer absolute bottom-3 right-3 px-2 py-1 md:px-3 md:py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm font-medium rounded-lg border border-red-600 shadow-md hover:shadow-lg transition-all duration-200 group flex items-center gap-1 md:gap-1.5"
                    title="Clear word"
                  >
                    <span className="text-xs md:text-sm">🗑️ Clear</span>
                  </button>
                )}
                <div className="flex-1 flex items-center justify-center">
                  {currentWord.length === 0 ? (
                    <div className="text-gray-400 text-lg md:text-xl italic text-center px-4">
                      <span className="block md:hidden">Tap letters to build words...</span>
                      <span className="hidden md:block">
                        Type or click letters to build words...
                      </span>
                    </div>
                  ) : (
                    <CurrentWord
                      onTileClick={handleCurrentWordClick}
                      currentWord={currentWord.map((tile) => tile.letter)}
                    />
                  )}
                </div>
              </div>
            </div>

            {feedback && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div
                  key={feedback.id}
                  className={`px-6 py-2 rounded-lg font-bold text-white text-sm shadow-lg animate-fade-out ${
                    feedback.isPositive ? "bg-green-500" : "bg-red-500"
                  }`}
                  onAnimationEnd={() => {
                    setFeedback((prev) => (prev?.id === feedback.id ? null : prev))
                  }}
                >
                  {feedback.message}
                </div>
              </div>
            )}

            {/* Increased spacing before tile rack on mobile */}
            <div className="mt-8 md:mt-6">
              <TileRack
                onTileClick={handleTileClick}
                tiles={tiles}
                onBackspace={handleBackspace}
                onPause={handlePauseGame}
              />
            </div>

            {/* Increased spacing before submit button */}
            <div className="mt-6 md:mt-4">
              <SubmitButton
                onSubmitClick={handleSubmitButton}
                currentWord={currentWord.map((tile) => tile.letter)}
              />
            </div>

            {/* Bottom spacing for better mobile experience */}
            <div className="p-6 md:p-6 rounded-lg min-h-[120px] md:min-h-[100px] flex items-center justify-center"></div>
          </div>
        </div>
      )}
      {gameState === GameState.PAUSED && (
        <PauseMenu
          onResume={handleResumeGame}
          onRestart={handleStartGame}
          onQuit={handleQuitToHome}
        />
      )}
      {gameState === GameState.ENDED && (
        <GameOver
          score={score}
          handleStartGame={handleStartGame}
          bestWord={bestWord}
          soloRunId={soloRunId}
        />
      )}
    </div>
  )
}
