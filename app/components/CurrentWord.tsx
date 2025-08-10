"use client"

import Tile from "./Tile"

export default function CurrentWord({
  currentWord,
  onTileClick,
}: {
  currentWord: string[]
  onTileClick: (letter: string, index: number) => void
}) {
  return (
    <div className="mt-10 text-2xl font-black flex flex-row gap-x-2">
      {currentWord.map((letter, index) => (
        <Tile key={index} letter={letter} onClick={() => onTileClick(letter, index)} />
      ))}
    </div>
  )
}
