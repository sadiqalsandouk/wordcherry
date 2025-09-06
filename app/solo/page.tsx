"use client"

import { useState, useEffect, useCallback } from "react"
import getRandomLetters from "../utils/getRandomLetters"
import { validateWord } from "../utils/wordValidation"
import { calculateFinalScore } from "../utils/wordScoringSystem"
import { GameState, Timer } from "../types/types"
import TileRack from "../components/TileRack"
import CurrentWord from "../components/CurrentWord"
import SubmitButton from "../components/SubmitButton"
import Score from "../components/Score"
import PreStartScreen from "../components/PreStartScreen"
import GameOver from "../components/GameOver"
import PauseMenu from "../components/PauseMenu"
import Title from "../components/Title"

interface TileState {
  letter: string
  isUsed: boolean
  usedInWordIndex?: number
}

export default function SoloGame() {
  const [tiles, setTiles] = useState<TileState[]>([])
  const [currentWord, setCurrentWord] = useState<{ letter: string; tileIndex: number }[]>([])
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE)
  const [timerState, setTimerState] = useState<Timer>(Timer.RUNNING)
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [gameKey, setGameKey] = useState(0)
  const [feedback, setFeedback] = useState<string>("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [bestWord, setBestWord] = useState<{ word: string; score: number }>({ word: "", score: 0 })

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

  const handleSubmitButton = useCallback(async () => {
    const currentWordString = currentWord.map((tile) => tile.letter).join("")
    const wordScore = calculateFinalScore(currentWordString)
    const isValid = validateWord(currentWordString)

    if (isValid) {
      setFeedback("Valid word!")
      setShowFeedback(true)

      setTimeout(() => {
        setShowFeedback(false)
        setFeedback("")
      }, 1000)

      if (wordScore > bestWord.score) {
        setBestWord({ word: currentWordString, score: wordScore })
      }

      setScore((prevScore) => prevScore + wordScore)
      setCurrentWord([])
      const newLetters = getRandomLetters(10)
      setTiles(newLetters.map((letter) => ({ letter, isUsed: false })))
    } else {
      setFeedback("Invalid word!")
      setShowFeedback(true)
      setIsShaking(true)

      setTimeout(() => {
        setShowFeedback(false)
        setFeedback("")
      }, 1000)

      setTimeout(() => {
        setIsShaking(false)
      }, 500)

      return
    }
  }, [currentWord, bestWord.score])

  const handleStartGame = () => {
    setGameState(GameState.PLAYING)
    setTimerState(Timer.RUNNING)
    setSecondsLeft(60)
    setScore(0)
    setCurrentWord([])
    setFeedback("")
    setShowFeedback(false)
    setIsShaking(false)
    setBestWord({ word: "", score: 0 })
    const newLetters = getRandomLetters(10)
    setTiles(newLetters.map((letter) => ({ letter, isUsed: false })))
    setGameKey((prev) => prev + 1)
  }

  const handleEndGame = () => {
    setGameState(GameState.ENDED)
    setTimerState(Timer.STOPPED)
  }

  const handleTimeUpdate = (newSecondsLeft: number) => {
    setSecondsLeft(newSecondsLeft)
    if (newSecondsLeft <= 0) {
      handleEndGame()
    }
  }

  const handlePauseGame = () => {
    setGameState(GameState.PAUSED)
    setTimerState(Timer.PAUSED)
  }

  const handleResumeGame = () => {
    setGameState(GameState.PLAYING)
    setTimerState(Timer.RUNNING)
  }

  const handleQuitToHome = () => {
    window.location.href = "/"
  }

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
    <div className="w-full max-w-3xl mx-auto">
      {gameState === GameState.IDLE && <PreStartScreen handleStartGame={handleStartGame} />}
      {gameState === GameState.PLAYING && (
        <div className="relative">
          <div className="space-y-4 md:space-y-6">
            <Title />
            <Score
              key={gameKey}
              handleEndGame={handleEndGame}
              currentScore={score}
              timerState={timerState}
              secondsLeft={secondsLeft}
              onTimeUpdate={handleTimeUpdate}
            />
            <div
              className={`bg-gray-100 p-4 md:p-6 rounded-lg min-h-[120px] flex flex-col ${
                isShaking ? "animate-shake" : ""
              }`}
            >
              <div className="mb-2 font-medium text-gray-700">Current Word:</div>
              <div className="flex-1 flex items-center justify-center">
                <CurrentWord
                  onTileClick={handleCurrentWordClick}
                  currentWord={currentWord.map((tile) => tile.letter)}
                />
              </div>
            </div>

            <div className="h-12 flex items-center justify-center">
              {showFeedback && (
                <div
                  className={`px-6 py-2 rounded-lg font-bold text-white text-sm shadow-lg animate-fade-out ${
                    feedback === "Valid word!" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {feedback}
                </div>
              )}
            </div>

            <SubmitButton
              onSubmitClick={handleSubmitButton}
              currentWord={currentWord.map((tile) => tile.letter)}
            />
            <div className="p-4 md:p-6 rounded-lg min-h-[100px] flex items-center justify-center">
              <TileRack onTileClick={handleTileClick} tiles={tiles} />
            </div>

            <div className="flex justify-end px-4">
              <button
                onClick={handlePauseGame}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
                title="Pause game (ESC)"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6"
                  />
                </svg>
              </button>
            </div>
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
        <GameOver score={score} handleStartGame={handleStartGame} bestWord={bestWord} />
      )}
    </div>
  )
}
