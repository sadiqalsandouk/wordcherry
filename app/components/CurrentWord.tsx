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
    <div className="text-2xl font-black flex flex-row gap-x-2 justify-center w-full">
      <div className="flex flex-row gap-x-2 justify-center flex-wrap items-center min-h-[3rem]">
        {currentWord.map((letter, index) => (
          <Tile
            key={index}
            letter={letter}
            isInTileRack={false}
            onClick={() => onTileClick(letter, index)}
          />
        ))}
      </div>
    </div>
  )
}