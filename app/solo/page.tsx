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

  const handleSubmitButton = useCallback(() => {
    const currentWordString = currentWord.map((tile) => tile.letter).join("")
    const wordScore = calculateFinalScore(currentWordString)
    const isValid = validateWord(currentWordString)

    if (isValid) {
      setFeedback("Valid word!")
      setShowFeedback(true)

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

  const handleEndGame = useCallback(() => {
    setGameState(GameState.ENDED)
    setTimerState(Timer.STOPPED)
  }, [])

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
    <div className="w-full max-w-3xl mx-auto pt-8 md:pt-0">
      {gameState === GameState.IDLE && <PreStartScreen handleStartGame={handleStartGame} />}
      {gameState === GameState.PLAYING && (
        <div className="relative">
          <div className="space-y-8 md:space-y-10">
            <Title />
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
              <Score
                key={gameKey}
                handleEndGame={handleEndGame}
                currentScore={score}
                timerState={timerState}
                secondsLeft={secondsLeft}
                onTimeUpdate={handleTimeUpdate}
              />
            </div>
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
              <div
                className={`bg-gray-100 p-4 md:p-6 rounded-lg min-h-[140px] md:min-h-[160px] lg:min-h-[180px] flex flex-col relative ${
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

            {showFeedback && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div
                  className={`px-6 py-2 rounded-lg font-bold text-white text-sm shadow-lg animate-fade-out ${
                    feedback === "Valid word!" ? "bg-green-500" : "bg-red-500"
                  }`}
                  onAnimationEnd={() => {
                    setShowFeedback(false)
                    setFeedback("")
                  }}
                >
                  {feedback}
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
        <GameOver score={score} handleStartGame={handleStartGame} bestWord={bestWord} />
      )}
    </div>
  )
}
