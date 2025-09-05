"use client"

import { useState } from "react"
import getRandomLetters from "../utils/getRandomLetters"
import { validateWord } from "../utils/wordValidation"
import { calculateFinalScore } from "../utils/wordScoringSystem"
import { GameState } from "../types/types"
import TileRack from "../components/TileRack"
import CurrentWord from "../components/CurrentWord"
import SubmitButton from "../components/SubmitButton"
import Score from "../components/Score"
import PreStartScreen from "../components/PreStartScreen"
import GameOver from "../components/GameOver"

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
  const [gameKey, setGameKey] = useState(0) // Used to force timer reset

  const handleTileClick = (letter: string, index: number) => {
    if (tiles[index].isUsed) return

    setCurrentWord((prev) => [...prev, { letter, tileIndex: index }])
    setTiles((prev) =>
      prev.map((tile, i) =>
        i === index ? { ...tile, isUsed: true, usedInWordIndex: currentWord.length } : tile
      )
    )
  }

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

  const handleSubmitButton = async () => {
    const currentWordString = currentWord.map((tile) => tile.letter).join("")
    const wordScore = calculateFinalScore(currentWordString)
    const isValid = validateWord(currentWordString)
    if (isValid) {
      setScore((prevScore) => prevScore + wordScore)
      setCurrentWord([])
      const newLetters = getRandomLetters(10)
      setTiles(newLetters.map((letter) => ({ letter, isUsed: false })))
    } else {
      return
    }
  }

  const handleStartGame = () => {
    setGameState(GameState.PLAYING)
    setScore(0)
    setCurrentWord([])
    const newLetters = getRandomLetters(10)
    setTiles(newLetters.map((letter) => ({ letter, isUsed: false })))
    setGameKey((prev) => prev + 1)
  }

  const handleEndGame = () => {
    setGameState(GameState.ENDED)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {gameState === GameState.IDLE && <PreStartScreen handleStartGame={handleStartGame} />}
      {gameState === GameState.PLAYING && (
        <div className="space-y-4 md:space-y-6">
          <Score key={gameKey} handleEndGame={handleEndGame} currentScore={score} />
          <div className="bg-gray-100 p-4 md:p-6 rounded-lg min-h-[120px] flex flex-col">
            <div className="mb-2 font-medium text-gray-700">Current Word:</div>
            <div className="flex-1 flex items-center justify-center">
              <CurrentWord
                onTileClick={handleCurrentWordClick}
                currentWord={currentWord.map((tile) => tile.letter)}
              />
            </div>
          </div>
          <SubmitButton
            onSubmitClick={handleSubmitButton}
            currentWord={currentWord.map((tile) => tile.letter)}
          />
          <div className="bg-teal-200 p-4 md:p-6 rounded-lg min-h-[100px] flex items-center justify-center">
            <TileRack onTileClick={handleTileClick} tiles={tiles} />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleStartGame}
              className="w-full max-w-md bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl border-2 border-red-400 hover:border-red-500 transform hover:scale-101 active:scale-95 transition-all duration-200 ease-out"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Restart Game
              </span>
            </button>
          </div>
        </div>
      )}
      {gameState === GameState.ENDED && (
        <GameOver score={score} handleStartGame={handleStartGame} />
      )}
    </div>
  )
}
