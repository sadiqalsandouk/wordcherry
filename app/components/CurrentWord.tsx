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
    <div className="w-full">
      <div className="flex flex-row gap-x-1 md:gap-x-2 justify-center items-center min-h-[3rem] md:min-h-[4rem] lg:min-h-[5rem] overflow-x-auto">
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