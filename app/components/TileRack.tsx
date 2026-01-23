import { Pause } from "lucide-react"
import Tile from "./Tile"

interface TileState {
  letter: string
  isUsed: boolean
  usedInWordIndex?: number
}

interface TileRackProps {
  tiles: TileState[]
  onTileClick: (letter: string, index: number) => void
  onBackspace: () => void
  onPause?: () => void
  /** For multiplayer: team indicator */
  team?: "A" | "B"
}

export default function TileRack({ tiles, onTileClick, onBackspace, onPause, team }: TileRackProps) {
  return (
    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4">
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          {tiles.slice(0, 5).map((tile, index) => (
            <Tile
              key={index}
              letter={tile.letter}
              isUsed={tile.isUsed}
              isInTileRack={true}
              onClick={() => onTileClick(tile.letter, index)}
            />
          ))}
          <button
            onClick={onBackspace}
            className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-black border border-gray-300 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_4px_0_0_#9ca3af] active:shadow-[0_1px_0_0_#9ca3af] active:translate-y-[2px] transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center select-none cursor-pointer"
            title="Remove last letter (Backspace)"
          >
            <svg
              className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-center">
          {tiles.slice(5, 10).map((tile, index) => (
            <Tile
              key={index + 5}
              letter={tile.letter}
              isUsed={tile.isUsed}
              isInTileRack={true}
              onClick={() => onTileClick(tile.letter, index + 5)}
            />
          ))}
          {/* Show pause button for solo mode, or team indicator for multiplayer */}
          {onPause ? (
            <button
              onClick={onPause}
              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-black border border-gray-300 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_4px_0_0_#9ca3af] active:shadow-[0_1px_0_0_#9ca3af] active:translate-y-[2px] transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center select-none cursor-pointer group relative"
              title="Pause game (ESC)"
            >
              <span className="text-2xl md:text-3xl lg:text-4xl">
                <Pause />
              </span>
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Pause
              </div>
            </button>
          ) : team ? (
            <div
              className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center ${
                team === "A"
                  ? "bg-blue-600"
                  : "bg-red-500"
              }`}
              title={team === "A" ? "Blue Team" : "Red Team"}
            >
              <span className={`font-bold text-xs md:text-sm uppercase tracking-wide ${
                team === "A" ? "text-blue-100" : "text-red-100"
              }`}>
                {team === "A" ? "BLUE" : "RED"}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
