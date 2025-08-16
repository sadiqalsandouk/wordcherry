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
    <div className="text-2xl font-black flex flex-row gap-x-2 min-h-[3rem] items-center justify-center w-full">
      <div className="flex flex-row gap-x-2" style={{ width: "392px" }}>
        {tiles.map((tile, index) => (
          <Tile
            key={index}
            letter={tile.letter}
            isUsed={tile.isUsed}
            isInTileRack={true}
            onClick={() => onTileClick(tile.letter, index)}
          />
        ))}
      </div>
    </div>
  )
}
