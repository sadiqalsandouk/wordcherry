"use client"

import { useEffect, useState } from "react"
import getRandomLetters from "../utils/getRandomLetters"
import TileRack from "./TileRack"
import CurrentWord from "./CurrentWord"
import SubmitButton from "./SubmitButton"
import { validateWord } from "../utils/wordValidation"

export default function SoloGame() {
  const [tiles, setTiles] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState<string[]>([])

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
    const isValid = await validateWord(currentWordString)
    if (isValid) {
      console.log("valid")
    } else {
      console.log("invalid")
    }
  }

  useEffect(() => {
    setTiles(getRandomLetters(7))
  }, [])

  return (
    <>
      <div className="space-y-4">
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
      </div>
    </>
  )
}
