interface TileProps {
  letter: string
  key: number
  onClick: () => void
  isUsed?: boolean
  isInTileRack?: boolean
}

export default function Tile({ letter, onClick, isUsed = false, isInTileRack = false }: TileProps) {
  const getBackgroundColor = () => {
    if (isInTileRack && isUsed) {
      return "bg-gray-300"
    }
    if (isInTileRack) {
      return "bg-white hover:bg-green-50"
    }
    return "bg-white hover:bg-red-50"
  }

  const getTextColor = () => {
    if (isInTileRack && isUsed) {
      return "text-gray-500"
    }
    return "text-game-turquoise-dark"
  }

  const getCursorStyle = () => {
    if (isInTileRack && isUsed) {
      return "cursor-not-allowed"
    }
    return "cursor-pointer"
  }

  return (
    <div
      onClick={onClick}
      className={`w-12 h-12 rounded-lg relative
        flex items-center justify-center transition-all duration-200
        hover:scale-105 hover:shadow-lg
        select-none font-bold ${getBackgroundColor()} ${getTextColor()} ${getCursorStyle()}`}
    >
      {letter}
    </div>
  )
}
