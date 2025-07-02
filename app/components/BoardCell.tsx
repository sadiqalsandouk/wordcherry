"use client"

type BoardCellProps = {
  index: number
  letter?: string
  onClick?: () => void
}

export default function BoardCell({ index, letter, onClick }: BoardCellProps) {
  return (
    <div
      onClick={onClick}
      className="aspect-square border hover:bg-gray-100 flex items-center justify-center cursor-pointer"
      data-cell-index={index}
    >
      {letter && (
        <span className="text-2xl font-bold text-applegramBlue">{letter}</span>
      )}
    </div>
  )
}
