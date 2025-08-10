"use client"

import { useEffect, useState } from "react"
import getRandomLetters from "../utils/getRandomLetters"
import TileRack from "./TileRack"
import CurrentWord from "./CurrentWord"
import SubmitButton from "./SubmitButton"

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

  useEffect(() => {
    setTiles(getRandomLetters(7))
  }, [])

  return (
    <>
      <div className="space-y-4">
        <div className="bg-gray-100 p-6 rounded-lg">
          Current Word:
          <CurrentWord onTileClick={handleCurrentWordClick} currentWord={currentWord} />
        </div>
        <SubmitButton currentWord={currentWord} />
        <div className="bg-teal-200 p-6 rounded-lg">
          <TileRack onTileClick={handleTileClick} tiles={tiles} />
        </div>
      </div>
    </>
  )
}
