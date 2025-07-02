"use client"

import BoardCell from "./BoardCell"

export default function GameBoard() {
  return (
    <div className="grid grid-cols-15 gap-1 p-4">
      {Array.from({ length: 105 }).map((_, index) => (
        <BoardCell
          key={index}
          index={index}
          onClick={() => console.log(`Clicked cell ${index}`)}
        />
      ))}
    </div>
  )
}
