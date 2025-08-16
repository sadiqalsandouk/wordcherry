"use client"

import { useState } from "react"
import getRandomLetters from "../utils/getRandomLetters"
import TileRack from "./TileRack"
import CurrentWord from "./CurrentWord"
import SubmitButton from "./SubmitButton"
import Score from "./Score"
import { validateWord } from "../utils/wordValidation"
import { calculateFinalScore } from "../utils/wordScoringSystem"
import { GameState } from "../types/types"
import { PreStartScreen } from "./PreStartScreen"

export default function SoloGame() {
  const [tiles, setTiles] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE)

  const handleTileClick = (letter: string, index: number) => {
    setCurrentWord((prev) => [...prev, letter])
    setTiles(tiles.filter((_, currentPosition) => currentPosition !== index))
  }

  const handleCurrentWordClick = (letter: string, index: number) => {
    setTiles((prev) => [...prev, letter])
    setCurrentWord(currentWord.filter((_, currentPosition) => currentPosition !== index))
  }

  const handleSubmitButton = async () => {
    const currentWordString = currentWord.join("")
    const wordScore = calculateFinalScore(currentWordString)
    const isValid = await validateWord(currentWordString)
    if (isValid) {
      setScore((prevScore) => prevScore + wordScore)
      setCurrentWord([])
      setTiles(getRandomLetters(7))
    } else {
      return
    }
  }

  const handleStartGame = () => {
    setGameState(GameState.PLAYING)
    setScore(0)
    setCurrentWord([])
    setTiles(getRandomLetters(7))
  }

  const handleEndGame = () => {
    setGameState(GameState.ENDED)
  }

  const handlePlay = () => {
    setGameState(GameState.IDLE)
    setScore(0)
    setCurrentWord([])
    setTiles([])
  }

  return (
    <>
      <div className="space-y-4">
        {gameState !== GameState.IDLE && <Score currentScore={score} />}
        {gameState === GameState.IDLE && <PreStartScreen handleStartGame={handleStartGame} />}
        {gameState === GameState.PLAYING && (
          <>
            <div className="bg-gray-100 p-6 rounded-lg min-h-[120px] flex flex-col">
              <div className="mb-2 font-medium text-gray-700">Current Word:</div>
              <div className="flex-1 flex items-center justify-center">
                <CurrentWord onTileClick={handleCurrentWordClick} currentWord={currentWord} />
              </div>
            </div>
            <SubmitButton onSubmitClick={handleSubmitButton} currentWord={currentWord} />
            <div className="bg-teal-200 p-6 rounded-lg min-h-[100px] flex items-center justify-center">
              <TileRack onTileClick={handleTileClick} tiles={tiles} />
            </div>
            <div className="text-center">
              <button
                onClick={handleEndGame}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                End Game
              </button>
            </div>
          </>
        )}

        {gameState === GameState.ENDED && (
          <div className="text-center space-y-6">
            <div className="bg-gray-100 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Over!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Final Score: <span className="font-bold text-blue-600">{score}</span>
              </p>
              <div className="space-x-4">
                <button
                  onClick={handlePlay}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
