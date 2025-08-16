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
import PreStartScreen from "./PreStartScreen"
import GameOver from "./GameOver"

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
    const isValid = await validateWord(currentWordString)
    if (isValid) {
      setScore((prevScore) => prevScore + wordScore)
      setCurrentWord([])
      const newLetters = getRandomLetters(7)
      setTiles(newLetters.map((letter) => ({ letter, isUsed: false })))
    } else {
      return
    }
  }

  const handleStartGame = () => {
    setGameState(GameState.PLAYING)
    setScore(0)
    setCurrentWord([])
    const newLetters = getRandomLetters(7)
    setTiles(newLetters.map((letter) => ({ letter, isUsed: false })))
  }

  const handleEndGame = () => {
    setGameState(GameState.ENDED)
  }

  return (
    <>
      <div className="space-y-4">
        {gameState === GameState.IDLE && <PreStartScreen handleStartGame={handleStartGame} />}
        {gameState === GameState.PLAYING && (
          <>
            <Score handleEndGame={handleEndGame} currentScore={score} />
            <div className="bg-gray-100 p-6 rounded-lg min-h-[120px] flex flex-col">
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
          <GameOver score={score} handleStartGame={handleStartGame} />
        )}
      </div>
    </>
  )
}
