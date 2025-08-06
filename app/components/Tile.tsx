interface TileProps {
  letter: string
}

export default function Tile({ letter }: TileProps) {
  return (
    <div
      className="w-12 h-12 rounded-lg
        flex items-center justify-center cursor-pointer transition-all duration-200
        hover:scale-105 hover:shadow-lg bg-white
        select-none font-bold text-game-turquoise-dark"
    >
      {letter}
    </div>
  )
}
