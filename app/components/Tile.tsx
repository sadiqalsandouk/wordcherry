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
      return "bg-gray-300 opacity-50"
    }
    if (isInTileRack) {
      return "bg-white hover:bg-gray-50"
    }
    return "bg-white hover:bg-gray-50"
  }

  const getTextColor = () => {
    if (isInTileRack && isUsed) {
      return "text-gray-500"
    }
    return "text-gray-800 font-black"
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
        hover:scale-105 active:scale-95
        border border-gray-200
        shadow-[0_4px_0_0_#d1d5db] hover:shadow-[0_6px_0_0_#d1d5db] active:shadow-[0_2px_0_0_#d1d5db] active:translate-y-[2px]
        select-none text-xl ${getBackgroundColor()} ${getTextColor()} ${getCursorStyle()}`}
    >
      {letter}
    </div>
  )
}
