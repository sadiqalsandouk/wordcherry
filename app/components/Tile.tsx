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
      className={`${isInTileRack ? 'w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16' : 'w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12'} rounded-lg relative
        flex items-center justify-center transition-all duration-200
        hover:scale-105 active:scale-95
        border border-gray-200
        shadow-[0_4px_0_0_#d1d5db] hover:shadow-[0_6px_0_0_#d1d5db] active:shadow-[0_2px_0_0_#d1d5db] active:translate-y-[2px]
        select-none ${isInTileRack ? 'text-xl md:text-2xl lg:text-3xl' : 'text-lg md:text-xl lg:text-2xl'} ${getBackgroundColor()} ${getTextColor()} ${getCursorStyle()}`}
    >
      {letter}
    </div>
  )
}
