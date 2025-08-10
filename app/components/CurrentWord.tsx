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
      <div
        className="flex flex-row gap-x-2"
        style={{ minWidth: "392px", justifyContent: "center" }}
      >
        {currentWord.map((letter, index) => (
          <Tile key={index} letter={letter} onClick={() => onTileClick(letter, index)} />
        ))}
      </div>
    </div>
  )
}
