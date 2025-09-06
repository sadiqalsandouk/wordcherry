import Tile from "./Tile"

interface TileState {
  letter: string
  isUsed: boolean
  usedInWordIndex?: number
}

interface TileRackProps {
  tiles: TileState[]
  onTileClick: (letter: string, index: number) => void
}

export default function TileRack({ tiles, onTileClick }: TileRackProps) {
  return (
    <div className="text-2xl font-black flex flex-col gap-y-2 min-h-[6rem] items-center justify-center w-full max-w-lg mx-auto">
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-row gap-x-2 justify-center">
          {tiles.slice(0, 5).map((tile, index) => (
            <Tile
              key={index}
              letter={tile.letter}
              isUsed={tile.isUsed}
              isInTileRack={true}
              onClick={() => onTileClick(tile.letter, index)}
            />
          ))}
        </div>
        <div className="flex flex-row gap-x-2 justify-center">
          {tiles.slice(5, 10).map((tile, index) => (
            <Tile
              key={index + 5}
              letter={tile.letter}
              isUsed={tile.isUsed}
              isInTileRack={true}
              onClick={() => onTileClick(tile.letter, index + 5)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
